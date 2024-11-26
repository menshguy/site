import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import {Season} from './types.ts';
import {VermontTree, drawGroundLine} from './treeHelpers.tsx';
import {drawMoon, drawStars, drawReflection, drawCirclesToBuffer, Moon, Stars, TimeOfDay} from './skyHelpers.tsx';
import p5 from 'p5';

const mySketch = (p: p5) => {

  let cw: number = 1000; 
  let ch: number = 600;
  let bottom = 300;
  let debug = false;
  let tree: VermontTree;
  let sunAngle: number;
  let sunFillPercentage: number;
  let season: Season;
  let textureImg: p5.Image;
  let colors: Record<any, (s:number, l:number) => () => p5.Color>;
  let treesInFront: VermontTree[] = [];
  let treesInBack: VermontTree[] = [];
  let timeOfDay: TimeOfDay;
  let moonConfig: Moon;
  let starsConfig: Stars;
  
  p.preload = () => {
    textureImg = p.loadImage('../textures/coldpressed_1.PNG');
  }
  
  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(cw, ch);

    /** Colors */
    colors = {
      green: (s: number = 1, l: number = 1) => () => p.color(p.random(74,107), 70*s, 40.3*l),
      yellow: (s: number = 1, l: number = 1) => () => p.color(p.random(42,80), 70*s, 55*l),
      orange: (s: number = 1, l: number = 1) => () => p.color(p.random(27,50), 70*s, 56*l),
      red: (s: number = 1, l: number = 1) => () => p.color(p.random(2,35), 70*s, 57*l),
    }
  
    // Season & Time
    season = 'fall';
    timeOfDay = p.random(["day", "night"]);
    console.log("season", season, timeOfDay)
    
    // Sunlight
    sunAngle = p.radians(p.random(200, 340));
    sunFillPercentage = p.random(0.1, timeOfDay === 'night' ? 0.5 : 1);
    let sunlight = {angle: sunAngle, fillPercentage: sunFillPercentage}

    // Trunk & Tree
    let trunkHeight = p.random(50, 70);
    let trunkWidth = p.random(40, 60);
    let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
    let treeWidth = p.random(trunkWidth, trunkWidth+5); // total width including leaves
    let numTrunkLines = p.random(3,5); //trunks are made up of X bezier curves

    // Points & Leaves
    let numPointsPerRow = 10; // X points are draw within a boundary radius
    let avg = 150;
    let numLeavesPerPoint = p.random(avg, avg+(avg/2)); // X leaves are draw around each point.
    let pointBoundaryRadius = {min: 20, max: 25};
    let leavesStartY = p.height - bottom - pointBoundaryRadius.max; //where on y axis do leaves start
    let leafWidth = p.random(2, 2);
    let leafHeight = p.random(3, 3);
    let rowHeight = treeHeight/3; //x points will drawn p.randominly in each row. rows increment up by this amount

    /** FRONT TREES */
    let numTreesInFront = 50;
    for (let i = 0; i < numTreesInFront; i++) {
      // Start / Mid / Bulge
      let startX = i * (cw/numTreesInFront) + p.random(-10, 10)
      let startPoint = {x: startX, y: ch-bottom};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2)};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - treeHeight/3))};
      
      // Colors
      let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
      let fills = timeOfDay === "night" 
        ? colors[fallColor](0.4, .2)
        : colors[fallColor](0.9, .5)
      let fillsSunlight = timeOfDay === "night" 
        ? colors[fallColor](0.1, .5)
        : colors[fallColor](0.8, .95);
        
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
        fills,
        fillsSunlight, 
        sunlight,
        leafWidth, 
        leafHeight,
        rowHeight,
        midpoint,
        bulgePoint
      });

      treesInFront.push(tree);
    }

    /** BACKGROUND TREES */
    let numBGTreeColumns = 20;
    for (let i = 0; i < numBGTreeColumns; i++) {

      // Start / Mid / Bulge
      let minStartY = ch-bottom;
      let maxStartY = ch-bottom-(treeHeight*i);
      let numTreesInColumn = (minStartY - maxStartY) / treeHeight
      for (let j = numTreesInColumn; j > 0; j--) {
        let startX = i * ( (p.width+treeWidth)/numBGTreeColumns ) + p.random(-25, 25) // add an extra treeWidth for some bufferspace
        let startY = minStartY - (numTreesInColumn * j)
        let startPoint = {x: startX, y: startY};
        let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2)};
        let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - treeHeight/3))};
        
        // Colors
        let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
        let fills = timeOfDay === "night" 
          ? colors[fallColor](0.4, .2)
          : colors[fallColor](0.9, .5)
        let fillsSunlight = timeOfDay === "night" 
          ? colors[fallColor](0.1, .5)
          : colors[fallColor](0.8, .95);
          
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
          fills,
          fillsSunlight, 
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

    /** Moon */
    let moonX = p.map(sunAngle, p.radians(180), p.radians(360), 0, cw);
    let moonY = p.random(0, p.height-bottom);
    let moonR = p.map(moonY, 0, p.height-bottom, 50, 350);
    let moonHue = p.map(moonY, 0, p.height-bottom-moonR, 52, 33)
    let moonFill = p.color(moonHue, 78, 92);
    moonConfig = {x: moonX, y: moonY, r: moonR, fill: moonFill}

    /** Stars */
    let numStars = 650;
    let starFill = p.color(255, 100, 100);
    let minR = 0.25;
    let maxR = 2;
    let minX = 0;
    let maxX = cw;
    let minY = 0;
    let maxY = p.height;
    starsConfig = {numStars, fill: starFill, minR, maxR, minX, maxX, minY, maxY}
  }
  
  p.draw = () => {
    p.noLoop();

    // Create a buffer for main image to be drawn to.
    let m = p.createGraphics(p.width, p.height - (p.height-bottom))

    // Sky to canvas
    let skyColor = timeOfDay === "night" ? p.color(223,43,18) : p.color("#68ADF6")
    p.noStroke();
    p.fill(skyColor);
    p.rect(0, 0, p.width, p.height)

    // Draw Moon and Stars to buffer
    if (timeOfDay === "night") {
      drawMoon(m, moonConfig); // Draw Moon
      drawStars(m, starsConfig); // Draw Stars
    }
    
    // Shadow
    m.noStroke()
    m.fill(timeOfDay === "night" ? m.color(30, 30, 12) : m.color(30, 30, 30))
    m.rect(0, p.height-bottom-18, p.width, 18)
    
    // Sky Reflection
    p.noStroke()
    p.fill(skyColor)
    p.rect(0, p.height-bottom, p.width, p.height)
    
    treesInBack.forEach(tree => {
      m.push();
      m.strokeWeight(1);
      m.noFill()
      m.stroke(timeOfDay === "night" ? m.color(12, 20, 10) : m.color(12, 20, 40));
      tree.drawTrunk(m, tree.trunkLines, true)
      m.pop();

      tree.leaves.forEach(leaf => tree.drawLeaf(m, leaf));
    })
    treesInFront.forEach(tree => {
      m.push();
      m.strokeWeight(1);
      m.noFill()
      m.stroke(timeOfDay === "night" ? m.color(12, 20, 10) : m.color(12, 20, 40));
      tree.drawTrunk(m, tree.trunkLines, true)
      m.pop();

      tree.leaves.forEach(leaf => tree.drawLeaf(m, leaf));
    })
    
    // Draw tree buffer image
    p.image(m, 0, 0)

    // Ground Line
    drawGroundLine(p, 25, ch-bottom, cw-25, timeOfDay === "night" ? m.color(12, 20, 10) : m.color(12, 20, 20))
    
    // Draw Reflection
    let b = drawReflection(p, m, 0, p.height - bottom, p.width, p.height)
    // p.image(b, 0, 0)

    // Draw a rect for the lake, and erase circles from that buffer image
    let lakeFill = timeOfDay === "night" ? p.color(223, 68, 8) : p.color(215, 40.7, 64.2)
    // let c = drawLake(p, p.height - bottom, lakeFill);
    // let d = eraseCirclesFromBuffer(p, c, p.height - bottom)
    let d = drawCirclesToBuffer(p, b, p.height - bottom, lakeFill)
    p.image(d, 0, 0);

    //Draw Texture
    p.blendMode(p.MULTIPLY);
    p.image(textureImg, 0, 0, cw, ch);
    p.blendMode(p.BLEND);
    
    //Debug Helpers
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
      treesInFront = [];
      p.clear();
      p.setup();
      p.draw();
    }
  };
};

const VermontIII: React.FC = () => {
  return (
    <div>
      <h1>Vermont III</h1>
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} includeSaveButton />
    </div>
  );
};

export default VermontIII;