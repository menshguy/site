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
  let timeOfDay: string;
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
      red: (s: number = 1, l: number = 1) => () => p.color(p.random(2,17), p.random(65,77)*s, 67*l),
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
    timeOfDay = p.random(["day", "night"])
    bgColor = colorsBG[season]

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

      // Sunlight
      let sunlight = {angle: p.PI + p.QUARTER_PI, fillPercentage: p.random(0.75, 0.85)}
      
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
      let leavesStartY = p.height - middleBottom - pointBoundaryRadius.min; //where on y axis do leaves start
      let leafWidth = p.random(2, 3);
      let leafHeight = p.random(4, 5);
      let rowHeight = treeHeight/10; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      let startPoint = {x: p.random(-100, cw+100), y: ch - middleBottom};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + middleBottom};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - midpoint.y/3))};
      
      // Sunlight
      let sunlight = {angle: p.PI + p.QUARTER_PI, fillPercentage: p.random(0.5, 0.75)}
      
      // Colors
      let fallColor = p.random(['green', 'yellow', 'orange', 'red'])
      let fills = timeOfDay === "night" 
        ? colors[fallColor](0.2, 0.1)
        : colors[fallColor](0.5, 0.4)
      let fillsSunlight = timeOfDay === "night" 
        ? colors[fallColor](0.1, 0.2)
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
    let numTreesInBack = 10;
    for (let i = 0; i < numTreesInBack; i++) {

      // Trunk & Tree
      let trunkHeight = p.random(215, 250);
      let trunkWidth = p.random(150, 200);
      let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
      let treeWidth = p.random(trunkWidth, trunkWidth+20); // total width including leaves
      let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = 11; // X points are draw within a boundary radius
      let pointBoundaryRadius = {min: 28, max: 30};
      let avg = 100
      let numLeavesPerPoint = p.random(avg, avg+(avg/2)); // X leaves are draw around each point.
      let leavesStartY = p.height - backBottom - pointBoundaryRadius.min; //where on y axis do leaves start
      let leafWidth = p.random(2, 3);
      let leafHeight = p.random(4, 5);
      let rowHeight = treeHeight/10; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      let startPoint = {x: p.random(-100, cw+100), y: ch - backBottom};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + backBottom};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - midpoint.y/3))};
    
      // Sunlight
      let sunlight = {angle: p.PI + p.QUARTER_PI, fillPercentage: p.random(0.5, 0.75)}

      // Colors
      let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
      let fills = timeOfDay === "night" 
        ? colors[fallColor](0.2, .13)
        : colors[fallColor](0.3, .5)
      let fillsSunlight = timeOfDay === "night" 
        ? colors[fallColor](0.1, .2)
        : colors[fallColor](0.4, .75);
      
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

    // p.background(bgColor);
    
    //Sky
    p.noStroke();
    let skyColor = timeOfDay === "night" ? p.color(223,43,18) : p.color("#68ADF6")
    p.fill(skyColor);
    p.rect(0, 0, p.width, p.height)
    
    //Shadow
    p.noStroke()
    p.fill("#27221A")
    p.rect(0, p.height-bottom-50, p.width, 50)
    
    //Lake Background - this will essentially be the sky color in the lake reflection
    p.noStroke()
    p.fill(skyColor)
    p.rect(0, p.height-bottom, p.width, p.height)
    
    treesInBack.forEach(tree => {
      tree.leaves.forEach(leaf => drawLeaf(p, leaf));
    })

    treesInMiddle.forEach(tree => {
      p.push();
      p.strokeWeight(1);
      p.noFill();
      p.stroke(12, 10, 55);
      p.stroke(timeOfDay === "night" ? p.color(12, 10, 15) : p.color(12, 10, 55));
      drawTrunk(p, tree.trunk, true)
      p.pop();
      tree.leaves.forEach(leaf => drawLeaf(p, leaf));
    })
    
    treesInFront.forEach(tree => {
      p.push();
      p.strokeWeight(1);
      p.noFill()
      p.stroke(timeOfDay === "night" ? p.color(12, 20, 10) : p.color(12, 20, 40));
      drawTrunk(p, tree.trunk, true)
      p.pop();
      tree.leaves.forEach(leaf => drawLeaf(p, leaf));
    })

    // Ground Line
    drawGroundLine(p, 25, ch-bottom, cw-25, colors['red'](1, 0.2)())
    
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
    lakeBuffer.fill(timeOfDay === "night" ? p.color(223, 68, 8) : p.color(215, 40.7, 64.2))
    lakeBuffer.rect(0, p.height-bottom, p.width, p.height)
    // Erase random ovals from the rectangle - start from bottom half of lake to ensure more circles get drawn toward the top
    for (let i = 0; i <= 2; i++) { // Adjust the number of ovals as needed
      let inceptionBuffer = p.createGraphics(cw, ch);
      inceptionBuffer.push();
      let isUpperHalfOfLake = i <= 1
      
      let y = isUpperHalfOfLake
        ? p.random(inceptionBuffer.height-bottom, inceptionBuffer.height-(bottom/2))
        : p.random(inceptionBuffer.height-(bottom/2), inceptionBuffer.height);

      let x = isUpperHalfOfLake
        ? p.random(0, inceptionBuffer.width)
        : p.random([
            100 - p.random(0, 40), 
            inceptionBuffer.width + p.random(0,40)
          ])
      
      let w = isUpperHalfOfLake // Random width of the oval
        ? p.random(800, 1200)
        : p.random(1600, 2000); 
      
      let h = isUpperHalfOfLake // Circle Height increases with y
        ? p.map(y, inceptionBuffer.height-bottom, inceptionBuffer.height-(bottom/2), 5, 30)
        : p.map(y, inceptionBuffer.height-(bottom/2), inceptionBuffer.height, 50, 80);

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