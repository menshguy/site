import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import {VermontTreePerformant, VermontTreePerformantSettings, TreeColorPalette, Season, TimeOfDay} from '../classes/VermontTreePerformant.tsx';
import {VermontForest, VermontForestShapes} from '../classes/VermontForest.tsx';
// import {shuffleArray} from '../../helpers/arrays.ts';
import {drawMoon, drawStars, Moon, Stars} from '../../helpers/skyHelpers.tsx';
import p5 from 'p5';
import { rect_gradient } from '../../helpers/shapes.ts';

type GroundSettings = {
  startX: number;
  startY: number;
  endX: number;
  fill: p5.Color;
}

const mySketch = (p: p5) => {

  let cw: number = 1200; 
  let ch: number = 800;
  let bottom = 300;
  let season: Season;
  let fgForest: VermontForest;
  let fgForestImage: p5.Graphics | p5.Image;
  let timeOfDay: TimeOfDay;
  let groundLineBuffer: p5.Graphics;
  
  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(cw, ch);

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
    
    console.log("Season: ", season, "Time of Day: ", timeOfDay)

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
    const forestNumberOfColumns = 15;
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
      rows: 3,
      numPointsPerRow: 3, 
      numLeavesPerPoint: 1000, 
      minBoundaryRadius: 2,
      maxBoundaryRadius: 30,
      leafWidth: 2, 
      leafHeight: 2,
      rowHeight: 10, // REMOVE this and calcuate within
    }
    const forestPalette: TreeColorPalette[] = PALETTES[timeOfDay][season];
    const forestLightSettings = LIGHTSETTINGS[timeOfDay];

    // Create Forest
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

    // Ground Settings
    const groundSettings = {
      startX: 25, 
      startY: ch-bottom, 
      endX: cw-25, 
      fill: timeOfDay === "night" ? p.color(12, 20, 10) : p.color(12, 20, 20)
    }
    groundLineBuffer = p.createGraphics(p.width, p.height)
    drawGroundLineToBuffer(groundLineBuffer, groundSettings.startX, groundSettings.startY, groundSettings.endX, groundSettings.fill)
    
  }
  
  p.draw = () => {
    // p.noLoop();
    p.clear();

    // Sky to canvas
    let skyColor = timeOfDay === "night" ? p.color(223,43,18) : p.color(211, 88.8, 68.6)
    p.noStroke();
    p.fill(skyColor);
    p.rect(0, 0, p.width, p.height)

    // Buffer for midground image to be drawn to.
    let mg = p.createGraphics(p.width, p.height)
    let shadowColor = timeOfDay === "night" ? p.color(30, 30, 5) : p.color(211, 30, 22)
    mg.colorMode(mg.HSL)
    
    // Draw Shadow (The dark area under the trees)
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
    
    // Animate the Forest
    // const fgWidth = p.width - fgForest.settings.forestStartX;
    // const fgHeight = p.height - fgForest.settings.forestStartY;
    
    fgForest.animate(); // update forest image to next frame
    fgForestImage = fgForest.getImage();
    p.image(fgForestImage, 0, 0);
    
    // Draw tree buffer image shadow
    // p.push()
    // p.scale(-1, 1)
    // p.tint(100, 80);
    // p.translate(-p.width, 0);
    // p.image(mg, 0, 0);
    // p.noTint();
    // p.pop()

    // Ground Line
    p.image(groundLineBuffer, 0, 0)
    
    // Create Reflection Buffer and draw all relevant images to it (trees, moon, etc)
    // const reflectionBuffer = p.createGraphics(p.width, p.height) // Reflection Buffer
    // addReflectionImageToReflection(reflectionBuffer, fgForestImage as p5.Graphics) // Add all of the reflection images to a single buffer image
    // addCircleImageToReflection(reflectionBuffer, timeOfDay === "night" ? p.color(223, 68, 8) : p.color(215, 40.7, 64.2))

    // Draw Reflection Image to Canvas
    // const rx = 0
    // const ry = -p.height - (p.height - bottom) + bottom
    // p.push();
    // p.scale(1, -1); // Flip the y-axis to draw upside down
    // p.translate(rx, ry); // Adjust translation for the buffer
    // p.image(reflectionBuffer, 0, 0)
    // p.pop();

  }

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

  function drawGroundLineToBuffer(
    buffer: p5.Graphics,
    xStart: number,
    yStart: number,
    xEnd: number,
    fill_c: p5.Color
  ) {
    let x = xStart;
    const y = yStart;
    buffer.stroke(fill_c);
    buffer.strokeWeight(1);
    fill_c ? buffer.fill(fill_c) : buffer.noFill();
  
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
      buffer.beginShape();
      buffer.vertex(x, y, 0);
      const cx1 = x + length / 2;
      const cy1 = y + bump;
      const cx2 = x + length;
      const cy2 = y;
      buffer.bezierVertex(x, y, cx1, cy1, cx2, cy2);
      buffer.endShape();
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