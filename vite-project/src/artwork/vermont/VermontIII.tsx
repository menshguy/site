import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import {Season} from '../trees/types.ts';
import {VermontTree, drawGroundLine} from '../../helpers/treeHelpers.tsx';
import {shuffleArray} from '../../helpers/arrays.ts';
import {drawMoon, drawStars, drawCirclesToBuffer, Moon, Stars, TimeOfDay} from '../../helpers/skyHelpers.tsx';
import p5 from 'p5';
import { rect_gradient } from '../../helpers/shapes.ts';

const mySketch = (p: p5) => {

  let cw: number = 1400; 
  let ch: number = 800;
  let bottom = ch/2;
  let debug = false;
  let tree: VermontTree;
  let sunAngle: number;
  let sunFillPercentage: number;
  let season: Season;
  let textureImg: p5.Image;
  let colors: Record<any, (s:number, l:number) => () => p5.Color>;
  let fgTrees: VermontTree[] = [];
  let mgTrees: VermontTree[] = [];
  let bgTrees: VermontTree[] = [];
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
    bgTrees = [];
    fgTrees = [];

    /** Colors */
    colors = {
      green: (s: number = 1, l: number = 1) => () => p.color(p.random(74,107), 70*s, 40.3*l),
      yellow: (s: number = 1, l: number = 1) => () => p.color(p.random(42,80), 70*s, 55*l),
      orange: (s: number = 1, l: number = 1) => () => p.color(p.random(27,50), 70*s, 56*l),
      red: (s: number = 1, l: number = 1) => () => p.color(p.random(2,35), 70*s, 57*l),
    }
  
    // Season & Time
    season = 'fall';
    timeOfDay = p.random([
      "day", 
      // "night"
    ]);
    console.log("Season: ", season, "Time of Day: ", timeOfDay)
    
    // Sunlight
    sunAngle = p.radians(p.random(200, 340));
    sunFillPercentage = p.random(0.25, timeOfDay === 'night' ? 0.5 : 1);
    let sunlight = {angle: sunAngle, fillPercentage: sunFillPercentage}

    // Points & Leaves
    let pointBoundaryRadius = {min: 20, max: 25};
    let numPointsPerRow = 5; // X points are draw within boundary radius
    let numLeavesPerPoint = p.random(120, 180); // X leaves are draw around each point.
    let leavesStartY = p.height - bottom - pointBoundaryRadius.max; //where on y axis do leaves start
    let leafHeight = 3;
    let leafWidth = 3;

    function getForestShape(shapeType: 'convex' | 'concave' | 'flat' | 'upHill' | 'downHill', treeHeight:number, maxHeight:number, index:number, centerIndex: number, arrayLength: number) {

      const incrementY = treeHeight/3; // spaceing between trees. This will allow the trees to overlap

      if (shapeType === 'convex') {
        const distanceFromCenter = Math.abs(index - centerIndex);
        const columHeight = treeHeight * (distanceFromCenter/6);
        const columnStartY = ch - bottom;
        const maxY = ch - bottom - columHeight;
        const numTreesInColumn = (columnStartY - maxY) / incrementY // Calc number of trees based on how many can fit into the alotted space
        return {columnStartY, incrementY, numTreesInColumn}
      }

      if (shapeType === 'concave') {
        const centerIndex = (arrayLength - 1) / 2; // TODO: make this an argument? Then can control where the hill "peaks" by adjusting the center
        const distanceFromCenter = Math.abs(index - centerIndex);
        let _columnHeight: number;

        if (index === 0 || index === arrayLength - 1) _columnHeight = treeHeight
        else if (index > centerIndex) _columnHeight = treeHeight * (index - (distanceFromCenter * 2))
        else _columnHeight = treeHeight * index;
        
        const columnHeight = _columnHeight > maxHeight ? maxHeight : _columnHeight;
        const columnStartY = ch - bottom;
        const maxY = ch - bottom - columnHeight;
        const numTreesInColumn = (columnStartY - maxY) / incrementY // Calc number of trees based on how many can fit into the alotted space
        return {columnStartY, incrementY, numTreesInColumn}
      }
      
      if (shapeType === 'flat') {
        const columnHeight = maxHeight
        const columnStartY = ch - bottom;
        const maxY = ch - bottom - columnHeight;
        const numTreesInColumn = (columnStartY - maxY) / incrementY // Calc number of trees based on how many can fit into the alotted space
        return {columnStartY, incrementY, numTreesInColumn}
      }
      
      if (shapeType === 'upHill') {
        const columnHeight = treeHeight * index;
        const columnStartY = ch-bottom;
        const maxY = ch-bottom - columnHeight;
        const numTreesInColumn = (columnStartY - maxY) / incrementY // Calc number of trees based on how many can fit into the alotted space
        return {columnStartY, incrementY, numTreesInColumn}
      }
      
    }

    /** FOREGROUND TREES */
    let numFGTreeColumns = 30;
    for (let i = 0; i < numFGTreeColumns; i++) {

      // Forest Settings
      const minTreeHeight = 80;
      const maxTreeHeight = 120;
      const centerIndex = (numFGTreeColumns - 1) / 2;
      const maxHeight = minTreeHeight * 3;
      const treeHeight = minTreeHeight;
      const {columnStartY, incrementY, numTreesInColumn} = getForestShape("convex", treeHeight, maxHeight, i, centerIndex, numFGTreeColumns) ?? {columnStartY: 0, incrementY: 0, numTreesInColumn: 0};
      
      for (let j = numTreesInColumn; j >= 0; j--) {

        // Tree Settings
        let trunkHeight = p.random(minTreeHeight, maxTreeHeight);
        let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
        let trunkWidth = p.random(40, 100);
        let treeWidth = p.random(trunkWidth, trunkWidth+5); // total width including leaves
        let numTrunkLines = p.random(3,5); //trunks are made up of X bezier curves
        let rowHeight = treeHeight/5; //x points will drawn p.randominly in each row. rows increment up by this amount
        let startX = i * ( (p.width+treeWidth)/numFGTreeColumns ) + p.random(-25, 25) // add an extra treeWidth for some bufferspace
        let startY = columnStartY - (incrementY * j) + incrementY
        let startPoint = {x: startX, y: startY};
        let midpoint = {x: startPoint.x, y: startPoint.y - (treeHeight/2)};
        let bulgePoint = { x: midpoint.x, y: startPoint.y - (treeHeight/3)};
        
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

        fgTrees.push(tree);
      }
    }

    // /** MIDGROUND TREES */
    // let numMGTreeColumns = 20;
    // for (let i = 0; i < numMGTreeColumns; i++) {

    //   // Forest Shape Settings
    //   let minTreeHeight = 80;
    //   let maxTreeHeight = 120;
    //   const centerIndex = (numFGTreeColumns - 1) / 2;
    //   const maxHeight = minTreeHeight * 10;
    //   const {minStartY, maxStartY, numTreesInColumn} = getForestShape("upHill", minTreeHeight, maxHeight, i, centerIndex, numFGTreeColumns);
      
    //   for (let j = numTreesInColumn; j >= 0; j--) {

    //     // Tree Settings
    //     let trunkHeight = p.random(minTreeHeight, maxTreeHeight);
    //     let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
    //     let trunkWidth = p.random(40, 100);
    //     let treeWidth = p.random(trunkWidth, trunkWidth+5); // total width including leaves
    //     let numTrunkLines = p.random(3,5); //trunks are made up of X bezier curves
    //     let rowHeight = treeHeight/5; //x points will drawn p.randominly in each row. rows increment up by this amount
    //     let startX = i * ( (p.width+treeWidth)/numMGTreeColumns ) + p.random(-25, 25) // add an extra treeWidth for some bufferspace
    //     let startY = minStartY - (numTreesInColumn * j) + treeHeight/2;
    //     let startPoint = {x: startX, y: startY};
    //     let midpoint = {x: startPoint.x, y: startPoint.y - (treeHeight/2)};
    //     let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - treeHeight/3))};
        
    //     // Colors
    //     let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
    //     let fills = timeOfDay === "night" 
    //       ? colors[fallColor](0.4, .2)
    //       : colors[fallColor](0.9, .5)
    //     let fillsSunlight = timeOfDay === "night" 
    //       ? colors[fallColor](0.1, .5)
    //       : colors[fallColor](0.8, .95);
          
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
    // let numBGTreeColumns = 20;
    // for (let i = 0; i < numBGTreeColumns; i++) {

    //   // Forest Shape Settings
    //   let minTreeHeight = 80;
    //   let maxTreeHeight = 120;
    //   let minStartY = ch-bottom;
    //   let maxStartY = ch-bottom-(minTreeHeight*i);
    //   let numTreesInColumn = (minStartY - maxStartY) / minTreeHeight // Calc number of trees based on how many can fit into the alotted space
      
    //   for (let j = numTreesInColumn; j >= 0; j--) {

    //     // Tree Settings
    //     let trunkHeight = p.random(minTreeHeight, maxTreeHeight);
    //     let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
    //     let trunkWidth = p.random(40, 100);
    //     let treeWidth = p.random(trunkWidth, trunkWidth+5); // total width including leaves
    //     let numTrunkLines = p.random(3,5); //trunks are made up of X bezier curves
    //     let rowHeight = treeHeight/5; //x points will drawn p.randominly in each row. rows increment up by this amount
    //     let startX = i * ( (p.width+treeWidth)/numBGTreeColumns ) + p.random(-25, 25) // add an extra treeWidth for some bufferspace
    //     let startY = minStartY - (numTreesInColumn * j) + treeHeight/2;
    //     let startPoint = {x: startX, y: startY};
    //     let midpoint = {x: startPoint.x, y: startPoint.y - (treeHeight/2)};
    //     let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - treeHeight/3))};
        
    //     // Colors
    //     let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
    //     let fills = timeOfDay === "night" 
    //       ? colors[fallColor](0.4, .2)
    //       : colors[fallColor](0.9, .5)
    //     let fillsSunlight = timeOfDay === "night" 
    //       ? colors[fallColor](0.1, .5)
    //       : colors[fallColor](0.8, .95);
          
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

    // Buffer for background image to be drawn to.
    let bg = p.createGraphics(p.width, p.height - (p.height-bottom))
    bg.colorMode(bg.HSL)
    
    // Buffer for foreground image to be drawn to.
    let fg = p.createGraphics(p.width, p.height - (p.height-bottom))
    fg.colorMode(fg.HSL)
    
    // Buffer for midground image to be drawn to.
    let mg = p.createGraphics(p.width, p.height - (p.height-bottom))
    mg.colorMode(mg.HSL)
    
    // Buffer for moon image to be drawn to.
    let moonBuffer = p.createGraphics(p.width, p.height - (p.height-bottom))
    moonBuffer.colorMode(moonBuffer.HSL)
    
    // Buffer for stars image to be drawn to.
    let starsBuffer = p.createGraphics(p.width, p.height - (p.height-bottom))
    starsBuffer.colorMode(starsBuffer.HSL)

    // Sky to canvas
    let skyColor = timeOfDay === "night" ? p.color(223,43,18) : p.color("#68ADF6")
    p.noStroke();
    p.fill(skyColor);
    p.rect(0, 0, p.width, p.height)

    // Draw Moon and Stars to buffer
    if (timeOfDay === "night") {
      drawMoon(moonBuffer, moonConfig); // Draw Moon
      drawStars(starsBuffer, starsConfig); // Draw Stars
    }
    
    // Draw Shadow (The dark area under the trees)
    let shadowColor = timeOfDay === "night" ? p.color(30, 30, 5) : p.color(30, 30, 12)
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
    
    // Draw Trees
    bgTrees.forEach(tree => drawTree(tree, bg, timeOfDay === "night" ? bg.color(12, 20, 8) : bg.color(12, 20, 25)))
    mgTrees.forEach(tree => drawTree(tree, mg, timeOfDay === "night" ? mg.color(12, 20, 8) : mg.color(12, 20, 25)))
    fgTrees.forEach(tree => drawTree(tree, fg, timeOfDay === "night" ? fg.color(12, 20, 8) : fg.color(12, 20, 25)))
    

    // Draw tree buffers
    if (timeOfDay === "night") {
      p.image(moonBuffer, 0, 0)
      p.image(starsBuffer, 0, 0)
    }
    
    // Draw tree buffers
    // p.image(bg, 0, 0)
    // p.image(mg, 0, 0)
    p.image(fg, 0, 0)
    
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
    
    // Create Reflection Image
    const reflectionImage = p.createGraphics(p.width, p.height - bottom) // Reflection Buffer
    const rx = 0
    const ry = p.height - bottom
    
    // Add all of the reflection images to a single buffer image
    addReflectionImageToReflection(reflectionImage, bg, rx, ry)
    //TODO: ADD OTHER REFLECTIONS HERE IN CORRECT ORDER
    addCircleImageToReflection(reflectionImage, p.height - bottom, timeOfDay === "night" ? p.color(223, 68, 8) : p.color(215, 40.7, 64.2))

    // Draw Reflection Image to Canvas
    p.image(reflectionImage, 0, bottom)

    //Draw Texture
    // p.blendMode(p.MULTIPLY);
    // p.image(textureImg, 0, 0, cw, ch);
    // p.blendMode(p.BLEND);
    
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

  function addReflectionImageToReflection(
    reflectionBuffer: p5.Graphics, 
    imageToReflect: p5.Graphics,
    x: number,
    y: number,
  ) {
    
    // Draw image to a buffer, flip, and then translate to correct x & y coords
    reflectionBuffer.push();
    reflectionBuffer.colorMode(reflectionBuffer.HSL);
    reflectionBuffer.scale(1, -1); // Flip the y-axis to draw upside down
    reflectionBuffer.translate(x, -y); // Adjust translation for the buffer
    reflectionBuffer.image(imageToReflect, 0, 0);
    
    // Add blur 
    reflectionBuffer.filter(reflectionBuffer.BLUR, 3); // Add blur to buffer
    reflectionBuffer.pop();
  
    return reflectionBuffer;
  }

  const addCircleImageToReflection = (reflectionBuffer: p5.Graphics, y: number, fill: p5.Color) => {
    // Erase random ovals from the rectangle - the erased sections will expose the reflection underneath
    let circlesImage = _generateCircles(reflectionBuffer, 3, fill)
    
    // Erase the eraserBuffer circles from buffer
    // buffer.blendMode(buffer.REMOVE as any); // For some reason REMOVE gets highlighted as an issue, but it is in the docs: https://p5js.org/reference/p5/blendMode/
    reflectionBuffer.image(circlesImage, 0, y);
    reflectionBuffer.blendMode(reflectionBuffer.BLEND); // Reset to normal blend mode
    return reflectionBuffer;

    function _generateCircles(buffer: p5.Graphics, numCirlces: number, fill?: p5.Color) {
      for (let i = 0; i <= numCirlces; i++) { // Adjust the number of ovals as needed
        buffer.push();
        let y = buffer.random(0, buffer.height)
        let x = buffer.random(buffer.width/2 - 100, buffer.width/2 + 100)
        let w = buffer.random(1600, 2000); 
        let h = buffer.map(y, 0, buffer.height, 5, 80);
    
        // Draw ellipse with soft edges
        buffer.colorMode(buffer.HSL);
        buffer.noStroke();
        buffer.fill(fill || buffer.color("white"));
        buffer.ellipse(x, y, w, h);
        let blurAmount = buffer.map(y, 0, buffer.height, 0, 3) // Increase blur as y increases
        buffer.filter(buffer.BLUR, blurAmount); // Apply blur to soften edges
        buffer.pop();
      }
      return buffer;
    }
  }

  function drawTree(tree, buffer, strokeColor) {
    buffer.push();
    buffer.noFill();
    buffer.strokeWeight(1);
    buffer.stroke(strokeColor);
    tree.drawTrunk(buffer, tree.trunkLines, true)
    buffer.pop();

    tree.leaves.forEach(leaf => tree.drawLeaf(buffer, leaf));
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