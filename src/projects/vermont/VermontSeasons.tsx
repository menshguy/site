import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import {Season} from '../../types/treesTypes.ts';
import {VermontTree, drawGroundLine} from '../../helpers/treeHelpers.tsx';
import {shuffleArray} from '../../helpers/arrays.ts';
import {drawMoon, drawStars, drawReflection, 
  // drawCirclesToBuffer, 
  Moon, Stars, TimeOfDay} from '../../helpers/skyHelpers.tsx';
import p5 from 'p5';

const mySketch = (p: p5) => {

  let cw: number = 1000; 
  let ch: number = 400;
  let m: p5.Graphics;
  let b: p5.Graphics;
  let r: p5.Graphics;
  let v: p5.Graphics;
  let bottom = ch/2;
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
  let dampening = 0.92;
  let pixelValue = 2500;
  let interval = 10;
  let timer = 0;

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
    let treeSize = p.random(["small", "large"]);
    let trunkHeight = treeSize === "large" ? p.random(p.height-bottom - 100, p.height-bottom-50) : p.random(50, 100);
    let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
    let trunkWidth = trunkHeight/ p.random(1, 4);
    let treeWidth = p.random(trunkWidth, trunkWidth+5); // total width including leaves
    let numTrunkLines = p.random(3,5); //trunks are made up of X bezier curves

    // Points & Leaves
    let numPointsPerRow = treeSize === "large" ? p.random(10, 12) : p.random(5, 8); // X points are draw within a boundary radius
    let avg = treeSize === "large" ? p.random(200, 250) : p.random(30, 50);
    let numLeavesPerPoint = p.random(avg, avg+(avg/2)); // X leaves are draw around each point.
    let pointBoundaryRadius = treeSize === "large" ? {min: 25, max: 30} : {min: 15, max: 20};
    let leavesStartY = p.height - bottom - pointBoundaryRadius.max; //where on y axis do leaves start
    let leaveSize = p.random(["small","large"]);
    let leafHeight = leaveSize === "small" ? p.random(1, 4) : p.random(5, 12);
    let leafWidth = leaveSize === "small" ? p.random(1, 4) : p.random(5, 12);
    let rowHeight = treeHeight/p.random(3, 8); //x points will drawn p.randominly in each row. rows increment up by this amount

    /** COLORS */
    let fillSaturation = timeOfDay === "night" ? p.random(0.15, 0.2) : p.random(0.7, 1);
    let fillLightness = timeOfDay === "night" ? p.random(0.2, 0.3) : p.random(0.6, 0.85);
    let sunlightSaturation = timeOfDay === "night" ? p.random(0.1, 0.15) : p.random(0.8, 95);
    let sunlightLightness = timeOfDay === "night" ? p.random(0.9, 1) : p.random(0.7, 0.95);

    // /** CREATE TREES */
    let numTreesInFront = treeSize === "large" ? p.random(5, 8) : p.random(25, 30);
    for (let i = 0; i < numTreesInFront; i++) {
      // Start / Mid / Bulge
      let startX = i * (cw/numTreesInFront) + p.random(-10, 10);
      let startJitter = p.random(0, 0);
      let startPoint = {x: startX, y: ch-bottom - startJitter};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2)};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - treeHeight/3))};

      // Color
      let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
        
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
        fills: colors[fallColor](fillSaturation, fillLightness),
        fillsSunlight: colors[fallColor](sunlightSaturation, sunlightLightness), 
        sunlight,
        leafWidth, 
        leafHeight,
        rowHeight,
        midpoint,
        bulgePoint
      });

      treesInFront.push(tree);
    }

    shuffleArray(treesInFront)

    let numBGTreeColumns = p.random(15, 18);
    for (let i = 0; i < numBGTreeColumns; i++) {

      // Start / Mid / Bulge
      let offset = treeHeight / 2;
      let minStartY = ch-bottom;
      let maxStartY = ch-bottom-(treeHeight*i);
      let numTreesInColumn = (minStartY - maxStartY) / treeHeight
      for (let j = numTreesInColumn; j >= 0; j--) {
        let startX = i * ( (p.width+treeWidth)/numBGTreeColumns ) + p.random(-25, 25) // add an extra treeWidth for some bufferspace
        let startY = minStartY - (numTreesInColumn * j) + offset;
        let startPoint = {x: startX, y: startY};
        let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2)};
        let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - treeHeight/3))};
          
        // Color
        let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
        
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
          fills: colors[fallColor](fillSaturation, fillLightness),
          fillsSunlight: colors[fallColor](sunlightSaturation, sunlightLightness),  
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

    /** Create Buffer for Sky, Moon, Stars, and Trees */
    m = p.createGraphics(p.width, p.height - (p.height-bottom));
    m.colorMode(p.HSL);
    
    /** Draw Moon & Stars to Buffer */
    if (timeOfDay === "night") {
      /** Moon */
      let moonX = p.map(sunAngle, p.radians(180), p.radians(360), 0, cw);
      let moonY = p.random(0, p.height-bottom);
      let moonR = p.map(moonY, 0, p.height-bottom, 50, 350);
      let moonHue = p.map(moonY, 0, p.height-bottom-moonR, 52, 33)
      let moonFill = p.color(moonHue, 78, 92);
      moonConfig = {x: moonX, y: moonY, r: moonR, fill: moonFill}

      /** Stars */
      let numStars = p.random(250, 2500);
      let starFill = p.color(255, 100, 100);
      let minR = 0.25;
      let maxR = 2;
      let minX = 0;
      let maxX = cw;
      let minY = 0;
      let maxY = p.height;
      starsConfig = {numStars, fill: starFill, minR, maxR, minX, maxX, minY, maxY}

      drawMoon(m, moonConfig); // Draw Moon
      drawStars(m, starsConfig); // Draw Stars
    }
    
    /** Shadow */
    let shadowHeight = 40;
    drawShadow(m, shadowHeight, p.height-bottom-shadowHeight+2, timeOfDay)

    /** Draw All Trees to Buffer, Background first, Foreground second */
    let allTrees = [...treesInBack, ...treesInFront]
    allTrees.forEach(tree => {
      m.push();
      m.strokeWeight(p.random(0.5, 1.5));
      m.noFill()
      m.stroke(timeOfDay === "night" ? m.color(12, 20, 5) : m.color(12, 25, 38));
      tree.drawTrunk(m, tree.trunkLines, true)
      m.pop();

      tree.leaves.forEach(leaf => tree.drawLeaf(m, leaf));
    })

    /** Draw Reflection of Main Buffer to a separate buffer, add circles to lake for affect */
    b = drawReflection(p, m, 0, p.height - bottom, p.width, p.height)
    // let lakeFill = timeOfDay === "night" ? p.color(223, 68, 8) : p.color(215, 40.7, 64.2)
    // let d = drawCirclesToBuffer(p, b, p.height - bottom, lakeFill)
    p.image(b, 0, 0);

    // Ground Line
    drawGroundLine(p, 25, ch-bottom, cw-25, timeOfDay === "night" ? m.color(12, 20, 10) : m.color(12, 20, 20))

    /** Rain */
    v = p.createGraphics(p.width, p.height, p.WEBGL);
    v.pixelDensity(1);
 
    r = p.createGraphics(1000, 1000);
    r.pixelDensity(1);
    cols = r.width * r.pixelDensity();
    rows = r.height * r.pixelDensity();
    current = new Array(cols).fill(0).map( _ => new Array(rows).fill(0));
    previous = new Array(cols).fill(0).map( _ => new Array(rows).fill(0));
  }
  
  p.draw = () => {
    // p.noLoop();

    // Sky to canvas
    let skyColor = timeOfDay === "night" ? p.color(223,43,18) : p.color("#68ADF6")
    p.noStroke();
    p.fill(skyColor);
    p.rect(0, 0, p.width, p.height)
    
    // Sky Reflection
    p.noStroke()
    p.fill(skyColor)
    p.rect(0, p.height-bottom, p.width, p.height)
    
    // Draw tree buffer image
    p.image(m, 0, 0)

    /** Rain */
    let raindropUpdates = triggerRaindropEffect(p.millis(), interval, pixelValue, timer, cols, rows, previous);
    timer = raindropUpdates.timer;
    previous = raindropUpdates.previous;

    let rainUpdates = drawRain(r, cols, rows, current, previous);
    // rainWarpedReflection(b, cols, rows, current, previous);
    current = rainUpdates.current;
    previous = rainUpdates.previous;

    /** Draw Reflection Buffer */
    p.image(b, 0, 0);
  
    /** Draw Rain Animation to a 3D plane and Rotate into perspective */
    let rainTextureBuffer = getWebGLRainTexture(p, v, r);

    /** Draw Rain Texture as Blend Mode over the Reflection */
    p.push();
    p.blendMode(p.MULTIPLY);
    p.image(rainTextureBuffer, 0, 0);
    p.pop();

    //Draw Texture
    p.push()
    p.blendMode(p.MULTIPLY);
    p.image(textureImg, 0, 0, cw, ch);
    p.pop()
  }

  function drawShadow(m: p5.Graphics, start: number, rectHeight: number, timeOfDay: TimeOfDay) {
    // Fade into Reflection
    for (let y = start; y < start + rectHeight; y++) {
      let alpha = m.map(y, start, start + rectHeight, 0, 1); // Map y to alpha from 255 to 0
      let fill_color = timeOfDay === "night" 
        ? m.color(30, 20, 8, alpha) 
        : m.color(30, 30, 20, alpha)
      // let lakeFill = timeOfDay === "night" ? m.color(223, 68, 8, alpha) : m.color(215, 40.7, 64.2, alpha);
      m.push();
      m.strokeWeight(1);
      m.stroke(fill_color);
      m.line(0, y, m.width, y);
      m.pop();
    }
  }

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

  function getWebGLRainTexture(p: p5, webGLBuffer: p5.Graphics, textureBuffer: p5.Graphics) {
    /** Draw Rain Buffer as Texture onto a 3D Plane, rotate for perspective */
    let fovy = p.PI/2;
    let aspect = webGLBuffer.width/webGLBuffer.height;
    webGLBuffer.push();
    webGLBuffer.perspective(fovy, aspect, 0.01 , 1000)
    webGLBuffer.background("white");
    webGLBuffer.noStroke();
    webGLBuffer.rotateX(p.radians(60));
    webGLBuffer.translate(0, 0, -100);
    webGLBuffer.texture(textureBuffer);
    // webGLBuffer.fill("pink")
    webGLBuffer.plane(textureBuffer.width * 3.5 , textureBuffer.height * 1.5 );
    webGLBuffer.pop();

    return webGLBuffer;
  }
  
  // function rainWarpedReflection(buffer: p5, cols: number, rows: number, current: number[][], previous: number[][]) {
  //   cols = buffer.width * buffer.pixelDensity();
  //   rows = buffer.height * buffer.pixelDensity();

  //   buffer.loadPixels();

  //   for (let i = 1; i < cols - 1; i++) {
  //     for (let j = 1; j < rows - 1; j++) {
  //       current[i][j] =
  //         (previous[i - 1][j] +
  //           previous[i + 1][j] +
  //           previous[i][j - 1] +
  //           previous[i][j + 1]) /
  //           2 - current[i][j];
  //       current[i][j] = current[i][j];
 
  //       let index = (i + j * cols) * 4;

  //       // grab the current pixel values
  //       let newVal_0 = current[i][j];
  //       let newVal_1 = current[i][j] + 1;
  //       let newVal_2 = current[i][j] + 2;
  //       let newVal_3 = current[i][j] + 3;

  //       buffer.pixels[index + 0] = newVal_0;
  //       buffer.pixels[index + 1] = newVal_1;
  //       buffer.pixels[index + 2] = newVal_2;
  //       buffer.pixels[index + 3] = newVal_3;
  //     }
  //   }
  //   buffer.updatePixels();
  // }
  
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

const VermontSeasons: React.FC = () => {
  return (
    <div>
      <h1>Vermont Rain</h1>
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} includeSaveButton />
    </div>
  );
};

export {mySketch}
export default VermontSeasons;