import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import {Season} from './types.ts';
import {VermontTree, drawTrunk, drawLeaf, drawGroundLine} from './treeHelpers.tsx';
import p5 from 'p5';

const mySketch = (p: p5) => {

  let cw: number = 1000; 
  let ch: number = 600;
  let bottom = p.random(300, 450);
  let debug = false;
  let tree: VermontTree;
  let timeOfDay: string;
  let moonRadius: number = p.random(150, 200);
  let sunAngle: number;
  let sunFillPercentage: number;
  let season: Season;
  let textureImg: p5.Image;
  let colors: Record<any, (s:number, l:number) => () => p5.Color>;
  let colorsBG: Record<Season, p5.Color>;
  let loneTree: VermontTree[] = [];
  let treesInFront: VermontTree[] = [];
  let treesInMiddle: VermontTree[] = [];
  let treesInBack: VermontTree[] = [];
  
  p.preload = () => {
    textureImg = p.loadImage('../textures/coldpressed_1.PNG');
  }
  
  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(cw, ch);

    /** Colors */
    colors = {
      green: (s: number = 1, l: number = 1) => () => p.color(p.random(74,107), 40*s, 40.3*l),
      yellow: (s: number = 1, l: number = 1) => () => p.color(p.random(42,46), p.random(67,79.6)*s, 65*l),
      orange: (s: number = 1, l: number = 1) => () => p.color(p.random(27,29), p.random(65,80)*s, 66*l),
      red: (s: number = 1, l: number = 1) => () => p.color(p.random(2,17), p.random(65,77)*s, 67*l),
    }
    colorsBG = {
      'summer': p.color(56,85,91), //light yellow
      'winter': p.color(208,18,98), //deep blue
      'spring': p.color(43, 62, 90), //orange
      'fall': p.color(39, 26, 83) //brown
    }
  
    /** General Settings */
    // season = p.random(['spring', 'winter', 'fall', 'summer']);
    season = 'fall';
    console.log("season", season)
    timeOfDay = p.random(["day", "night"])
    sunAngle = p.radians(p.random(200, 340));
    sunFillPercentage = p.random(0.1, 0.9);
    console.log("sunAngle / Fill", sunAngle, sunFillPercentage)

    /** LONE TREE */
    let numTree = 1;
    for (let i = 0; i < numTree; i++) {

      // Trunk & Tree
      let trunkHeight = p.random(50, 70);
      let trunkWidth = p.random(20, 30);
      let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
      let treeWidth = p.random(trunkWidth, trunkWidth+20); // total width including leaves
      let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = 3; // X points are draw within a boundary radius
      let avg = 300
      let numLeavesPerPoint = p.random(avg, avg+(avg/2)); // X leaves are draw around each point.
      let pointBoundaryRadius = {min: 20, max: 30};
      let leavesStartY = p.height - bottom - 15; //where on y axis do leaves start
      let leafWidth = p.random(1, 1);
      let leafHeight = p.random(2, 2);
      let rowHeight = treeHeight/5; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      let startPoint = {x: cw/2, y: ch-bottom};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2)};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - treeHeight/3))};

      // Sunlight
      let sunlight = {
        angle: sunAngle,
        fillPercentage: sunFillPercentage
      }
      
      // Colors
      let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
      let fills = timeOfDay === "night" 
        ? colors[fallColor](0.3, .2)
        : colors[fallColor](0.9, .5)
      let fillsSunlight = timeOfDay === "night" 
        ? colors[fallColor](0.1, .3)
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

      loneTree.push(tree);
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
      let leafWidth = p.random(1, 1);
      let leafHeight = p.random(2, 2);
      let rowHeight = treeHeight/5; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      let startPoint = {x: p.random(-100, cw+100), y: ch-bottom};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2)};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - treeHeight/3))};

      // Sunlight
      let sunlight = {
        angle: sunAngle,
        fillPercentage: sunFillPercentage
      }
      
      // Colors
      let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
      let fills = timeOfDay === "night" 
        ? colors[fallColor](0.3, .2)
        : colors[fallColor](0.9, .5)
      let fillsSunlight = timeOfDay === "night" 
        ? colors[fallColor](0.1, .3)
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
      let leavesStartY = p.height - middleBottom - pointBoundaryRadius.max; //where on y axis do leaves start
      let leafWidth = p.random(2, 3);
      let leafHeight = p.random(4, 5);
      let rowHeight = treeHeight/10; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      let startPoint = {x: p.random(-100, cw+100), y: ch - middleBottom};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + middleBottom};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - midpoint.y/3))};
      
      // Sunlight
      let sunlight = {
        angle: sunAngle,
        fillPercentage: sunFillPercentage
      }
      
      // Colors
      let fallColor = p.random(['green', 'yellow', 'orange', 'red'])
      let fills = timeOfDay === "night" 
        ? colors[fallColor](0.2, 0.1)
        : colors[fallColor](0.5, 0.4)
      let fillsSunlight = timeOfDay === "night" 
        ? colors[fallColor](0.1, 0.25)
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
      let leavesStartY = p.height - backBottom - pointBoundaryRadius.max; //where on y axis do leaves start
      let leafWidth = p.random(2, 3);
      let leafHeight = p.random(4, 5);
      let rowHeight = treeHeight/10; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      let startPoint = {x: p.random(-100, cw+100), y: ch - backBottom};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + backBottom};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - midpoint.y/3))};
    
      // Sunlight
      let sunlight = {
        angle: sunAngle,
        fillPercentage: sunFillPercentage
      }

      // Colors
      let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
      let fills = timeOfDay === "night" 
        ? colors[fallColor](0.2, 0.13)
        : colors[fallColor](0.3, 0.5)
      let fillsSunlight = timeOfDay === "night" 
        ? colors[fallColor](0.1, 0.3)
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
  }
  
  p.draw = () => {
    p.noLoop();

    //Sky
    p.noStroke();
    let skyColor = timeOfDay === "night" ? p.color(223,43,18) : p.color("#68ADF6")
    p.fill(skyColor);
    p.rect(0, 0, p.width, p.height)
    if (timeOfDay === "night") {
      drawMoon(p, moonRadius, 0, p.height); // Draw Moon
      drawStars(p, 150, 0, p.height-bottom); // Draw Stars
    }
    
    //Lake Background - this will essentially be the sky color in the lake reflection
    p.noStroke()
    p.fill(skyColor)
    p.rect(0, p.height-bottom, p.width, p.height)
    
    // Tree
    loneTree.forEach(tree => {
      p.push();
      p.strokeWeight(1);
      p.noFill()
      p.stroke(timeOfDay === "night" ? p.color(12, 20, 10) : p.color(12, 20, 40));
      drawTrunk(p, tree.trunk, true)
      p.pop();
      tree.leaves.forEach(leaf => drawLeaf(p, leaf));
    })

    // Ground Line
    drawGroundLine(p, 25, ch-bottom, cw-25, p.color(17, 20, 11))
    
    // Lake
    drawReflection()
    drawLake();

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

  const drawReflection = () => {
    let buffer = p.createGraphics(cw, ch);
    if (timeOfDay === "night"){
      drawMoon(buffer, moonRadius, p.height-bottom+moonRadius, p.height);
      drawStars(buffer, 150, p.height-bottom, p.height);
    }
    buffer.push();
    buffer.colorMode(buffer.HSL);
    buffer.scale(1, -1); // Flip the y-axis to draw upside down
    buffer.translate(0, -(ch-bottom)*2); // Adjust translation for the buffer
    let allTrees = [...treesInBack, ...treesInMiddle, ...treesInFront];
    allTrees.forEach(tree => {
      tree.leaves.forEach(leaf => {
        // Darken and desaturate the reflection leaves
        let c = leaf.fill_c;
        leaf.fill_c = p.color(
          p.hue(c), 
          p.saturation(c) * 0.6, 
          p.lightness(c) * 0.85
        )
        drawLeaf(buffer, leaf)
      });
    });

    buffer.filter(p.BLUR, 3); // Add blur to buffer
    p.image(buffer, 0, 0); // Draw Buffer
    buffer.pop();
  }

  const drawLake = () => {
    // Draw Lake Rect and Erase Circles so that reflection image comes through
    let lakeBuffer = p.createGraphics(cw, ch);
    lakeBuffer.push();
    lakeBuffer.colorMode(lakeBuffer.HSL);
    lakeBuffer.noStroke()
    // lakeBuffer.rect(0, p.height-bottom, p.width, p.height)
    // Erase random ovals from the rectangle - start from bottom half of lake to ensure more circles get drawn toward the top
    // Draw gradient
    let lakeColor = timeOfDay === "night" ? p.color(223, 68, 8) : p.color(215, 40.7, 34.2);
    lakeBuffer.fill(lakeColor);
    lakeBuffer.rect(0, p.height - bottom, p.width, 15);
    for (let y = 15; y < 100; y++) {
      let alpha = p.map(y, 15, 100, 1, 0); // Map y to alpha from 255 to 0
      console.log('Hue:', p.hue(lakeColor), 'Saturation:', p.saturation(lakeColor), 'Lightness:', p.lightness(lakeColor), 'Alpha:', alpha);
      lakeBuffer.fill(p.hue(lakeColor), p.saturation(lakeColor), p.lightness(lakeColor), alpha);
      lakeBuffer.rect(0, p.height - bottom + y, p.width, 1);
    }
    lakeBuffer.pop();
    p.image(lakeBuffer, 0, 0);
  }

  const drawStars = (p: p5, numStars: number, minY: number, maxY: number) => {
    for (let i = 0; i < numStars; i++) {
      let x = p.random(0, cw);
      let y = p.random(minY, maxY);
      let r = p.random(0.25, 1);
      p.noStroke();
      p.fill(255, 100, 100); // white for stars
      p.circle(x, y, r)
    }
  }

  const drawMoon = (p: p5, r: number, minY: number, maxY: number) => {
    let x = p.map(sunAngle, p.radians(180), p.radians(360), 0, cw);
    let y = p.random(minY, maxY);
    p.fill(63, 89, 94); //yellowish white for moon
    p.circle(x, y, r);
  }
  
  // p.mousePressed = redraw(p, cw, ch);
  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      treesInBack = [];
      treesInMiddle = [];
      treesInFront = [];
      loneTree = [];
      p.clear();
      p.setup();
      p.draw();
    }
  };
  
};

const VermontIIII: React.FC = () => {
  return (
    <div>
      <h1>Vermont IIII</h1>
      {/* <p>11/14/24</p> */}
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export default VermontIIII;