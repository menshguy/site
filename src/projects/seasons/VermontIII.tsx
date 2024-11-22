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
  let sunAngle: number;
  let sunFillPercentage: number;
  let season: Season;
  let textureImg: p5.Image;
  let colors: Record<any, (s:number, l:number) => () => p5.Color>;
  let colorsBG: Record<Season, p5.Color>;
  let treesInFront: VermontTree[] = [];
  let treesInMiddle: VermontTree[] = [];
  let treesInBack: VermontTree[] = [];
  let moon: {x: number, y: number, r: number};
  let stars: {numStars: number, minR: number, maxR: number, minX: number, maxX: number, minY: number, maxY: number};
  
  p.preload = () => {
    textureImg = p.loadImage('../textures/coldpressed_1.PNG');
  }
  
  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(cw, ch);

    /** Colors */
    // colors = {
    //   green: (s: number = 1, l: number = 1) => () => p.color(p.random(74,107), 40*s, 40.3*l),
    //   yellow: (s: number = 1, l: number = 1) => () => p.color(p.random(42,46), p.random(67,79.6)*s, 65*l),
    //   orange: (s: number = 1, l: number = 1) => () => p.color(p.random(27,29), p.random(65,80)*s, 66*l),
    //   red: (s: number = 1, l: number = 1) => () => p.color(p.random(2,17), p.random(65,77)*s, 67*l),
    // }
    colors = {
      green: (s: number = 1, l: number = 1) => () => p.color(p.random(74,107), 70*s, 40.3*l),
      yellow: (s: number = 1, l: number = 1) => () => p.color(p.random(42,80), 70*s, 55*l),
      orange: (s: number = 1, l: number = 1) => () => p.color(p.random(27,50), 70*s, 56*l),
      red: (s: number = 1, l: number = 1) => () => p.color(p.random(2,35), 70*s, 57*l),
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
    timeOfDay = p.random(["day", "night"]);
    console.log("season", season, timeOfDay)
    sunAngle = p.radians(p.random(200, 340));
    sunFillPercentage = p.random(0.1, 0.9);

    /** FRONT TREES */
    let numTreesInFront = 50;
    for (let i = 0; i < numTreesInFront; i++) {

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
    let numTreesInMiddle = 13;
    for (let i = 0; i < numTreesInMiddle; i++) {

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
      let startPoint = {x: p.random(-100, cw+100), y: ch-bottom-40};
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
      let startPoint = {x: p.random(-100, cw+100), y: ch-bottom-80};
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
    drawGroundLine(p, 25, ch-bottom, cw-25, p.color(27, 20, 18))
    
    // Lake
    let reflectionBuffer = p.createGraphics(cw, ch);
    drawReflection(reflectionBuffer)
    let lakeBuffer = p.createGraphics(cw, ch);
    drawLake(lakeBuffer);

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

  const drawLake = (buffer: p5.Graphics) => {

    // Create a rectangle for the lake
    buffer.colorMode(buffer.HSL);
    buffer.noStroke()
    buffer.fill(timeOfDay === "night" ? p.color(223, 68, 8) : buffer.color(215, 40.7, 64.2))
    buffer.rect(0, buffer.height-bottom, buffer.width, buffer.height)
    
    // Erase random ovals from the rectangle - the erased sections will expose the reflection underneath
    let eraserBuffer = p.createGraphics(cw, bottom);
    let eraserImage = generateEraserCircles(eraserBuffer, 5)
    
    // Erase the eraserBuffer circles from buffer
    buffer.blendMode(buffer.REMOVE); // For some reason REMOVE gets highlighted as an issue, but it is in the docs: https://p5js.org/reference/p5/blendMode/
    buffer.image(eraserImage, 0, p.height-bottom);
    buffer.blendMode(buffer.BLEND); // Reset to normal blend mode
    
    // Draw the rectangle with erased circles
    p.image(buffer, 0, 0);
  }

  const drawReflection = (buffer: p5.Graphics) => {

    // If its night, draw the moon & stars
    if (timeOfDay === "night"){
      drawMoon(buffer, moon.x, (p.height-bottom) + (p.height - bottom - moon.y), moon.r);
      drawStars(
        p, 
        stars.numStars, 
        stars.minX, 
        stars.maxX, 
        (p.height-bottom) + (p.height - bottom - stars.minY), 
        (p.height-bottom) + (p.height - bottom - stars.maxY), 
        stars.minR, 
        stars.maxR);
    }

    // Flip and translate to draw updside down
    buffer.push();
    buffer.colorMode(buffer.HSL);
    buffer.scale(1, -1); // Flip the y-axis to draw upside down
    buffer.translate(0, -(ch-bottom)*2); // Adjust translation for the buffer
    
    // Draw all of the trees upside down, starting from bottom
    let allTrees = [...treesInBack, ...treesInMiddle, ...treesInFront];
    allTrees.forEach(tree => {
      tree.leaves.forEach(leaf => {
        // Darken and desaturate the reflection leaves
        let c = leaf.fill_c;
        leaf.fill_c = buffer.color(
          buffer.hue(c), 
          buffer.saturation(c) * 0.6, 
          buffer.lightness(c) * 0.85
        )
        drawLeaf(buffer, leaf)
      });
    });
    
    // Add blur and draw to buffer
    buffer.filter(p.BLUR, 3); // Add blur to buffer
    p.image(buffer, 0, 0); // Draw Buffer
    buffer.pop();
  }

  function generateEraserCircles(buffer: p5.Graphics, numCirlces: number) {
    for (let i = 0; i <= numCirlces; i++) { // Adjust the number of ovals as needed
      buffer.push();
      let y = buffer.random(0, buffer.height)
      let x = buffer.random(buffer.width/2 - 100, buffer.width/2 + 100)
      let w = buffer.random(1600, 2000); 
      let h = buffer.map(y, 0, buffer.height, 5, 80);

      // Draw ellipse with soft edges
      buffer.colorMode(buffer.HSL);
      buffer.noStroke();
      buffer.fill("white");
      buffer.ellipse(x, y, w, h);
      let blurAmount = buffer.map(y, 0, buffer.height, 0, 3) // Increase blur as y increases
      buffer.filter(buffer.BLUR, blurAmount); // Apply blur to soften edges
      buffer.pop();
    }
    return buffer;
  }

  const drawStars = (
    p: p5, 
    numStars: number, 
    minX: number, 
    maxX: number, 
    minY: number, 
    maxY: number,
    minR: number,
    maxR: number,
  ) => {
    for (let i = 0; i < numStars; i++) {
      let x = p.random(minX, maxX);
      let y = p.random(minY, maxY);
      let r = p.random(minR, maxR);
      p.noStroke();
      p.fill(255, 100, 100); // white for stars
      p.circle(x, y, r)
    }
  }

  const drawMoon = (p: p5, x: number, y: number, r: number) => {
    p.fill(63, 89, 92); //yellowish white for moon
    p.circle(x, y, r);
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