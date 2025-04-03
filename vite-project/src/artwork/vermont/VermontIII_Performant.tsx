import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import {VermontTreePerformant, VermontTreePerformantSettings, TreeColorPalette, Season, TimeOfDay} from '../classes/VermontTreePerformant.tsx';
import {VermontForest, VermontForestShapes} from '../classes/VermontForest.tsx';
// import {shuffleArray} from '../../helpers/arrays.ts';
import {drawMoon, drawStars, Moon, Stars} from '../../helpers/skyHelpers.tsx';
import p5 from 'p5';
import { rect_gradient } from '../../helpers/shapes.ts';

const mySketch = (p: p5) => {

  let cw: number = 1200; 
  let ch: number = 800;
  let bottom = 300;
  let debug = false;
  let tree: VermontTreePerformant;
  let sunAngle: number;
  let sunFillPercentage: number;
  let season: Season;
  // let textureImg: p5.Image;
  let colors: Record<any, (s:number, l:number) => () => p5.Color>;
  let fgTrees: VermontTreePerformant[] = [];
  let mgTrees: VermontTreePerformant[] = [];
  let bgTrees: VermontTreePerformant[] = [];
  let fgForest: VermontForest;
  let timeOfDay: TimeOfDay;
  let moonConfig: Moon;
  let starsConfig: Stars;
  
  // p.preload = () => {
  //   textureImg = p.loadImage('/textures/coldpressed_1.PNG');
  // }
  
  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(cw, ch);

    // Clear Trees (ensure they are empty for redraw/setup)
    bgTrees = [];
    mgTrees = [];
    fgTrees = [];

     // Season & Time
     season = p.random([
      // 'winter', 
      'fall', 
      // 'spring', 
      // 'summer'
    ]);
     timeOfDay = p.random([
       "day", 
       // "night"
     ]);
    
     //  console.log("Season: ", season, "Time of Day: ", timeOfDay)

    /** Colors */
    const PALETTES: Record<TimeOfDay, Record<Season, TreeColorPalette[]>> = {
      day: {
        fall: [
          {base: p.color(p.random(74,107), 70, 40.3), highlight: p.color(p.random(74,107), 70, 70.3), shadow: p.color(p.random(74,107), 70, 40.3)}, // Green
          {base: p.color(p.random(42,80), 70, 55), highlight: p.color(p.random(42,80), 70, 70.3), shadow: p.color(p.random(42,80), 70, 55)}, // Yellow
          {base: p.color(p.random(27,50), 70, 56), highlight: p.color(p.random(27,50), 70, 70.3), shadow: p.color(p.random(27,50), 70, 56)}, // Orange
          {base: p.color(p.random(2,35), 70, 57), highlight: p.color(p.random(2,35), 70, 70.3), shadow: p.color(p.random(2,35), 70, 57)}, // Red
        ],
        winter: [],
        spring: [],
        summer: []
      },
      night: {
        fall: [
          {base: p.color(p.random(74,107), 70, 40.3), highlight: p.color(p.random(74,107), 70, 40.3), shadow: p.color(p.random(74,107), 70, 40.3)}, // Green
          {base: p.color(p.random(42,80), 70, 55), highlight: p.color(p.random(42,80), 70, 55), shadow: p.color(p.random(42,80), 70, 55)}, // Yellow
          {base: p.color(p.random(27,50), 70, 56), highlight: p.color(p.random(27,50), 70, 56), shadow: p.color(p.random(27,50), 70, 56)}, // Orange
          {base: p.color(p.random(2,35), 70, 57), highlight: p.color(p.random(2,35), 70, 57), shadow: p.color(p.random(2,35), 70, 57)}, // Red
        ],
        winter: [],
        spring: [],
        summer: []

      }
    };


    // Sun and Moonlight Settings
    const LIGHTSETTINGS = {
      day: {
        lightAngle: p.radians(p.random(200, 340)), 
        lightFillPercentage: p.random(0.15, 0.55)
      },
      night: {
        lightAngle: p.radians(p.random(200, 340)), 
        lightFillPercentage: p.random(0.55, 0.5)
      }
    }

    /** 
     * FOREGROUND FOREST 
     */
    // Forest Settings
    const forestWidth = p.width;
    const forestHeight = 250;
    const forestStartX = 100;
    const forestStartY = ch - bottom;
    const forestNumberOfColumns = 5;
    const forestShape: VermontForestShapes = 'upHill';
    const forestTreeSettings = {
      trunkSpace: 20, // Space to expose bottom of trunks, between bottom of tree and where leaves start
      minHeight: 30, 
      maxHeight: 100, 
      minWidth: 50, 
      maxWidth: 80, 
    }
    const forestTrunkSettings = {
      numTrunkLines: 5, 
      trunkHeight: 60,
      trunkWidth: 40, 
    }
    const forestLeafSettings = {
      rows: 10,
      numPointsPerRow: 10, 
      numLeavesPerPoint: 1000, 
      minBoundaryRadius: 30,
      maxBoundaryRadius: 50,
      leafWidth: 2, 
      leafHeight: 2,
      rowHeight: 10, // REMOVE this and calcuate within
    }
    const forestPalette: TreeColorPalette[] = PALETTES[timeOfDay][season];
    const forestLightSettings = LIGHTSETTINGS[timeOfDay];


    fgForest = new VermontForest({
      p5Instance: p,
      settings: {
        forestStartX,
        forestStartY,
        forestNumberOfColumns,
        forestHeight,
        forestWidth,
        forestShape,
        forestTreeSettings,
        forestTrunkSettings,
        forestLeafSettings,
        forestPalette,
        forestLightSettings,
      }
    });
    

    // /** MIDGROUND TREES */
    // let numMGTreeColumns = 20;
    // for (let i = 0; i < numMGTreeColumns; i++) {

    //   // Forest Settings
    //   const minTreeHeight = 70;
    //   const maxTreeHeight = 100;
    //   const centerIndex = (numMGTreeColumns - 1) / 2;
    //   const maxHeight = minTreeHeight * 3;
    //   const treeHeight = minTreeHeight;
    //   const forestStartX = -200
    //   const forestStartY = ch - bottom;
    //   const {columnStartY, incrementY, numTreesInColumn} = getForestShape("downHill", treeHeight, maxHeight, i, centerIndex, numMGTreeColumns) ?? {columnStartY: 0, incrementY: 0, numTreesInColumn: 0};
      
    //   for (let j = numTreesInColumn; j >= 0; j--) {

    //     // Tree Settings
    //     let trunkHeight = p.random(minTreeHeight, maxTreeHeight);
    //     let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
    //     let trunkWidth = p.random(40, 100);
    //     let treeWidth = p.random(trunkWidth, trunkWidth+5); // total width including leaves
    //     let numTrunkLines = p.random(3,5); //trunks are made up of X bezier curves
    //     let rowHeight = treeHeight/5; //x points will drawn p.randominly in each row. rows increment up by this amount
    //     let startX = forestStartX + (i * ( (p.width+treeWidth)/numMGTreeColumns ) + p.random(-25, 25)) // add an extra treeWidth for some bufferspace
    //     let startY = forestStartY + columnStartY - (incrementY * j)
    //     let startPoint = {x: startX, y: startY};
    //     let midpoint = {x: startPoint.x, y: startPoint.y - (treeHeight/2)};
    //     let bulgePoint = { x: midpoint.x, y: startPoint.y - (treeHeight/3)};
        
    //     // Colors
    //     let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
    //     let fills = timeOfDay === "night" 
    //       ? colors[fallColor](0.3, .15)
    //       : colors[fallColor](0.6, .45)
    //     let fillsSunlight = timeOfDay === "night" 
    //       ? colors[fallColor](0.1, .3)
    //       : colors[fallColor](0.6, .55);
          
    //     /** Create Tree */
    //     tree = new VermontTree({
    //       p5Instance: p,
    //       treeHeight, 
    //       treeWidth, 
    //       numTrunkLines, 
    //       numPointsPerRow,
    //       numLeavesPerPoint, 
    //       startPoint, 
    //       trunkHeight, 
    //       trunkWidth, 
    //       leavesStartY,
    //       pointBoundaryRadius, 
    //       fills,
    //       fillsSunlight, 
    //       sunlight,
    //       leafWidth, 
    //       leafHeight,
    //       rowHeight,
    //       midpoint,
    //       bulgePoint
    //     });

    //     mgTrees.push(tree);
    //   }
    // }
   
    // /** BACKGROUND TREES */
    // let numBGTreeColumns = 25;
    // for (let i = 0; i < numBGTreeColumns; i++) {

    //   // Tree Setting Overrides
    //   let pointBoundaryRadius = {min: 15, max: 20};
    //   let leafHeight = 2;
    //   let leafWidth = 2;
    //   let numPointsPerRow = 4;
    //   let numLeavesPerPoint = 80;

    //   // Forest Settings
    //   const minTreeHeight = 40;
    //   const maxTreeHeight = 60;
    //   const centerIndex = (numBGTreeColumns - 1) / 2;
    //   const maxHeight = minTreeHeight * 3;
    //   const treeHeight = minTreeHeight;
    //   const forestStartX = 0
    //   const forestStartY = ch - bottom - 180;
    //   const {columnStartY, incrementY, numTreesInColumn} = getForestShape("flat", treeHeight, maxHeight, i, centerIndex, numBGTreeColumns) ?? {columnStartY: 0, incrementY: 0, numTreesInColumn: 0};
      
    //   for (let j = numTreesInColumn; j >= 0; j--) {

    //     // Tree Settings
    //     let trunkHeight = p.random(minTreeHeight, maxTreeHeight);
    //     let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
    //     let trunkWidth = p.random(40, 100);
    //     let treeWidth = p.random(trunkWidth, trunkWidth+5); // total width including leaves
    //     let numTrunkLines = p.random(3,5); //trunks are made up of X bezier curves
    //     let rowHeight = treeHeight/5; //x points will drawn p.randominly in each row. rows increment up by this amount
    //     let startX = forestStartX + (i * ( (p.width+treeWidth)/numBGTreeColumns ) + p.random(-25, 25)) // add an extra treeWidth for some bufferspace
    //     let startY = forestStartY + columnStartY - (incrementY * j)
    //     let startPoint = {x: startX, y: startY};
    //     let midpoint = {x: startPoint.x, y: startPoint.y - (treeHeight/2)};
    //     let bulgePoint = { x: midpoint.x, y: startPoint.y - (treeHeight/3)};
        
    //     // Colors
    //     let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
    //     let fills = timeOfDay === "night" 
    //       ? colors[fallColor](0.1, .052)
    //       : colors[fallColor](0.35, .9)
    //     let fillsSunlight = timeOfDay === "night" 
    //       ? colors[fallColor](0.15, .06)
    //       : colors[fallColor](0.4, .95);
          
    //     /** Create Tree */
    //     tree = new VermontTree({
    //       p5Instance: p,
    //       treeHeight, 
    //       treeWidth, 
    //       numTrunkLines, 
    //       numPointsPerRow,
    //       numLeavesPerPoint, 
    //       startPoint, 
    //       trunkHeight, 
    //       trunkWidth, 
    //       leavesStartY,
    //       pointBoundaryRadius, 
    //       fills,
    //       fillsSunlight, 
    //       sunlight,
    //       leafWidth, 
    //       leafHeight,
    //       rowHeight,
    //       midpoint,
    //       bulgePoint
    //     });

    //     bgTrees.push(tree);
    //   }
    // }

    // shuffleArray(fgTrees)

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
    p.clear();

    // Buffer for background image to be drawn to.
    let bg = p.createGraphics(p.width, p.height)
    bg.colorMode(bg.HSL)
    
    // Buffer for midground image to be drawn to.
    let mg = p.createGraphics(p.width, p.height)
    mg.colorMode(mg.HSL)
    
    // Buffer for foreground image to be drawn to.
    let fg = p.createGraphics(p.width, p.height)
    fg.colorMode(fg.HSL)
    
    // Buffer for moon image to be drawn to.
    let moonBuffer = p.createGraphics(p.width, p.height)
    moonBuffer.colorMode(moonBuffer.HSL)
    
    // Buffer for stars image to be drawn to.
    let starsBuffer = p.createGraphics(p.width, p.height)
    starsBuffer.colorMode(starsBuffer.HSL)

    // Sky to canvas
    let skyColor = timeOfDay === "night" ? p.color(223,43,18) : p.color(211, 88.8, 68.6)
    p.noStroke();
    p.fill(skyColor);
    p.rect(0, 0, p.width, p.height)

    // Add Moon and Stars to buffer
    if (timeOfDay === "night") {
      drawMoon(moonBuffer, moonConfig); // Draw Moon
      drawStars(starsBuffer, starsConfig); // Draw Stars
    }
    
    // Draw Shadow (The dark area under the trees)
    let shadowColor = timeOfDay === "night" ? p.color(30, 30, 5) : p.color(211, 30, 22)
    mg.push()
    mg.noStroke()
    mg.fill(shadowColor)
    mg.rect(0, p.height-bottom-30, p.width, 30)
    rect_gradient(mg, 0, p.height-bottom-60, p.width, 30, true, shadowColor)
    mg.pop()

    // Draw Sky Reflection
    p.noStroke()
    p.fill(skyColor)
    p.rect(0, p.height-bottom, p.width, p.height)
    
    // const fgWidth = p.width - fgForest.settings.forestStartX;
    // const fgHeight = p.height - fgForest.settings.forestStartY;
    const fgForestBuffer = fgForest.getImage(p.width, p.height);
    p.image(fgForestBuffer, 0, 0);
    

    // Draw tree buffers
    // if (timeOfDay === "night") {
    //   p.image(moonBuffer, 0, 0)
    //   p.image(starsBuffer, 0, 0)
    // }
    
    // // Draw bg Trees
    // p.push()
    // p.image(bg, 0, 0)
    // p.filter(p.BLUR, 2);
    // p.pop()
    
    // // Draw mg Trees
    // p.push()
    // p.image(mg, 0, 0)
    // p.filter(p.BLUR, 1);
    // p.pop()
    
    // // Draw fg Trees
    // p.image(fg, 0, 0)
    
    // Draw tree buffer image shadow
    // p.push()
    // p.scale(-1, 1)
    // p.tint(100, 80);
    // p.translate(-p.width, 0);
    // p.image(mg, 0, 0);
    // p.noTint();
    // p.pop()

    // Ground Line
    drawGroundLine(p, 25, ch-bottom, cw-25, timeOfDay === "night" ? mg.color(12, 20, 10) : mg.color(12, 20, 20))
    
    // Create Reflection Buffer and draw all relevant images to it (trees, moon, etc)
    const reflectionBuffer = p.createGraphics(p.width, p.height) // Reflection Buffer
    // if (timeOfDay === "night") {
    //   addReflectionImageToReflection(reflectionBuffer, moonBuffer)
    //   addReflectionImageToReflection(reflectionBuffer, starsBuffer)
    // }
    addReflectionImageToReflection(reflectionBuffer, fgForestBuffer) // Add all of the reflection images to a single buffer image
    // // addReflectionImageToReflection(reflectionBuffer, mg) // Add all of the reflection images to a single buffer image
    // addReflectionImageToReflection(reflectionBuffer, fg) // Add all of the reflection images to a single buffer image
    // addCircleImageToReflection(reflectionBuffer, timeOfDay === "night" ? p.color(223, 68, 8) : p.color(215, 40.7, 64.2))

    // Draw Reflection Image to Canvas
    const rx = 0
    const ry = -p.height - (p.height - bottom) + bottom
    p.push();
    p.scale(1, -1); // Flip the y-axis to draw upside down
    p.translate(rx, ry); // Adjust translation for the buffer
    p.image(reflectionBuffer, 0, 0)
    p.pop();

    //Draw Texture
    // p.blendMode(p.MULTIPLY);
    // p.image(textureImg, 0, 0, cw, ch);
    // p.blendMode(p.BLEND);
    
    //Debug Helpers
    // if (debug) {
    //   //bulge
    //   p.stroke("red")
    //   p.strokeWeight(3)
    //   p.line(0, tree.bulgePoint.y, cw, tree.bulgePoint.y)
    //   p.stroke("yellow")
    //   p.point(tree.bulgePoint.x, tree.bulgePoint.y)
    //   //width
    //   p.stroke("green")
    //   p.line(tree.startPoint.x - tree.treeWidth/2, 0, tree.startPoint.x - tree.treeWidth/2, ch)
    //   p.line(tree.startPoint.x + tree.treeWidth/2, 0, tree.startPoint.x + tree.treeWidth/2, ch)
    //   //height
    //   p.stroke("blue")
    //   p.line(0, ch - tree.treeHeight - bottom, cw, ch - tree.treeHeight - bottom)
    //   //points
    //   tree.points.forEach(treePoint => {
    //     p.strokeWeight(5);
    //     p.stroke("red");
    //     p.point(treePoint.x, treePoint.y)
    //   })
    // }
  }

  // function getForestShape(shapeType: 'convex' | 'concave' | 'flat' | 'upHill' | 'downHill', treeHeight:number, maxHeight:number, index:number, centerIndex: number, arrayLength: number) {

  //   const incrementY = treeHeight/5; // spaceing between trees. This will allow the trees to overlap

  //   if (shapeType === 'convex') {
  //     const distanceFromCenter = Math.abs(index - centerIndex);
  //     const columHeight = treeHeight * (distanceFromCenter/6);
  //     const columnStartY = 0;
  //     const maxY = columnStartY - columHeight;
  //     const numTreesInColumn = Math.max(1, (columnStartY - maxY) / incrementY) // Calc number of trees based on how many can fit into the alotted space
  //     return {columnStartY, incrementY, numTreesInColumn}
  //   }

  //   if (shapeType === 'concave') {
  //     const centerIndex = (arrayLength - 1) / 2; // TODO: make this an argument? Then can control where the hill "peaks" by adjusting the center
  //     const distanceFromCenter = Math.abs(index - centerIndex);
  //     let _columnHeight: number;

  //     if (index === 0 || index === arrayLength - 1) _columnHeight = incrementY
  //     else if (index > centerIndex) _columnHeight = incrementY * (index - (distanceFromCenter * 2))
  //     else _columnHeight = incrementY * index;
      
  //     const columnHeight = _columnHeight > maxHeight ? maxHeight : _columnHeight;
  //     const columnStartY = 0;
  //     const maxY = columnStartY - columnHeight;
  //     const numTreesInColumn = Math.max(1, (columnStartY - maxY) / incrementY) // Calc number of trees based on how many can fit into the alotted space
  //     return {columnStartY, incrementY, numTreesInColumn}
  //   }
    
  //   if (shapeType === 'flat') {
  //     const columnHeight = maxHeight;
  //     const columnStartY = 0;
  //     const maxY = columnStartY - columnHeight;
  //     const numTreesInColumn = Math.max(1, (columnStartY - maxY) / incrementY) // Calc number of trees based on how many can fit into the alotted space
  //     return {columnStartY, incrementY, numTreesInColumn}
  //   }
    
  //   if (shapeType === 'upHill') {
  //     const columnHeight = (incrementY * index) > maxHeight ? maxHeight : (incrementY * index);
  //     const columnStartY = 0;
  //     const maxY = columnStartY - columnHeight;
  //     const numTreesInColumn = Math.max(0, (columnStartY - maxY) / incrementY) // Calc number of trees based on how many can fit into the alotted space
  //     return {columnStartY, incrementY, numTreesInColumn}
  //   }
    
  //   if (shapeType === 'downHill') {
  //     const reverseIndex = arrayLength - 1 - index; // Calculate height based on the reverse index (highest on left, lowest on right)
  //     const columnHeight = (incrementY * reverseIndex) > maxHeight ? maxHeight : (incrementY * reverseIndex); 
  //     const columnStartY = 0;
  //     const maxY = columnStartY - columnHeight;
  //     const numTreesInColumn = Math.max(1, (columnStartY - maxY) / incrementY); // Ensure numTreesInColumn is at least 1
  //     return {columnStartY, incrementY, numTreesInColumn}
  //   }
    
  // }


  function addReflectionImageToReflection(
    reflectionBuffer: p5.Graphics, 
    imageToReflect: p5.Graphics,
  ) {
 
    reflectionBuffer.push();
    reflectionBuffer.image(imageToReflect, 0, 0);
    reflectionBuffer.filter(reflectionBuffer.BLUR, 3); // Add blur to buffer
    reflectionBuffer.pop();
  
    return reflectionBuffer;
  }

  const addCircleImageToReflection = (reflectionBuffer: p5.Graphics, fill: p5.Color) => {
    const circlesBuffer = p.createGraphics(reflectionBuffer.width, reflectionBuffer.height)
    const circlesImage = _generateCircles(circlesBuffer, 3, fill)
    
    // Erase the eraserBuffer circles from buffer
    reflectionBuffer.push()
    // buffer.blendMode(buffer.REMOVE as any); // For some reason REMOVE gets highlighted as an issue, but it is in the docs: https://p5js.org/reference/p5/blendMode/
    reflectionBuffer.image(circlesImage, 0, 0);
    reflectionBuffer.blendMode(reflectionBuffer.BLEND); // Reset to normal blend mode
    reflectionBuffer.pop()
    return reflectionBuffer;

    function _generateCircles(buffer: p5.Graphics, numCirlces: number, fill?: p5.Color) {
      for (let i = 0; i < numCirlces; i++) { // Adjust the number of ovals as needed
        buffer.push();
        let y = buffer.random(0, buffer.height - bottom - 5)
        let x = buffer.random(buffer.width/2 - 100, buffer.width/2 + 100)
        let w = buffer.random(1600, 2000); 
        let h = buffer.map(y, 0, buffer.height - bottom, 200, 5);
    
        // Draw ellipse with soft edges
        buffer.colorMode(buffer.HSL);
        buffer.noStroke();
        buffer.fill(fill || buffer.color("white"));
        buffer.ellipse(x, y, w, h);
        let blurAmount = buffer.map(y, 0, buffer.height - bottom, 4, 1) // Increase blur as y increases
        buffer.filter(buffer.BLUR, blurAmount); // Apply blur to soften edges
        buffer.pop();
      }
      return buffer;
    }
  }

  // function drawTree(tree: VermontTree, buffer: p5.Graphics, strokeColor: p5.Color) {
  //   buffer.push();
  //   buffer.noFill();
  //   buffer.strokeWeight(1);
  //   buffer.stroke(strokeColor);
  //   tree.drawTrunk(buffer, tree.trunkLines, true)
  //   buffer.pop();

  //   tree.leaves.forEach(leaf => tree.drawLeaf(buffer, leaf));
  // }

  // function drawTree(tree: VermontTreePerformant, buffer: p5.Graphics, strokeColor: p5.Color) {
  //   buffer.push();
  //   buffer.noFill();
  //   buffer.strokeWeight(1);
  //   buffer.stroke(strokeColor);
  //   buffer.image(tree.fullTreeBuffer, 0, 0)
  //   buffer.pop();
  // }

  function drawGroundLine(
    p: p5,
    xStart: number,
    yStart: number,
    xEnd: number,
    fill_c: p5.Color
  ) {
    let x = xStart;
    const y = yStart;
    p.stroke(fill_c);
    p.strokeWeight(1);
    fill_c ? p.fill(fill_c) : p.noFill();
  
    while (x < xEnd) {
      const tickBump = p.random(-4, 0);
      const tickType = p.random(["long", "short", "long", "short", "space"]);
      let tickLength = getTickLength(tickType);
  
      if (tickType !== "space") {
        drawTick(x, y, tickLength, tickBump);
      }
  
      x += tickLength;
    }
  
    function getTickLength(type: string): number {
      switch (type) {
        case "long":
          return p.random(10, 25);
        case "short":
          return p.random(3, 10);
        case "space":
          return p.random(5, 25);
        default:
          console.error("no such line type");
          return 0;
      }
    }
  
    function drawTick(x: number, y: number, length: number, bump: number) {
      p.beginShape();
      p.vertex(x, y, 0);
      const cx1 = x + length / 2;
      const cy1 = y + bump;
      const cx2 = x + length;
      const cy2 = y;
      p.bezierVertex(x, y, cx1, cy1, cx2, cy2);
      p.endShape();
    }
  }
  
  
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

export {mySketch}
export default VermontIII;