import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import p5 from 'p5';
import {TreeColorPalette, Season, TimeOfDay} from '../classes/VermontTreePerformant.tsx';
import {VermontForest, VermontForestShapes} from '../classes/VermontForest.tsx';
// import {shuffleArray} from '../../helpers/arrays.ts';
// import {drawMoon, drawStars, Moon, Stars} from '../../helpers/skyHelpers.tsx';
import { rect_gradient } from '../../helpers/shapes.ts';

type GroundSettings = {
  startX: number;
  startY: number;
  endX: number;
  fill: p5.Color;
}

const mySketch = (p: p5) => {

  let cw: number = 1200; 
  let ch: number = 600;
  // let groundSettings: GroundSettings;
  let bottom = 200;
  let season: Season;
  let fgForest: VermontForest;
  let mgForest: VermontForest;
  let bgForest: VermontForest;
  let fgForestImage: p5.Graphics | p5.Image;
  let mgForestImage: p5.Graphics | p5.Image;
  let bgForestImage: p5.Graphics | p5.Image;
  let timeOfDay: TimeOfDay;
  let groundLineBuffer: p5.Graphics;
  let reflectionBuffer: p5.Graphics;
  let circleBuffer: p5.Graphics;
  let mgBuffer: p5.Graphics;
  
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
          {base: p.color(95, 63, 26), highlight: p.color(102, 65, 57.3), shadow: p.color(102, 70, 20.3)}, // Green
          {base: p.color(57, 63, 26), highlight: p.color(57, 65, 57.3), shadow: p.color(57, 70, 21)}, // Yellow
          {base: p.color(32, 63, 26), highlight: p.color(32, 65, 57.3), shadow: p.color(32, 70, 21)}, // Orange
          {base: p.color(7, 63, 26), highlight: p.color(7, 65, 57.3), shadow: p.color(7, 70, 21)}, // Red
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
        lightFillPercentage: p.random(0.75, 0.95)
      },
      night: {
        lightAngle: p.radians(p.random(200, 340)), 
        lightFillPercentage: p.random(0.55, 0.5)
      }
    }

    /** 
     * FOREGROUND FOREST 
     */
    fgForest = new VermontForest({
      p5Instance: p,
      settings: {
        forestStartX: -100,
        forestStartY: ch - bottom,
        forestNumberOfColumns: 10,
        forestWidth: p.width/2 + 100,
        forestHeight: 300,
        forestShape: p.random(['upHill', 'downHill', 'concave', 'convex', /*'flat' */]),
        forestTreeSettings: {
          trunkSpace: 20, // Space to expose bottom of trunks, between bottom of tree and where leaves start
          minHeight: 30, 
          maxHeight: 100, 
          minWidth: 20, 
          maxWidth: 50, 
        },
        forestTrunkSettings: {
          numTrunkLines: 5, 
          trunkHeight: 70,
          trunkWidth: 60, 
        },
        forestLeafSettings: {
          rows: 15,
          numPointsPerRow: 10, 
          numLeavesPerPoint: 300, 
          minBoundaryRadius: 25,
          maxBoundaryRadius: 50,
          leafWidth: 5, 
          leafHeight: 6.5,
          rowHeight: 10, // REMOVE this and calcuate within
        },
        forestPalette: PALETTES[timeOfDay][season],
        forestLightSettings: LIGHTSETTINGS[timeOfDay],
      }
    });

    mgForest = new VermontForest({
      p5Instance: p,
      settings: {
        forestStartX: -100,
        forestStartY: ch - bottom,
        forestNumberOfColumns: 10,
        forestWidth: p.width,
        forestHeight: 300,
        forestShape: p.random(['upHill', 'downHill', 'concave', 'convex', /*'flat' */]),
        forestTreeSettings: {
          trunkSpace: 20, // Space to expose bottom of trunks, between bottom of tree and where leaves start
          minHeight: 30, 
          maxHeight: 100, 
          minWidth: 50, 
          maxWidth: 80, 
        },
        forestTrunkSettings: {
          numTrunkLines: 5, 
          trunkHeight: 70,
          trunkWidth: 60, 
        },
        forestLeafSettings: {
          rows: 25,
          numPointsPerRow: 30, 
          numLeavesPerPoint: 300, 
          minBoundaryRadius: 15,
          maxBoundaryRadius: 20,
          leafWidth: 5, 
          leafHeight: 6.5,
          rowHeight: 10, // REMOVE this and calcuate within
        },
        forestPalette: darkenPalette(PALETTES[timeOfDay][season]),
        forestLightSettings: LIGHTSETTINGS[timeOfDay],
      }
    });
    
    bgForest = new VermontForest({
      p5Instance: p,
      settings: {
        forestStartX: -100,
        forestStartY: ch - bottom,
        forestNumberOfColumns: 10,
        forestWidth: p.width,
        forestHeight: 300,
        forestShape: p.random([/*'convex'*/, 'flat']),
        forestTreeSettings: {
          trunkSpace: 20, // Space to expose bottom of trunks, between bottom of tree and where leaves start
          minHeight: 30, 
          maxHeight: 100, 
          minWidth: 50, 
          maxWidth: 80, 
        },
        forestTrunkSettings: {
          numTrunkLines: 5, 
          trunkHeight: 70,
          trunkWidth: 60, 
        },
        forestLeafSettings: {
          rows: 25,
          numPointsPerRow: 30, 
          numLeavesPerPoint: 300, 
          minBoundaryRadius: 15,
          maxBoundaryRadius: 20,
          leafWidth: 5, 
          leafHeight: 6.5,
          rowHeight: 10, // REMOVE this and calcuate within
        },
        forestPalette: darkenPalette(PALETTES[timeOfDay][season], 0.48, 0.48, 0.48),
        forestLightSettings: LIGHTSETTINGS[timeOfDay],
      }
    });

    function darkenPalette(palette: TreeColorPalette[], baseDarken: number = 0.18, highlightDarken: number = 0.18, shadowDarken: number = 0.18) {
      return palette.map(color => {
        const { base, highlight, shadow } = color;
        const darkBase = p.color(p.hue(base), p.saturation(base), p.brightness(base) * baseDarken);
        const darkHighlight = p.color(p.hue(highlight), p.saturation(highlight), p.brightness(highlight) * highlightDarken);
        const darkShadow = p.color(p.hue(shadow), p.saturation(shadow), p.brightness(shadow) * shadowDarken);
        return { base: darkBase, highlight: darkHighlight, shadow: darkShadow };
      });
    }

    // Ground Settings
    const groundSettings = {
      startX: 25, 
      startY: ch-bottom, 
      endX: cw-25, 
      fill: timeOfDay === "night" ? p.color(12, 20, 10) : p.color(12, 20, 20)
    }
    groundLineBuffer = p.createGraphics(p.width, p.height)
    drawGroundLineToBuffer(groundLineBuffer, groundSettings.startX, groundSettings.startY, groundSettings.endX, groundSettings.fill)

    // Reflection
    reflectionBuffer = p.createGraphics(p.width, p.height) // Reflection Buffer
    reflectionBuffer.colorMode(reflectionBuffer.HSL)
    circleBuffer = generateCircleBuffer(reflectionBuffer, timeOfDay === "night" ? p.color(223, 68, 8) : p.color(215, 40.7, 64.2))
    circleBuffer.colorMode(reflectionBuffer.HSL)

    // Midground Buffer
    mgBuffer = p.createGraphics(p.width, p.height)
    mgBuffer.colorMode(mgBuffer.HSL)
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
    let shadowColor = timeOfDay === "night" ? p.color(30, 30, 5) : p.color(211, 30, 22)
    
    // Draw Shadow (The dark area under the trees)
    mgBuffer.clear()
    mgBuffer.push()
    mgBuffer.noStroke()
    mgBuffer.fill(shadowColor)
    mgBuffer.rect(0, p.height-bottom-30, p.width, 30)
    rect_gradient(mgBuffer, 0, p.height-bottom-60, p.width, 30, true, shadowColor)
    mgBuffer.pop()
    
    // Draw Midground
    p.image(mgBuffer, 0, 0)

    // Draw Sky Reflection
    p.noStroke()
    p.fill(skyColor)
    p.rect(0, p.height-bottom, p.width, p.height)
    
    // Animate the Forest
    // const fgWidth = p.width - fgForest.settings.forestStartX;
    // const fgHeight = p.height - fgForest.settings.forestStartY;
    
    // BGForest Animation
    bgForest.animate(); // update forest image to next frame
    bgForestImage = bgForest.getImage();
    p.image(bgForestImage, 0, 0);

    // MGForest Animation
    mgForest.animate(); // update forest image to next frame
    mgForestImage = mgForest.getImage();
    p.image(mgForestImage, 0, 0);
    
    // FGForest Animation
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
    addReflectionImageToReflection(reflectionBuffer, fgForestImage) // Add all of the reflection images to a single buffer image
    addCircleImageToReflection(reflectionBuffer, circleBuffer)

    // Draw Reflection Image to Canvas
    const rx = 0
    const ry = -p.height - (p.height - bottom) + bottom
    p.push();
    p.scale(1, -1); // Flip the y-axis to draw upside down
    p.translate(rx, ry); // Adjust translation for the buffer
    p.clip(reflectionMask) // Clip out the overlap
    p.image(reflectionBuffer, 0, 0)
    p.pop();

  }

  function reflectionMask() {
    p.rect(0, 0, p.width, p.height-bottom)
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

  const generateCircleBuffer = (reflectionBuffer: p5.Graphics, fill: p5.Color) => {
    const circlesBuffer = p.createGraphics(reflectionBuffer.width, reflectionBuffer.height)
    const circlesImage = _generateCircles(circlesBuffer, 3, fill)
    return circlesImage;

    function _generateCircles(buffer: p5.Graphics, numCirlces: number, fill?: p5.Color) {
      for (let i = 0; i < numCirlces; i++) { // Adjust the number of ovals as needed
        buffer.push();
        let y = buffer.random(0, buffer.height - bottom - 5)
        let x = buffer.random(buffer.width/2 - 100, buffer.width/2 + 100)
        let w = buffer.random(1600, 2000); 
        let h = buffer.map(y, 0, buffer.height - bottom, 100, 5);
    
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

  const addCircleImageToReflection = (reflectionBuffer: p5.Graphics, circlesBuffer: p5.Graphics) => {
    reflectionBuffer.push()
    reflectionBuffer.image(circlesBuffer, 0, 0);
    reflectionBuffer.blendMode(reflectionBuffer.BLEND); // Reset to normal blend mode
    reflectionBuffer.pop()
    return reflectionBuffer;
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