import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import {Season} from './types.ts';
import {VermontTree, drawGroundLine} from './treeHelpers.tsx';
import {drawMoon, drawStars, drawReflection, drawLake, Moon, Stars, TimeOfDay} from './skyHelpers.tsx';
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
  let moon: Moon;
  let stars: Stars;
  
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
    // green = {
    //   light: "#4A5D3F",
    //   medium: "#293410",
    //   dark: "#010100"
    // }
    // yellow = {
    //   light: "#FEF82E"
    // }
  
    // Season & Time
    // season = p.random(['spring', 'winter', 'fall', 'summer']);
    season = 'fall';
    timeOfDay = p.random(["day", "night"]);
    console.log("season", season, timeOfDay)
    
    // Sunlight
    sunAngle = p.radians(p.random(200, 340));
    sunFillPercentage = p.random(
      0.1,
      timeOfDay === 'night' ? 0.5 : 0.9
    );
    let sunlight = {
      angle: sunAngle,
      fillPercentage: sunFillPercentage
    }

    /** FRONT TREES */
    let numTreesInFront = 20;
    for (let i = 0; i < numTreesInFront; i++) {

      // Trunk & Tree
      let trunkHeight = p.random(25, 50);
      let trunkWidth = p.random(25, 50);
      let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
      let treeWidth = p.random(trunkWidth, trunkWidth+20); // total width including leaves
      let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = 3; // X points are draw within a boundary radius
      let avg = 300;
      let numLeavesPerPoint = p.random(avg, avg+(avg/2)); // X leaves are draw around each point.
      let pointBoundaryRadius = {min: 20, max: 30};
      let leavesStartY = p.height - bottom - pointBoundaryRadius.max; //where on y axis do leaves start
      let leafWidth = p.random(2, 2);
      let leafHeight = p.random(3, 3);
      let rowHeight = treeHeight/5; //x points will drawn p.randominly in each row. rows increment up by this amount

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

    /** MIDDLE TREES */
    let numTreesInMiddle = 25;
    for (let i = 0; i < numTreesInMiddle; i++) {

      // Trunk & Tree
      let trunkHeight = p.random(60, 80);
      let trunkWidth = p.random(25, 50);
      let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
      let treeWidth = p.random(trunkWidth, trunkWidth+20); // total width including leaves
      let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = 3; // X points are draw within a boundary radius
      let avg = 300;
      let numLeavesPerPoint = p.random(avg, avg+(avg/2)); // X leaves are draw around each point.
      let pointBoundaryRadius = {min: 20, max: 30};
      let leavesStartY = p.height - bottom - pointBoundaryRadius.max; //where on y axis do leaves start
      let leafWidth = p.random(2, 2);
      let leafHeight = p.random(3, 3);
      let rowHeight = treeHeight/5; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      let startX = i * (cw/numTreesInMiddle)
      let minStartY = ch-bottom-10
      let maxStartY = ch-bottom-50
      let startY = i < numTreesInMiddle/2
        ? p.map(i, 0, numTreesInMiddle/2, minStartY, maxStartY )
        : p.map(i, numTreesInMiddle/2, numTreesInMiddle, maxStartY, minStartY)
      let startPoint = {x: startX, y: startY};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2)};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - treeHeight/3))};
      
      // Colors
      let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
      let fills = timeOfDay === "night" 
        ? colors[fallColor](0.3, .2)
        : colors[fallColor](0.9, .5)
      let fillsSunlight = timeOfDay === "night" 
        ? colors[fallColor](0.1, .5)
        : colors[fallColor](0.8, .95);
        
      // Tree
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
    let numTreesInBack = 15;
    for (let i = 0; i < numTreesInBack; i++) {

      // Trunk & Tree
      let trunkHeight = p.random(25, 50);
      let trunkWidth = p.random(25, 50);
      let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
      let treeWidth = p.random(trunkWidth, trunkWidth+20); // total width including leaves
      let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = 3; // X points are draw within a boundary radius
      let avg = 300
      let numLeavesPerPoint = p.random(avg, avg+(avg/2)); // X leaves are draw around each point.
      let pointBoundaryRadius = {min: 20, max: 30};
      let leavesStartY = p.height - bottom - pointBoundaryRadius.max; //where on y axis do leaves start
      let leafWidth = p.random(1, 1);
      let leafHeight = p.random(2, 2);
      let rowHeight = treeHeight/5; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      let startX = i * (cw/numTreesInMiddle)
      let minStartY = ch-bottom-60
      let maxStartY = ch-bottom-90
      let startY = i < numTreesInMiddle/2
        ? p.map(i, 0, numTreesInMiddle/2, minStartY, maxStartY )
        : p.map(i, numTreesInMiddle/2, numTreesInMiddle, maxStartY, minStartY)
      let startPoint = {x: startX, y: startY};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2)};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - treeHeight/3))};
      
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
      
      treesInBack.push(tree);
    }

    /** Moon */
    let moonR = p.random(50, 200);
    let moonX = p.map(sunAngle, p.radians(180), p.radians(360), 0, cw);
    let moonY = p.random(0, p.height-bottom-moonR);
    moon = {x: moonX, y: moonY, r: moonR}

    /** Stars */
    let numStars = 250;
    let minR = 0.25;
    let maxR = 1;
    let minX = 0;
    let maxX = cw;
    let minY = 0;
    let maxY = p.height - bottom;
    stars = {numStars, minR, maxR, minX, maxX, minY, maxY}
  }
  
  p.draw = () => {
    p.noLoop();

    //Sky
    let skyColor = timeOfDay === "night" ? p.color(223,43,18) : p.color("#68ADF6")
    p.noStroke();
    p.fill(skyColor);
    p.rect(0, 0, p.width, p.height)

    if (timeOfDay === "night") {
      drawMoon(p, moon.x, moon.y, moon.r); // Draw Moon
      drawStars(p, stars.numStars, stars.minX, stars.maxX, stars.minY, stars.maxY, stars.minR, stars.maxR); // Draw Stars
    }
    
    //Shadow
    p.noStroke()
    p.fill(timeOfDay === "night" ? p.color("#27221A") : p.color(30, 30, 40))
    p.rect(0, p.height-bottom-30, p.width, 50)
    
    //Lake Background - this will essentially be the sky color in the lake reflection
    p.noStroke()
    p.fill(skyColor)
    p.rect(0, p.height-bottom, p.width, p.height)
    
    treesInBack.forEach(tree => {
      tree.leaves.forEach(leaf => tree.drawLeaf(p, leaf));
    })

    treesInMiddle.forEach(tree => {
      p.push();
      p.strokeWeight(1);
      p.noFill();
      p.stroke(12, 10, 55);
      p.stroke(timeOfDay === "night" ? p.color(12, 10, 15) : p.color(12, 10, 55));
      tree.drawTrunk(p, tree.trunkLines, true)
      p.pop();
      tree.leaves.forEach(leaf => tree.drawLeaf(p, leaf));
    })
    
    treesInFront.forEach(tree => {
      p.push();
      p.strokeWeight(1);
      p.noFill()
      p.stroke(timeOfDay === "night" ? p.color(12, 20, 10) : p.color(12, 20, 40));
      tree.drawTrunk(p, tree.trunkLines, true)
      p.pop();
      tree.leaves.forEach(leaf => tree.drawLeaf(p, leaf));
    })

    // Ground Line
    drawGroundLine(p, 25, ch-bottom, cw-25, p.color(27, 20, 18))
    
    // Draw Reflection
    let reflectionBuffer = p.createGraphics(cw, ch);
    let allTrees = [...treesInBack, ...treesInMiddle, ...treesInFront];
    drawReflection(
      reflectionBuffer, 
      p, 
      allTrees, 
      reflectionBuffer.height - bottom,
      timeOfDay, 
      moon, 
      stars
    )
    
    // Draw Lake on top of Reflection
    let lakeBuffer = p.createGraphics(cw, ch);
    drawLake(
      lakeBuffer, 
      p,
      lakeBuffer.height - bottom,
      timeOfDay
    );

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
      treesInMiddle = [];
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
      {/* <p>11/14/24</p> */}
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export default VermontIII;