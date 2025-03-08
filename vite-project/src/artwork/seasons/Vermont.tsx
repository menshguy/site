import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import {Season} from '../trees/types.ts';
import {VermontTree, drawGroundLine} from '../../helpers/treeHelpers.tsx';
import p5 from 'p5';
import { drawMoon, drawStars, Moon, Stars } from '../../helpers/skyHelpers.tsx';
import { circle_gradient } from '../../helpers/shapes.ts';

const mySketch = (_cw: number = 1000, _ch: number = 600) => (p: p5) => {
  console.log("Vermont", _cw, _ch)
  let cw: number = _cw; 
  let ch: number = _ch;
  let bottom = 20;
  let s: p5.Graphics;
  let b: p5.Graphics;
  let tree: VermontTree;
  let season: Season;
  let textureImg: p5.Image;
  let colors: Record<Season, (s:number, l:number) => () => p5.Color>;
  let colorsBG: Record<Season, p5.Color>;
  let bgColor: p5.Color;
  let timeOfDay: string;
  let sunAngle: number;
  let sunFillPercentage: number;
  let sunCenter: {x: number, y: number};
  let moonConfig: Moon;
  let starsConfig: Stars;
  let treesInFront: VermontTree[] = [];
  let treesInMiddle: VermontTree[] = [];
  let treesInBack: VermontTree[] = [];
  
  p.preload = () => {
    textureImg = p.loadImage('/textures/watercolor_1.jpg');
  }
  
  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(cw, ch);

    // Clear Trees (this will ensure redrawing works)
    treesInBack = [];
    treesInMiddle = [];
    treesInFront = [];

    /** SEASON & DAYTIME */
    season = p.random(['spring', 'fall', 'summer']);
    timeOfDay = p.random([
      'day', 
      'night'
    ]);
    console.log("season", season)
    
    /** COLORS */
    colors = {
      winter: (s: number = 1, l: number = 1) => () => p.color(p.random(70,130), 20*s, 70*l),
      fall: (s: number = 1, l: number = 1) => () => p.color(p.random(5,45), 65*s, 100*l),
      spring: (s: number = 1, l: number = 1) => () => p.color(p.random(5,45), 75*s, 100*l),
      summer: (s: number = 1, l: number = 1) => () => p.color(p.random(70,125), 80*s, 55*l)
    }
    colorsBG = {
      'summer': p.color(208, 85, 98), //light yellow
      'winter': p.color(208, 18, 98), //deep blue
      'spring': p.color(43, 62, 96), //orange
      'fall': p.color(39, 26, 96) //brown
    }

    // Sunlight
    sunAngle = p.radians(p.random(200, 340));
    sunFillPercentage = p.random(0.05, 0.1);
    sunCenter = {x: p.random(p.random(-100,0), p.random(cw, cw+100)), y: p.random(0, ch-bottom)}
    let sunlight = {angle: sunAngle, fillPercentage: sunFillPercentage}

    /** DAY TIME */
    let treeLightness = timeOfDay === "day" ? 1 : 0.65;
    bgColor = p.color(
      p.hue(colorsBG[season]), 
      p.saturation(colorsBG[season]), 
      p.lightness(colorsBG[season]) * (timeOfDay === "day" ? 0.9 : 0.01)
    );
    
    /** Moon */
    let moonX = p.map(sunAngle, p.radians(180), p.radians(360), 0, cw);
    let moonY = p.random(0, p.height-bottom-(p.height/2)); //moon is drawn toward the middle of the canvas
    let moonR = p.map(moonY, 0, p.height-bottom, 50, 300);
    let moonHue = p.map(moonY, 0, p.height-bottom-moonR, 52, 33)
    let moonFill = p.color(moonHue, 78, 92);
    moonConfig = {x: moonX, y: moonY, r: moonR, fill: moonFill}

    /** Stars */
    let numStars = 650;
    let starFill = p.color(0, 0, 100);
    let minR = 1;
    let maxR = 2;
    let minX = 0;
    let maxX = cw;
    let minY = 0;
    let maxY = p.height - bottom;
    starsConfig = {numStars, fill: starFill, minR, maxR, minX, maxX, minY, maxY}

    /** FRONT TREES */
    let numTreesInFront = p.random(20, 40);
    for (let i = 0; i < numTreesInFront; i++) {

      // Trunk & Tree
      let trunkHeight = p.random(50, ch-bottom-100);
      let trunkWidth = p.random(100, 150);
      let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
      let treeWidth = p.random(trunkWidth+20, 300); // total width including leaves
      let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = p.random(10, 15); // X points are draw within a boundary radius
      let avg = season === "winter" ? 8 : 30
      let numLeavesPerPoint = p.random(avg-(avg/2), avg+(avg/2)); // X leaves are draw around each point.
      let pointBoundaryRadius = {min: 50, max: 60};
      let leavesStartY = p.height - bottom - pointBoundaryRadius.min-10; //where on y axis do leaves start
      let leafWidth = p.random(2, 3);
      let leafHeight = p.random(4, 5);
      let rowHeight = treeHeight/10; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      let startPoint = {x: p.random(-100, cw+100), y: ch-bottom};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + bottom};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - midpoint.y/3))};
    
      /** Create Tree */
      tree = new VermontTree({
        p5Instance: p,
        treeHeight, 
        treeWidth, 
        numTrunkLines, 
        numPointsPerRow,
        numLeavesPerPoint, 
        startPoint, 
        trunkHeight, 
        trunkWidth, 
        leavesStartY,
        pointBoundaryRadius, 
        fills: colors[season](0.9, 0.35*treeLightness),
        fillsSunlight: colors[season](0.45, 0.85*treeLightness),  
        sunlight,
        leafWidth, 
        leafHeight,
        rowHeight,
        midpoint,
        bulgePoint
      });

      treesInFront.push(tree);
    }

    // /** MIDDLE TREES */
    // let middleBottom = bottom;
    // let numTreesInMiddle = 13;
    // for (let i = 0; i < numTreesInMiddle; i++) {

    //   // Trunk & Tree
    //   let trunkHeight = p.random(300, 400);
    //   let trunkWidth = p.random(100,150);
    //   let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
    //   let treeWidth = p.random(trunkWidth+20, 300); // total width including leaves
    //   let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

    //   // Points & Leaves
    //   let numPointsPerRow = p.random(13, 15); // X points are draw within a boundary radius
    //   let pointBoundaryRadius = {min: 20, max: 30};
    //   let avg = season === "winter" ? 5 : 30
    //   let numLeavesPerPoint = p.random(avg-(avg/2), avg+(avg/2)); // X leaves are draw around each point.
    //   let leavesStartY = p.height - middleBottom - pointBoundaryRadius.min; //where on y axis do leaves start
    //   let leafWidth = p.random(2, 3);
    //   let leafHeight = p.random(4, 5);
    //   let rowHeight = treeHeight/10; //x points will drawn p.randominly in each row. rows increment up by this amount

    //   // Start / Mid / Bulge
    //   let startPoint = {x: p.random(-100, cw+100), y: ch - middleBottom};
    //   let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + middleBottom};
    //   let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - midpoint.y/3))};
    
    //   /** Create Tree */
    //   tree = new VermontTree({
    //     p5Instance: p,
    //     treeHeight, 
    //     treeWidth, 
    //     numTrunkLines, 
    //     numPointsPerRow,
    //     numLeavesPerPoint, 
    //     startPoint, 
    //     trunkHeight, 
    //     trunkWidth, 
    //     leavesStartY,
    //     pointBoundaryRadius, 
    //     fills: colors[season](0.6, 0.25*treeLightness), 
    //     fillsSunlight: colors[season](0.65, 0.4*treeLightness), 
    //     sunlight,
    //     leafWidth, 
    //     leafHeight,
    //     rowHeight,
    //     midpoint,
    //     bulgePoint
    //   });

    //   treesInMiddle.push(tree);
    // }

    /** BACK TREES */
    let backBottom = bottom;
    let numTreesInBack = p.random(10, 20);
    for (let i = 0; i < numTreesInBack; i++) {

      // Trunk & Tree
      let trunkHeight = p.random(600, 700);
      let trunkWidth = p.random(200,250);
      let treeHeight = p.random(600, 700); // total height including leaves
      let treeWidth = p.random(trunkWidth+20, 300); // total width including leaves
      let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = 40; // X points are draw within a boundary radius
      let pointBoundaryRadius = {min: 50, max: 60};
      let avg = season === "winter" ? 1 : 55
      let numLeavesPerPoint = p.random(avg-(avg/2), avg+(avg/2)); // X leaves are draw around each point.
      let leavesStartY = p.height - backBottom - pointBoundaryRadius.min; //where on y axis do leaves start
      let leafWidth = p.random(2, 3);
      let leafHeight = p.random(4, 5);
      let rowHeight = treeHeight/10; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      let startPoint = {x: p.random(-100, cw+100), y: ch - backBottom};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + backBottom};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - midpoint.y/3))};
    
      /** Create Tree */
      tree = new VermontTree({
        p5Instance: p,
        treeHeight, 
        treeWidth, 
        numTrunkLines, 
        numPointsPerRow,
        numLeavesPerPoint, 
        startPoint, 
        trunkHeight, 
        trunkWidth, 
        leavesStartY,
        pointBoundaryRadius, 
        fills: colors[season](0.4, 0.35*treeLightness), 
        fillsSunlight: colors[season](0.5, 0.45*treeLightness),
        sunlight,
        leafWidth, 
        leafHeight,
        rowHeight,
        midpoint,
        bulgePoint
      });
      
      treesInBack.push(tree);
    }
  }
  
  p.draw = () => {
    p.noLoop();
    p.background(bgColor);

    /** DRAW SKY */
    if (s) s.remove()
    s = p.createGraphics(cw, ch)
    s.colorMode(s.HSL)
    if (timeOfDay === "night") {
      s.push()
      s.blendMode(p.MULTIPLY);
      drawMoon(s, moonConfig); // Draw Moon
      drawStars(s, starsConfig); // Draw Stars
      // s.filter(s.BLUR, 2);
      s.pop()
      // Draw Sky
      p.image(s, 0, 0, cw, ch)
    } else {
      s.push()
      s.colorMode(s.HSL)
      s.noStroke()
      // s.fill(60, 100, 100)
      circle_gradient(s, sunCenter.x, sunCenter.y, s.random(600, 800), false, s.color(60, 100, 100))
      // s.filter(s.BLUR, 2);
      s.pop()
      p.image(s, 0, 0, cw, ch)
    }

    /** DRAW GROUND */
    p.push()
    p.noStroke()
    p.fill(9, 20, 20)
    p.rect(0, ch-bottom, cw, ch)
    p.pop()
    
    /** DRAW TREES */
    treesInBack.forEach(tree => {
      tree.drawTrunk(p, tree.trunkLines, false)
      tree.leaves.forEach(leaf => !leaf.isSunLeaf && tree.drawLeaf(p, leaf));
      // tree.leaves.forEach(leaf => leaf.isSunLeaf && tree.drawLeaf(p, leaf));
    })
    treesInMiddle.forEach(tree => {
      tree.drawTrunk(p, tree.trunkLines, false)
      tree.leaves.forEach(leaf => !leaf.isSunLeaf && tree.drawLeaf(p, leaf));
      // tree.leaves.forEach(leaf => leaf.isSunLeaf && tree.drawLeaf(p, leaf));
    })
    treesInFront.forEach(tree => {
      tree.leaves.forEach(leaf => leaf.isSunLeaf && tree.drawLeaf(p, leaf));
    })
    treesInFront.forEach(tree => {
      tree.drawTrunk(p, tree.trunkLines, false)
      tree.leaves.forEach(leaf => !leaf.isSunLeaf && tree.drawLeaf(p, leaf));
    })

    const groundColor = timeOfDay === "day" ? colors[season](1, 0.2)() : p.color(0, 0, 0)
    drawGroundLine(p, 25, ch-bottom, cw-25, groundColor)
    
    //Draw Texture
    p.push()
    p.blendMode(p.MULTIPLY);
    p.image(textureImg, 0, 0, cw, ch);
    // p.blendMode(p.BLEND);
    p.pop()

    // Draw sunleaves on top of texture so that it pops.
    // treesInBack.forEach(tree => {
    //   tree.leaves.forEach(leaf => leaf.isSunLeaf && tree.drawLeaf(p, leaf));
    // })
    // treesInMiddle.forEach(tree => {
    //   tree.leaves.forEach(leaf => leaf.isSunLeaf && tree.drawLeaf(p, leaf));
    // })
    // treesInFront.forEach(tree => {
    //   tree.leaves.forEach(leaf => !leaf.isSunLeaf && tree.drawLeaf(p, leaf));
    //   if (timeOfDay === "night") {
    //     tree.leaves.forEach(leaf => leaf.isSunLeaf && tree.drawLeaf(p, leaf));
    //   }
    // })
    
    /** SUN RAYS */
    // Generate Sun rays from center of canvas outwards
    if (timeOfDay === "day") {
      if (b) b.remove()
      b = p.createGraphics(cw, ch)
      let numRays = 10;
      b.colorMode(p.HSL)
      b.clip(() => b.circle(sunCenter.x, sunCenter.y, 100), { invert: true })
      for (let i = 0; i < numRays; i++) {
        drawSunRay(b, sunCenter)
      }
      b.filter(b.BLUR, 5);
      //Draw Sun rays to canvs
      p.image(b, 0, 0, cw, ch)
    }
  }

  function drawSunRay (p: p5.Graphics, center: {x: number, y: number}) {
    const { x, y } = randomBorderPoint(p);
    const alpha = p.random(0.6, 1);
    const strokeWeight = p.random(1, 3);
    p.push()
    p.stroke(0, 0, 100, alpha)
    p.strokeWeight(strokeWeight)
    p.line(center.x, center.y, x, y)
    p.pop()
  }

  function randomBorderPoint (p: p5) {
    const edge = p.floor(p.random(4));
    switch (edge) {
      case 0: return { x: p.random(cw), y: 0 }; // Top edge
      case 1: return { x: cw, y: p.random(ch) }; // Right edge
      case 2: return { x: p.random(cw), y: ch }; // Bottom edge
      case 3: return { x: 0, y: p.random(ch) }; // Left edge
      default: return { x: p.random(cw), y: p.random(ch) };
    }
  };
};

const Vermont: React.FC = () => {
  return (
    <div>
      <h1>Vermont</h1>
      {/* <p>11/14/24</p> */}
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch()} />
    </div>
  );
};

export {mySketch}
export default Vermont;