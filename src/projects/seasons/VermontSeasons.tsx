import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import {Season} from './types.ts';
import {VermontTree, drawGroundLine} from './treeHelpers.tsx';
import {shuffleArray} from '../../helpers/arrays.ts';
import {drawMoon, drawStars, drawReflection, drawCirclesToBuffer, Moon, Stars, TimeOfDay} from './skyHelpers.tsx';
import p5 from 'p5';

const mySketch = (p: p5) => {

  let cw: number = 1000; 
  let ch: number = 600;
  let r: p5.Graphics;
  let v: p5.Graphics;
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

  /** Rain */
  let cols: number;
  let rows: number;
  let current: number[][]; // = new float[cols][rows];
  let previous: number[][]; // = new float[cols][rows];
  let dampening = 0.9;
  let pixelValue = 2500;
  let interval = 100;
  let timer = 0;

  p.preload = () => {
    // textureImg = p.loadImage('../textures/coldpressed_1.PNG');
  }
  
  p.setup = () => {
    // p.colorMode(p.HSL);
    p.pixelDensity(1);
    p.createCanvas(cw, ch);
    
    /** Rain */
    v = p.createGraphics(p.width, p.height, p.WEBGL);
    r = p.createGraphics(p.width, p.height);
    cols = r.width * p.pixelDensity();
    rows = r.height * p.pixelDensity();
    current = new Array(cols).fill(0).map( _ => new Array(rows).fill(0));
    previous = new Array(cols).fill(0).map( _ => new Array(rows).fill(0));

    /** Colors */
    // colors = {
    //   green: (s: number = 1, l: number = 1) => () => p.color(p.random(74,107), 70*s, 40.3*l),
    //   yellow: (s: number = 1, l: number = 1) => () => p.color(p.random(42,80), 70*s, 55*l),
    //   orange: (s: number = 1, l: number = 1) => () => p.color(p.random(27,50), 70*s, 56*l),
    //   red: (s: number = 1, l: number = 1) => () => p.color(p.random(2,35), 70*s, 57*l),
    // }
  
    // Season & Time
    // season = 'fall';
    // timeOfDay = p.random(["day", "night"]);
    // console.log("season", season, timeOfDay)
    
    // Sunlight
    // sunAngle = p.radians(p.random(200, 340));
    // sunFillPercentage = p.random(0.1, timeOfDay === 'night' ? 0.5 : 1);
    // let sunlight = {angle: sunAngle, fillPercentage: sunFillPercentage}

    // Trunk & Tree
    // let trunkHeight = p.random(50, 1200);
    // let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
    // let trunkWidth = p.random(40, 150);
    // let treeWidth = p.random(trunkWidth, trunkWidth+5); // total width including leaves
    // let numTrunkLines = p.random(3,5); //trunks are made up of X bezier curves

    // Points & Leaves
    // let numPointsPerRow = p.random(5, 15); // X points are draw within a boundary radius
    // let avg = p.random(50, 250);
    // let numLeavesPerPoint = p.random(avg, avg+(avg/2)); // X leaves are draw around each point.
    // let pointBoundaryRadius = {min: 25, max: 30};
    // let leavesStartY = p.height - bottom - pointBoundaryRadius.max; //where on y axis do leaves start
    // let leaveSize = p.random(["small","large"]);
    // let leafWidth = leaveSize === "small" ? p.random(0.5, 1.5) : p.random(5, 10);
    // let leafHeight = leaveSize === "small" ? p.random(2, 3) : p.random(8, 15);
    // let rowHeight = treeHeight/p.random(3, 8); //x points will drawn p.randominly in each row. rows increment up by this amount

    // /** FRONT TREES */
    // let numTreesInFront = p.random(5, 20);
    // for (let i = 0; i < numTreesInFront; i++) {
    //   // Start / Mid / Bulge
    //   let startX = i * (cw/numTreesInFront) + p.random(-10, 10);
    //   let startJitter = p.random(0, 10);
    //   let startPoint = {x: startX, y: ch-bottom - startJitter};
    //   let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2)};
    //   let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - treeHeight/3))};
      
    //   // Colors
    //   let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
    //   let fills = timeOfDay === "night" 
    //     ? colors[fallColor](0.4, .2)
    //     : colors[fallColor](0.9, .5)
    //   let fillsSunlight = timeOfDay === "night" 
    //     ? colors[fallColor](0.1, .7)
    //     : colors[fallColor](0.8, .95);
        
    //   /** Create Tree */
    //   tree = new VermontTree({
    //     p5Instance: p,
    //     treeHeight, 
    //     treeWidth, 
    //     numTrunkLines, 
    //     numPointsPerRow,
    //     numLeavesPerPoint, 
    //     startPoint, 
    //     trunkHeight, 
    //     trunkWidth, 
    //     leavesStartY,
    //     pointBoundaryRadius, 
    //     fills,
    //     fillsSunlight, 
    //     sunlight,
    //     leafWidth, 
    //     leafHeight,
    //     rowHeight,
    //     midpoint,
    //     bulgePoint
    //   });

    //   treesInFront.push(tree);
    // }

    // shuffleArray(treesInFront)

    // /** BACKGROUND TREES */
    // let numBGTreeColumns = p.random(5, 20);
    // for (let i = 0; i < numBGTreeColumns; i++) {

    //   // Start / Mid / Bulge
    //   let offset = treeHeight / 2;
    //   let minStartY = ch-bottom;
    //   let maxStartY = ch-bottom-(treeHeight*i);
    //   let numTreesInColumn = (minStartY - maxStartY) / treeHeight
    //   for (let j = numTreesInColumn; j >= 0; j--) {
    //     let startX = i * ( (p.width+treeWidth)/numBGTreeColumns ) + p.random(-25, 25) // add an extra treeWidth for some bufferspace
    //     let startY = minStartY - (numTreesInColumn * j) + offset;
    //     let startPoint = {x: startX, y: startY};
    //     let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2)};
    //     let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - treeHeight/3))};
        
    //     // Colors
    //     let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
    //     let fills = timeOfDay === "night" 
    //       ? colors[fallColor](0.4, .2)
    //       : colors[fallColor](0.9, .5)
    //     let fillsSunlight = timeOfDay === "night" 
    //       ? colors[fallColor](0.1, .7)
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

    //     treesInBack.push(tree);
    //   }
    // }

    /** Moon */
    // let moonX = p.map(sunAngle, p.radians(180), p.radians(360), 0, cw);
    // let moonY = p.random(0, p.height-bottom);
    // let moonR = p.map(moonY, 0, p.height-bottom, 50, 350);
    // let moonHue = p.map(moonY, 0, p.height-bottom-moonR, 52, 33)
    // let moonFill = p.color(moonHue, 78, 92);
    // moonConfig = {x: moonX, y: moonY, r: moonR, fill: moonFill}

    /** Stars */
    // let numStars = p.random(250, 2500);
    // let starFill = p.color(255, 100, 100);
    // let minR = 0.25;
    // let maxR = 2;
    // let minX = 0;
    // let maxX = cw;
    // let minY = 0;
    // let maxY = p.height;
    // starsConfig = {numStars, fill: starFill, minR, maxR, minX, maxX, minY, maxY}


  }
  
  p.draw = () => {
    // p.noLoop();
    p.background("azure");
    r.background("blue");
    v.background("darkblue");

    /** Rain */
    let raindropUpdates = triggerRaindropEffect(p.millis(), interval, pixelValue, timer, cols, rows, previous);
    timer = raindropUpdates.timer;
    previous = raindropUpdates.previous;

    let rainUpdates = drawRain(r, cols, rows, current, previous);
    current = rainUpdates.current;
    previous = rainUpdates.previous;

    // p.image(r, 0, bottom);
    v.push();
    v.noStroke();
    v.rotateX(p.radians(65));
    v.translate(0, -400, 180);
    v.texture(r);
    v.plane(v.width * 3, v.height * 3);
    v.pop();
    p.image(v, 0, bottom);
    // Create a buffer for main image to be drawn to.
    // let m = p.createGraphics(p.width, p.height - (p.height-bottom))

    // Sky to canvas
    // let skyColor = timeOfDay === "night" ? p.color(223,43,18) : p.color("#68ADF6")
    // // p.noStroke();
    // // p.fill(skyColor);
    // // p.rect(0, 0, p.width, p.height)

    // Draw Moon and Stars to buffer
    // if (timeOfDay === "night") {
    //   drawMoon(m, moonConfig); // Draw Moon
    //   drawStars(m, starsConfig); // Draw Stars
    // }
    
    // Shadow
    // m.noStroke()
    // m.fill(timeOfDay === "night" ? m.color(30, 30, 12) : m.color(30, 30, 30))
    // m.rect(0, p.height-bottom-30, p.width, 30)
    
    // Sky Reflection
    // p.noStroke()
    // p.fill(skyColor)
    // p.rect(0, p.height-bottom, p.width, p.height)
    
    // treesInBack.forEach(tree => {
    //   m.push();
    //   m.strokeWeight(1);
    //   m.noFill()
    //   m.stroke(timeOfDay === "night" ? m.color(12, 20, 10) : m.color(12, 20, 40));
    //   tree.drawTrunk(m, tree.trunkLines, true)
    //   m.pop();

    //   tree.leaves.forEach(leaf => tree.drawLeaf(m, leaf));
    // })
    // treesInFront.forEach(tree => {
    //   m.push();
    //   m.strokeWeight(1);
    //   m.noFill()
    //   m.stroke(timeOfDay === "night" ? m.color(12, 20, 10) : m.color(12, 20, 40));
    //   tree.drawTrunk(m, tree.trunkLines, true)
    //   m.pop();

    //   tree.leaves.forEach(leaf => tree.drawLeaf(m, leaf));
    // })
    
    // Draw tree buffer image
    // p.image(m, 0, 0)

    // Ground Line
    // drawGroundLine(p, 25, ch-bottom, cw-25, timeOfDay === "night" ? m.color(12, 20, 10) : m.color(12, 20, 20))
    
    // Draw Reflection
    // let b = drawReflection(p, m, 0, p.height - bottom, p.width, p.height)
    // p.image(b, 0, 0)

    // Draw a rect for the lake, and erase circles from that buffer image
    // let lakeFill = timeOfDay === "night" ? p.color(223, 68, 8) : p.color(215, 40.7, 64.2)
    // let c = drawLake(p, p.height - bottom, lakeFill);
    // let d = eraseCirclesFromBuffer(p, c, p.height - bottom)
    // let d = drawCirclesToBuffer(p, b, p.height - bottom, lakeFill)
    // p.image(d, 0, 0);

    /** Draw Rain */
    // if ( p.millis() >= interval + timer ) {
    //   // background(random(255),random(255),random(255));
    //   let randomX = Math.floor( Math.random() * cw )
    //   let randomY = Math.floor( Math.random() * ch )
    //   let idx = (randomX + randomY * cw) * 4;
    //   previous[idx] = pressValue;
    //   timer = p.millis();
    // }

    //Draw Texture
    // p.blendMode(p.MULTIPLY);
    // p.image(textureImg, 0, 0, cw, ch);
    // p.blendMode(p.BLEND);
  }
  
  // p.mousePressed = () => {
  //   if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
  //     treesInBack = [];
  //     treesInFront = [];
  //     p.clear();
  //     p.setup();
  //     p.draw();
  //   }
  // };

  function triggerRaindropEffect(
    currentTime: number, 
    interval: number,
    pixelValue: number,
    timer: number,
    cols: number, 
    rows: number, 
    previous: number[][]
  ) {
    if ( currentTime >= interval + timer ) {
      let x = Math.floor( Math.random() * cols )
      let y = Math.floor( Math.random() * rows )
      previous[x][y] = pixelValue;
      timer = currentTime;
    }
    return {previous, timer};
  }

  function drawRain(buffer: p5, cols: number, rows: number, current: number[][], previous: number[][]) {
    // /** ripples */
    buffer.loadPixels();
    for (let i = 1; i < cols - 1; i++) {
      for (let j = 1; j < rows - 1; j++) {
        current[i][j] =
          (previous[i - 1][j] +
            previous[i + 1][j] +
            previous[i][j - 1] +
            previous[i][j + 1]) /
            2 - current[i][j];
        current[i][j] = current[i][j] * dampening;
        // Unlike in Processing, the pixels array in p5.js has 4 entries
        // for each pixel, so we have to multiply the index by 4 and then
        // set the entries for each color component separately.
        let index = (i + j * cols) * 4;
        let newVal = current[i][j];
        buffer.pixels[index + 0] = newVal;
        buffer.pixels[index + 1] = newVal;
        buffer.pixels[index + 2] = newVal;
        buffer.pixels[index + 3] = newVal;
      }
    }
    buffer.updatePixels();
  
    /** Swaps the buffers */
    let temp = previous;
    previous = current;
    current = temp;

    return {current, previous};
  }

  // p.mousePressed = () => {
  //   if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
  //     previous[p.floor(p.mouseX)][p.floor(p.mouseY)] = 2500;
  //   }
  // }

  // function rainEffect(toggle) {
  //   if (toggle) {
  //       let interval = Math.floor( Math.random() * rainInterval )
  //       if ( p.millis() >= interval + timer ) {
  //           // background(random(255),random(255),random(255));
  //           let randomX = Math.floor( Math.random() * cols )
  //           let randomY = Math.floor( Math.random() * rows )
  //           let idx = (randomX + randomY * cols) * 4;
  //           previous[idx] = pressValue;
  //           timer = p.millis();
  //       }
  //   }
  // }

};

const VermontSeasons: React.FC = () => {
  return (
    <div>
      <h1>Vermont III Wild Card</h1>
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} includeSaveButton />
    </div>
  );
};

export default VermontSeasons;