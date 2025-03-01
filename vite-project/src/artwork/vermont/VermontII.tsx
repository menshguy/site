import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import {Season} from '../trees/types.ts';
import {VermontTree, drawGroundLine} from '../../helpers/treeHelpers.tsx';
import {drawMoon, drawStars, drawReflection, drawLake, eraseCirclesFromBuffer, Moon, Stars, TimeOfDay} from '../../helpers/skyHelpers.tsx';
import p5 from 'p5';

const mySketch = (p: p5) => {

  let cw: number = 1000; 
  let ch: number = 600;
  let bottom = 200;
  let debug = false;
  let tree: VermontTree;
  let sunAngle: number;
  let sunFillPercentage: number;
  let season: Season;
  let textureImg: p5.Image;
  let colors: Record<any, (s:number, l:number) => () => p5.Color>;
  let treesInFront: VermontTree[] = [];
  let treesInMiddle: VermontTree[] = [];
  let treesInBack: VermontTree[] = [];
  let timeOfDay: TimeOfDay;
  let moonConfig: Moon;
  let starsConfig: Stars;

  p.preload = () => {
    textureImg = p.loadImage('/textures/coldpressed_1.PNG');
  }
  
  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(cw, ch);

    // Clear Trees (ensure they are empty for redraw/setup)
    treesInBack = [];
    treesInMiddle = [];
    treesInFront = [];

    /** Colors */
    colors = {
      green: (s: number = 1, l: number = 1) => () => p.color(p.random(74,107), 40*s, 40.3*l),
      yellow: (s: number = 1, l: number = 1) => () => p.color(p.random(42,46), p.random(67,79.6)*s, 65*l),
      orange: (s: number = 1, l: number = 1) => () => p.color(p.random(27,29), p.random(65,80)*s, 66*l),
      red: (s: number = 1, l: number = 1) => () => p.color(p.random(2,17), p.random(65,77)*s, 67*l),
    }
  
    // Season & Time
    season = 'fall';
    timeOfDay = p.random(["day", "night"]);
    console.log("season", season, timeOfDay)
    
    // Sunlight
    sunAngle = p.radians(p.random(200, 340));
    sunFillPercentage = p.random(0.1, 0.9);
    let sunlight = {angle: sunAngle, fillPercentage: sunFillPercentage}

    /** FRONT TREES */
    let numTreesInFront = 13;
    for (let i = 0; i < numTreesInFront; i++) {

      // Trunk & Tree
      let trunkHeight = p.random(50, 100);
      let trunkWidth = p.random(100, 150);
      let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
      let treeWidth = p.random(trunkWidth+20, 150); // total width including leaves
      let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = 15; // X points are draw within a boundary radius
      let avg = 100
      let numLeavesPerPoint = p.random(avg, avg+(avg/2)); // X leaves are draw around each point.
      let pointBoundaryRadius = {min: 22, max: 25};
      let leavesStartY = p.height - bottom - pointBoundaryRadius.min-10; //where on y axis do leaves start
      let leafWidth = p.random(2, 3);
      let leafHeight = p.random(4, 5);
      let rowHeight = treeHeight/5; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      let startPoint = {x: p.random(-100, cw+100), y: ch-bottom};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + bottom};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - midpoint.y/3))};

      // Colors
      let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
      let fills = timeOfDay === "night" 
        ? colors[fallColor](0.3, .2)
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

    /** MIDDLE TREES */
    let middleBottom = bottom;
    let numTreesInMiddle = 13;
    for (let i = 0; i < numTreesInMiddle; i++) {

      // Trunk & Tree
      let trunkHeight = p.random(150, 200);
      let trunkWidth = p.random(100,150);
      let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
      let treeWidth = p.random(trunkWidth, trunkWidth+20); // total width including leaves
      let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = 10; // X points are draw within a boundary radius
      let pointBoundaryRadius = {min: 28, max: 30};
      let avg = 100
      let numLeavesPerPoint = p.random(avg, avg+(avg/2)); // X leaves are draw around each point.
      let leavesStartY = p.height - middleBottom - pointBoundaryRadius.min; //where on y axis do leaves start
      let leafWidth = p.random(2, 3);
      let leafHeight = p.random(4, 5);
      let rowHeight = treeHeight/10; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      let startPoint = {x: p.random(-100, cw+100), y: ch - middleBottom};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + middleBottom};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - midpoint.y/3))};
      
      
      
      // Colors
      let fallColor = p.random(['green', 'yellow', 'orange', 'red'])
      let fills = timeOfDay === "night" 
        ? colors[fallColor](0.2, 0.1)
        : colors[fallColor](0.5, 0.4)
      let fillsSunlight = timeOfDay === "night" 
        ? colors[fallColor](0.1, 0.5)
        : colors[fallColor](0.5, 0.8);
        
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

      treesInMiddle.push(tree);
    }

    /** BACK TREES */
    let backBottom = middleBottom;
    let numTreesInBack = 15;
    for (let i = 0; i < numTreesInBack; i++) {

      // Trunk & Tree
      let trunkHeight = p.random(215, 250);
      let trunkWidth = p.random(150, 175);
      let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
      let treeWidth = p.random(trunkWidth, trunkWidth+20); // total width including leaves
      let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = 15; // X points are draw within a boundary radius
      let pointBoundaryRadius = {min: 25, max: 30};
      let avg = 150
      let numLeavesPerPoint = p.random(avg, avg+(avg/2)); // X leaves are draw around each point.
      let leavesStartY = p.height - backBottom - pointBoundaryRadius.min; //where on y axis do leaves start
      let leafWidth = p.random(2, 3);
      let leafHeight = p.random(4, 5);
      let rowHeight = treeHeight/10; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      let startPoint = {x: p.random(-100, cw+100), y: ch - backBottom};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + backBottom};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - midpoint.y/3))};

      // Colors
      let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
      let fills = timeOfDay === "night" 
        ? colors[fallColor](0.2, 0.13)
        : colors[fallColor](0.3, 0.5)
      let fillsSunlight = timeOfDay === "night" 
        ? colors[fallColor](0.1, 0.5)
        : colors[fallColor](0.4, 0.75);
      
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

    /** Moon */
    let moonR = p.random(50, 200);
    let moonX = p.map(sunAngle, p.radians(180), p.radians(360), 0, cw);
    let moonY = p.random(0, p.height-bottom-moonR);
    let moonFill = p.color(255, 100, 100);
    moonConfig = {x: moonX, y: moonY, r: moonR, fill: moonFill}

    /** Stars */
    let numStars = 250;
    let starFill = p.color(255, 100, 100);
    let minR = 0.25;
    let maxR = 1;
    let minX = 0;
    let maxX = cw;
    let minY = 0;
    let maxY = p.height - bottom;
    starsConfig = {numStars, fill: starFill, minR, maxR, minX, maxX, minY, maxY}
  }
  
  p.draw = () => {
    p.noLoop();
    
    // Create a buffer for main image to be drawn to.
    let m = p.createGraphics(p.width, p.height)

    // Sky to canvas
    let skyColor = timeOfDay === "night" ? p.color(223,43,18) : p.color("#68ADF6");
    p.push();
    p.noStroke();
    p.fill(skyColor);
    p.rect(0, 0, p.width, p.height);
    p.pop();

    // Draw Moon and Stars to buffer
    if (timeOfDay === "night") {
      drawMoon(m, moonConfig); // Draw Moon
      drawStars(m, starsConfig); // Draw Stars
    }
    
    // Shadow
    p.noStroke();
    p.fill("#27221A");
    p.rect(0, p.height-bottom-50, p.width, 50);
    
    // Sky Reflection
    p.noStroke();
    p.fill(skyColor);
    p.rect(0, p.height-bottom, p.width, p.height);
    
    // Draw trees to a buffer image (this will let us more effeciently create reflection later)
    treesInBack.forEach(tree => {
      tree.leaves.forEach(leaf => tree.drawLeaf(m, leaf));
    })
    treesInMiddle.forEach(tree => {
      m.push();
      m.strokeWeight(1);
      m.noFill();
      m.stroke(12, 10, 55);
      m.stroke(timeOfDay === "night" ? m.color(12, 10, 15) : m.color(12, 10, 55));
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
    p.image(m, 0, 0);

    // Ground Line
    drawGroundLine(p, 25, ch-bottom, cw-25, p.color(27, 20, 18));
    
    // Draw Reflection
    let b = drawReflection(p, m, 0, p.height - bottom, p.width, p.height);
    p.image(b, 0, 0);

    // Draw a rect for the lake, and erase circles from that buffer image
    let lakeFill = timeOfDay === "night" ? p.color(223, 68, 8) : p.color(215, 40.7, 64.2);
    let c = drawLake(p, p.height - bottom, lakeFill);
    let d = eraseCirclesFromBuffer(p, c, p.height - bottom);
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
      p.clear();
      p.setup();
      p.draw();
    }
  };
  
};

const VermontII: React.FC = () => {
  return (
    <div>
      <h1>Vermont II</h1>
      {/* <p>11/14/24</p> */}
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export {mySketch}
export default VermontII;