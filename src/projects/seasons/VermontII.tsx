import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import {Season} from './types.ts';
import {VermontTree, drawTrunk, drawLeaf, drawGroundLine} from './treeHelpers.tsx';
import p5 from 'p5';

const mySketch = (p: p5) => {

  let cw: number = 1000; 
  let ch: number = 600;
  let bottom = 200;
  let debug = false;
  let tree: VermontTree;
  let season: Season;
  let textureImg: p5.Image;
  let colors: Record<any, (s:number, l:number) => () => p5.Color>;
  let colorsSunlight: Record<Season, () => p5.Color>;
  let colorsBG: Record<Season, p5.Color>;
  let bgColor: p5.Color;
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
      yellow: (s: number = 1, l: number = 1) => () => p.color(p.random(42,46), p.random(77,89.6)*s, 70*l),
      orange: (s: number = 1, l: number = 1) => () => p.color(p.random(27,29), p.random(65,80)*s, 70*l),
      red: (s: number = 1, l: number = 1) => () => p.color(p.random(2,7), p.random(55,77)*s, 77*l),
    }
    colorsSunlight = {
      winter: () => p.color(p.random(205,225), 80, 90),
      fall: () => p.color(p.random(15,50), 80, 60),
      spring: () => p.color(p.random(5,60), 75, 70),
      summer: () => p.color(p.random(100,135), 70, 95)
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
    bgColor = colorsBG[season];

    /** FRONT TREES */
    let numTreesInFront = 26;
    for (let i = 0; i < numTreesInFront; i++) {

      // Trunk & Tree
      let trunkHeight = p.random(50, 200);
      let trunkWidth = p.random(100, 150);
      let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
      let treeWidth = p.random(trunkWidth+20, 200); // total width including leaves
      let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = p.random(13,15); // X points are draw within a boundary radius
      let avg = 200
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
    
      /** Create Tree */
      let fallColor = p.random(['green', 'yellow', 'orange', 'red'])
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
        fills: colors[fallColor](1, .5),
        fillsSunlight: colors[fallColor](1, .9),  
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
      let trunkHeight = p.random(200, 250);
      let trunkWidth = p.random(100,150);
      let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
      let treeWidth = p.random(trunkWidth, trunkWidth+20); // total width including leaves
      let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = p.random(13, 15); // X points are draw within a boundary radius
      let pointBoundaryRadius = {min: 28, max: 30};
      let avg = 75
      let numLeavesPerPoint = p.random(avg, avg+(avg/2)); // X leaves are draw around each point.
      let leavesStartY = p.height - middleBottom - pointBoundaryRadius.min; //where on y axis do leaves start
      let leafWidth = p.random(2, 3);
      let leafHeight = p.random(4, 5);
      let rowHeight = treeHeight/10; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      let startPoint = {x: p.random(-100, cw+100), y: ch - middleBottom};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + middleBottom};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - midpoint.y/3))};
    
      /** Create Tree */
      let fallColor = p.random(['green', 'yellow', 'orange', 'red'])
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
        fills: colors[fallColor](0.8, .4),
        fillsSunlight: colors[fallColor](0.8, .8),  
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
      let trunkHeight = p.random(250, 300);
      let trunkWidth = p.random(150, 200);
      let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
      let treeWidth = p.random(trunkWidth, trunkWidth+20); // total width including leaves
      let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = 25; // X points are draw within a boundary radius
      let pointBoundaryRadius = {min: 28, max: 30};
      let avg = 85
      let numLeavesPerPoint = p.random(avg, avg+(avg/2)); // X leaves are draw around each point.
      let leavesStartY = p.height - backBottom - pointBoundaryRadius.min; //where on y axis do leaves start
      let leafWidth = p.random(2, 3);
      let leafHeight = p.random(4, 5);
      let rowHeight = treeHeight/10; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      let startPoint = {x: p.random(-100, cw+100), y: ch - backBottom};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + backBottom};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - midpoint.y/3))};
    
      /** Create Tree */
      let fallColor = p.random(['green', 'yellow', 'orange', 'red'])
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
        fills: colors[fallColor](0.5, .5),
        fillsSunlight: colors[fallColor](0.6, .75),  
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
    p.fill(bgColor)
    p.rect(0,0,cw,ch);
    
    //Sky
    p.noStroke()
    p.fill("#68ADF6")
    p.rect(0, 0, p.width, p.height)
    
    //Shadow
    p.noStroke()
    p.fill("#27221A")
    p.rect(0, 180, p.width, p.height)
    
    //Lake
    p.noStroke()
    p.fill("#41669a")
    p.rect(0, p.height-bottom, p.width, p.height)
    
    treesInBack.forEach(tree => {
      // drawTrunk(p, tree.trunk, false)
      tree.leaves.forEach(leaf => drawLeaf(p, leaf));
    })
    treesInMiddle.forEach(tree => {
      p.push();
      p.strokeWeight(1);
      p.noFill();
      p.stroke(12, 10, 55);
      drawTrunk(p, tree.trunk, true)
      p.pop();
      tree.leaves.forEach(leaf => drawLeaf(p, leaf));
    })
    treesInFront.forEach(tree => {
      p.push();
      p.strokeWeight(1);
      p.noFill()
      p.stroke(12, 20, 40);
      drawTrunk(p, tree.trunk, true)
      p.pop();
      tree.leaves.forEach(leaf => drawLeaf(p, leaf));
    })

    drawGroundLine(p, 25, ch-bottom, cw-25, colors['red'](1, 0.2)())
    // Draw water reflection
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
    buffer.push();
    buffer.colorMode(buffer.HSL);
    buffer.scale(1, -1); // Flip the y-axis to draw upside down
    buffer.translate(0, -p.height-bottom); // Adjust translation for the buffer
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
    lakeBuffer.fill("#8DA9CF")
    lakeBuffer.rect(0, p.height-bottom, p.width, p.height)
    // Erase random ovals from the rectangle - start from bottom half of lake to ensure more circles get drawn toward the top
    for (let i = 0; i <= 4; i++) { // Adjust the number of ovals as needed
      let inceptionBuffer = p.createGraphics(cw, ch);
      inceptionBuffer.push();
      let x = inceptionBuffer.random(0, inceptionBuffer.width);
      let y = i <= 3
        ? inceptionBuffer.random(inceptionBuffer.height-bottom, inceptionBuffer.height-(bottom/2))
        : inceptionBuffer.random(inceptionBuffer.height-(bottom/2), inceptionBuffer.height);
      let w = inceptionBuffer.random(600, 1000); // Random width of the oval
      let h = inceptionBuffer.map(y, inceptionBuffer.height-bottom, inceptionBuffer.height, 5, 50); // Height increases with y

      // console.log(`Oval ${i}: x=${x}, y=${y}, w=${w}, h=${h}`); // Debugging output
      // console.log(inceptionBuffer.height-bottom, inceptionBuffer.height-(bottom/2)); // Debugging output
      
      // Draw ellipse with soft edges
      inceptionBuffer.colorMode(inceptionBuffer.HSL);
      inceptionBuffer.noStroke();
      inceptionBuffer.fill("white");
      inceptionBuffer.ellipse(x, y, w, h);
      let blurAmount = p.map(y, inceptionBuffer.height-bottom, inceptionBuffer.height, 0, 5) // Increase blur as y increases
      inceptionBuffer.filter(p.BLUR, blurAmount); // Apply blur to soften edges
      inceptionBuffer.pop();
      
      // Erase the inceptionBuffer circles from lakeBuffer
      lakeBuffer.blendMode(lakeBuffer.REMOVE); // For some reason REMOVE gets highlighted as an issue, but it is in the docs: https://p5js.org/reference/p5/blendMode/
      lakeBuffer.image(inceptionBuffer, 0, 0);
      lakeBuffer.blendMode(lakeBuffer.BLEND); // Reset to normal blend mode
    }
    lakeBuffer.pop();
    p.image(lakeBuffer, 0, 0);
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

export default VermontII;