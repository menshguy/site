import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import {Season} from './types.ts';
import {VermontTree, drawTrunk, drawLeaf, drawGroundLine} from './treeHelpers.tsx';
import p5 from 'p5';

const mySketch = (p: p5) => {

  let cw: number = 1000; 
  let ch: number = 600;
  let bottom = 20;
  let debug = false;
  let tree: VermontTree;
  let season: Season;
  let textureImg: p5.Image;
  let colors: Record<Season, (s:number, l:number) => () => p5.Color>;
  let colorsBG: Record<Season, p5.Color>;
  let bgColor: p5.Color;
  let treesInFront: VermontTree[] = [];
  let treesInMiddle: VermontTree[] = [];
  let treesInBack: VermontTree[] = [];
  
  p.preload = () => {
    textureImg = p.loadImage('../textures/watercolor_1.jpg');
  }
  
  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(cw, ch);

    /** Colors */
    colors = {
      winter: (s: number = 1, l: number = 1) => () => p.color(p.random(70,130), 20*s, 70*l),
      fall: (s: number = 1, l: number = 1) => () => p.color(p.random(5,45), 65*s, 100*l),
      spring: (s: number = 1, l: number = 1) => () => p.color(p.random(5,45), 75*s, 100*l),
      summer: (s: number = 1, l: number = 1) => () => p.color(p.random(70,125), 80*s, 55*l)
    }
    colorsBG = {
      'summer': p.color(56,85,91), //light yellow
      'winter': p.color(208,18,98), //deep blue
      'spring': p.color(43, 62, 90), //orange
      'fall': p.color(39, 26, 83) //brown
    }
  
    /** General Settings */
    season = p.random(['spring', 'fall', 'summer']);
    console.log("season", season)
    bgColor = colorsBG[season];

    /** FRONT TREES */
    let numTreesInFront = 26;
    for (let i = 0; i < numTreesInFront; i++) {

      // Trunk & Tree
      let trunkHeight = p.random(50, 250);
      let trunkWidth = p.random(200, 200);
      let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
      let treeWidth = p.random(trunkWidth+20, 300); // total width including leaves
      let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = p.random(10,11); // X points are draw within a boundary radius
      let avg = season === "winter" ? 8 : 40
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
        fills: colors[season](0.8, 0.55),
        fillsSunlight: colors[season](0.8, 0.7),  
        leafWidth, 
        leafHeight,
        rowHeight,
        midpoint,
        bulgePoint
      });

      treesInFront.push(tree);
    }

    /** MIDDLE TREES */
    let middleBottom = bottom;
    let numTreesInMiddle = 29;
    for (let i = 0; i < numTreesInMiddle; i++) {

      // Trunk & Tree
      let trunkHeight = p.random(300, 400);
      let trunkWidth = p.random(100,150);
      let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
      let treeWidth = p.random(trunkWidth+20, 300); // total width including leaves
      let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = p.random(13, 15); // X points are draw within a boundary radius
      let pointBoundaryRadius = {min: 20, max: 30};
      let avg = season === "winter" ? 5 : 30
      let numLeavesPerPoint = p.random(avg-(avg/2), avg+(avg/2)); // X leaves are draw around each point.
      let leavesStartY = p.height - middleBottom - pointBoundaryRadius.min; //where on y axis do leaves start
      let leafWidth = p.random(2, 3);
      let leafHeight = p.random(4, 5);
      let rowHeight = treeHeight/10; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      let startPoint = {x: p.random(-100, cw+100), y: ch - middleBottom};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + middleBottom};
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
        fills: colors[season](0.6, 0.4), 
        fillsSunlight: colors[season](0.65, 0.5), 
        leafWidth, 
        leafHeight,
        rowHeight,
        midpoint,
        bulgePoint
      });

      treesInMiddle.push(tree);
    }

    /** BACK TREES */
    let backBottom = middleBottom;
    let numTreesInBack = 14;
    for (let i = 0; i < numTreesInBack; i++) {

      // Trunk & Tree
      let trunkHeight = p.random(600, 700);
      let trunkWidth = p.random(200,250);
      let treeHeight = p.random(600, 700); // total height including leaves
      let treeWidth = p.random(trunkWidth+20, 300); // total width including leaves
      let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = p.random(30, 35); // X points are draw within a boundary radius
      let pointBoundaryRadius = {min: 50, max: 60};
      let avg = season === "winter" ? 1 : 25
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
        fills: colors[season](0.4, 0.2), 
        fillsSunlight: colors[season](0.5, 0.2),
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
    p.background(bgColor)
    
    treesInBack.forEach(tree => {
      drawTrunk(p, tree.trunk, false)
      tree.leaves.forEach(leaf => !leaf.isSunLeaf && drawLeaf(p, leaf));
      tree.leaves.forEach(leaf => leaf.isSunLeaf && drawLeaf(p, leaf));
    })
    treesInMiddle.forEach(tree => {
      drawTrunk(p, tree.trunk, false)
      tree.leaves.forEach(leaf => !leaf.isSunLeaf && drawLeaf(p, leaf));
      // tree.leaves.forEach(leaf => leaf.isSunLeaf && drawLeaf(p, leaf));
    })
    treesInFront.forEach(tree => {
      drawTrunk(p, tree.trunk, false)
      tree.leaves.forEach(leaf => !leaf.isSunLeaf && drawLeaf(p, leaf));
      // tree.leaves.forEach(leaf => leaf.isSunLeaf && drawLeaf(p, leaf));
    })

    drawGroundLine(p, 25, ch-bottom, cw-25, colors[season](1, 0.2)())
    
    //Draw Texture
    p.blendMode(p.MULTIPLY);
    p.image(textureImg, 0, 0, cw, ch);
    p.blendMode(p.BLEND);

    // Draw sunleaves on top of texture so that it pops.
    // treesInBack.forEach(tree => {
    //   tree.leaves.forEach(leaf => leaf.isSunLeaf && drawLeaf(p, leaf));
    // })
    // treesInMiddle.forEach(tree => {
    //   tree.leaves.forEach(leaf => leaf.isSunLeaf && drawLeaf(p, leaf));
    // })
    treesInFront.forEach(tree => {
      tree.leaves.forEach(leaf => !leaf.isSunLeaf && drawLeaf(p, leaf));
      // tree.leaves.forEach(leaf => leaf.isSunLeaf && drawLeaf(p, leaf));
    })

    if (debug) {
      //bulge
      p.stroke("red")
      p.strokeWeight(3)
      p.line(0, tree.bulgePoint.y, cw, tree.bulgePoint.y)
      p.stroke("yellow")
      p.point(tree.bulgePoint.x, tree.bulgePoint.y)
      //width
      p.stroke("green")
      p.line(tree.startPoint.x - tree.treeWidth/2, 0, tree.startPoint.x - tree.treeWidth/2, ch)
      p.line(tree.startPoint.x + tree.treeWidth/2, 0, tree.startPoint.x + tree.treeWidth/2, ch)
      //height
      p.stroke("blue")
      p.line(0, ch - tree.treeHeight - bottom, cw, ch - tree.treeHeight - bottom)
      //points
      tree.points.forEach(treePoint => {
        p.strokeWeight(5);
        p.stroke("red");
        p.point(treePoint.x, treePoint.y)
      })
    }
  }
  
  // p.mousePressed = redraw(p, cw, ch);
  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      treesInBack = [];
      treesInMiddle = [];
      treesInFront = [];
      p.clear();
      p.setup();
      p.draw();
    }
  };
  
};

const Vermont: React.FC = () => {
  return (
    <div>
      <h1>Vermont</h1>
      {/* <p>11/14/24</p> */}
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export default Vermont;