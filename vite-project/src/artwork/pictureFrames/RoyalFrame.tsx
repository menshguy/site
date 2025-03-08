import React, { CSSProperties } from 'react';
import P5Wrapper from '../../components/P5Wrapper';
import p5 from 'p5';
import { RoyalFrameProps, Subdivision, PatternFunction } from './types';
import { rect_gradient } from '../../helpers/shapes';

const mySketch = (
  innerWidth: number, 
  innerHeight: number, 
  frameTopWidth: number, 
  frameSideWidth: number
) => (p: p5) => {

  /** CANVAS SETTINGS */
  let cw = innerWidth + (frameSideWidth * 2);
  let ch = innerHeight + (frameTopWidth * 2);
  let allowTrim: boolean
  let trimWidth: number
  let trimColor: p5.Color
  let mainColor: p5.Color
  let goldColor: p5.Color
  let blackColor: p5.Color
  let deepRedColor: p5.Color
  
  p.preload = () => {
    // textureImg = p.loadImage('/textures/gold7.png');
  }

  p.setup = () => {
    p.createCanvas(cw, ch)
    p.colorMode(p.HSL)

    /** GENERAL SETTINGS */
    // let textureImg: p5.Image;
    goldColor = p.color(34, 62.1, 74.1)
    blackColor = p.color(236, 7, 20)
    deepRedColor = p.color(354, 45, 15)
    mainColor = p.random([goldColor, blackColor, deepRedColor])
    // mainColor = p.color(34, 62.1, 74.1) // Gold
      
    allowTrim = p.random(0, 1) > 0.70 ? true : false;
    trimWidth = p.random(2, 3);
    trimColor = p.random([
      // p.color("white"), //white in HSL
      p.color("black"), //black in HSL
      p.color(34, 62.1, 74.1),
      p.color(15, 63, 44), //deep red in HSL
      p.color(15, 83, 14), //darker deep red in HSL
      // p.color(229, 63, 17) // dark blue
    ])
  }
  
  p.draw = () => {
    p.noLoop()
    
    /** DRAW FRAME SHAPES */
    p.push()
    p.fill(mainColor)
    p.noStroke()
    topFrame()
    leftFrame()
    rightFrame()
    bottomFrame()
    p.pop()
    
    /** CREATE SUBDIVISIONS */
    let subdivisions = generateSubdivisions(p.random(2, 10)) // Generate random subdivisions
    let sideSubdivisions = normalizeSubdivisions(subdivisions, frameSideWidth) // Normalize subdivisions for side  
    let topAndBottomSubdivisions = normalizeSubdivisions(subdivisions, frameTopWidth) // Normalize subdivisions for top and bottom
    
    /** DRAW GRADIENTS IN EACH FRAME SHAPE */
    // let patternColor = p.color(30, 60, 30)
    let gradientColor = p.color(p.hue(mainColor), p.saturation(mainColor), p.lightness(mainColor)/2.5)
    drawPattern(rect_gradient, 0, 0, 0, topAndBottomSubdivisions, topFrame, "top", gradientColor) // Top
    drawPattern(rect_gradient, cw, ch, 180, topAndBottomSubdivisions, bottomFrame, "bottom", gradientColor) // Bottom
    drawPattern(rect_gradient, 0, ch, -90, sideSubdivisions, leftFrame, "left", gradientColor) // Left
    drawPattern(rect_gradient, cw, 0, 90, sideSubdivisions, rightFrame, "right", gradientColor) // Right 
    
    /** DRAW FLORAL PATTERNS IN EACH FRAME SHAPE */
    // p.push();
    // // p.blendMode(p.SCREEN); // p.SCREEN, or p.ADD
    // let floralColor = p.color(p.hue(goldColor), p.saturation(goldColor), 80)
    // drawPattern(drawFloralPattern, 0, 0, 0, topAndBottomSubdivisions, topFrame, "top", floralColor) // Top
    // drawPattern(drawFloralPattern, cw, ch, 180, topAndBottomSubdivisions, bottomFrame, "bottom", floralColor) // Bottom
    // drawPattern(drawFloralPattern, 0, ch, -90, sideSubdivisions, leftFrame, "left", floralColor) // Left
    // drawPattern(drawFloralPattern, cw, 0, 90, sideSubdivisions,rightFrame, "right", floralColor) // Right 
    // p.pop();

    /** APPLY TEXTURE */
    // applyTexture(p, textureImg, fullframeMask)
    applyNoiseTexture(p, fullframeMask)
  }

  function generateSubdivisions(numSubdivisions: number) {
    let subdivisions: Subdivision[] = [];

    // Generate random length and depth values for each subdivision.
    for (let i = 0; i < numSubdivisions; i++) {
      let length = p.random(2, 50);
      let depth = length / p.random(2, 5);
      let direction = p.random(0, 1) > 0.5 ? "inward" : "outward";
      let hasTrim = p.random(0, 1) > 0.5 ? true : false;
      subdivisions.push({length, depth, direction, hasTrim});
    }

    // Add outer and inner subdivisions to represent the inside and outside borders of the frame
    let outerSubdivisionLength = p.random(2, 3);
    let innerSubdivisionLength = p.random(2, 3);
    subdivisions.unshift({
      length: outerSubdivisionLength, 
      depth: outerSubdivisionLength, 
      direction: "outward",
      hasTrim: p.random(0, 1) > 0.5 ? true : false
    });
    subdivisions.push({
      length: innerSubdivisionLength, 
      depth: innerSubdivisionLength, 
      direction: "inward",
      hasTrim: p.random(0, 1) > 0.5 ? true : false
    });
    
    return subdivisions;
  }

  function normalizeSubdivisions(subdivisions: Subdivision[], h: number) {
    // Calculate the total length of all subdivisions
    let total = subdivisions.reduce((acc, subdivision) => acc + subdivision.length, 0);
    
    // Normalize the subdivisions and depth values to sum up to h
    return subdivisions.map(subdivision => ({
      ...subdivision,
      length: subdivision.length / total * h,
      depth: subdivision.depth / total * h,
    }));
  }

  function drawPattern (
    patternFunction: PatternFunction, 
    x: number, 
    y: number, 
    angle: number, 
    subdivisions: Subdivision[], 
    mask: () => void,
    side: string, // top, bottom, left, right - in future, this can be used to draw different patterns for each side
    strokeColor: p5.Color
  ) {
    p.push()
    p.clip(mask);
    p.translate(x, y);
    p.rotate(p.radians(angle));
    let _y = 0;
    let x2 = side === "left" || side === "right" ? ch : cw; // if we are drawing a side frame, we have rotated 90deg and ned the width to be the height of the canvas
    let w = calculateDistance(0, y, x2, y);
    subdivisions.forEach(({length, depth, direction, hasTrim}) => {
      
      // Draw the Frame gradient pattern for each subdivision
      let x = 0 // if inward, start at beginning of subdivision, otherwise start at end
      let y = direction === "inward" ? _y + length - depth: _y; // if inward, start at the end of the subdivision, otherwise start at the beginning
      let h = depth;
      let reverse = direction === "inward" ? true : false; // if "inward", you want to start the gradient at the end of the subdivision, otherwise start at the beginning - the depth value. This will create a downward slope that ends at the end of the subdivision.
      patternFunction(p, x, y, w, h, reverse, strokeColor);

      if (allowTrim && hasTrim) {

        // Draw Trim  
        p.noStroke();
        p.fill(trimColor);
        p.rect(x, _y-1, w, trimWidth);
        
        // Draw a line to act as a shadow
        p.stroke(p.color(0,0,0, 0.25));
        p.strokeWeight(2);
        p.line(x, _y + trimWidth, w, _y + trimWidth); // Trime Shadow
      }

      _y += length;
    })
    p.pop();
  }

  // function drawFloralPattern(
  //   p: p5, 
  //   x: number,
  //   y: number,
  //   w: number,
  //   h: number,
  //   _reverse: boolean,
  //   strokeColor: p5.Color
  // ) {
  //   const flowerSize = h / 4; // Size of each flower
  //   const petalCount = 8; // Increased number of petals for more detail
  //   const petalSize = flowerSize / 2; // Size of each petal
  //   const innerPetalSize = petalSize / 1.5; // Smaller inner petals for added detail

  //   for (let i = x; i < x + w; i += flowerSize * 2) {
  //     for (let j = y; j < y + h; j += flowerSize * 2) {
  //       p.push();
  //       p.fill(strokeColor); // Yellow color for the center
  //       p.stroke(strokeColor);
  //       p.translate(i, j - h );
  //       p.noStroke();
  //       for (let k = 0; k < petalCount; k++) {
  //         p.ellipse(0, petalSize, petalSize, petalSize * 2);
  //         p.rotate(p.TWO_PI / petalCount);
  //       }
        
  //       // Add inner petals for more detail
  //       for (let k = 0; k < petalCount; k++) {
  //         p.ellipse(0, innerPetalSize, innerPetalSize, innerPetalSize * 2);
  //         p.rotate(p.TWO_PI / petalCount);
  //       }

  //       // Add a central circle for the flower center
  //       p.ellipse(0, 0, petalSize, petalSize);

  //       // Add decorative lines radiating from the center
  //       p.strokeWeight(1);
  //       for (let k = 0; k < petalCount; k++) {
  //         p.line(0, 0, petalSize, 0);
  //         p.rotate(p.TWO_PI / petalCount);
  //       }

  //       p.pop();
  //     }
  //   }
  // }

  function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /** APPLY TEXTURE */
  // function applyTexture(p: p5, textureImg: p5.Image, mask: () => void) {
  //   p.push();
  //   p.clip(mask);
  //   p.blendMode(p.SCREEN); // p.SCREEN
  //   const tileWidth = 200; // Set the desired width for each tile
  //   const tileHeight = 200; // Set the desired height for each tile

  //   for (let x = 0; x < cw; x += tileWidth) {
  //     for (let y = 0; y < ch; y += tileHeight) {
  //       p.image(textureImg, x, y, tileWidth, tileHeight);
  //     }
  //   }
  //   p.pop()
  // }

  function applyNoiseTexture(p: p5, mask: () => void) {
    p.push();
    p.clip(mask);
  
    // Create a graphics buffer
    const noiseBuffer = p.createGraphics(cw, ch);
  
    // Set noise detail
    noiseBuffer.noiseDetail(8, 0.65);
  
    // Draw noise texture to the buffer
    noiseBuffer.loadPixels();
    for (let x = 0; x < cw; x++) {
      for (let y = 0; y < ch; y++) {
        let scale = p.random(0.95, 1);
        let noiseValue = noiseBuffer.noise(x * scale, y * scale); // Adjust the scale for noise
        let alpha = p.map(noiseValue, 0, 1, 0, 0.1); // Map noise value to alpha
        noiseBuffer.set(x, y, p.color(255, alpha)); // White color with varying alpha
      }
    }
    noiseBuffer.updatePixels();
  
    // Draw the noise buffer onto the main canvas
    p.blendMode(p.SCREEN); // p.SCREEN, p.ADD, p.MULTIPLY
    p.image(noiseBuffer, 0, 0);
  
    p.pop();
  }
  
  /** FRAME SHAPES */
  function topFrame() {
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(cw, 0);
    p.vertex(cw - frameSideWidth, frameTopWidth);
    p.vertex(frameSideWidth, frameTopWidth);
    p.endShape(p.CLOSE);
  }
  function leftFrame() {
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(0, ch);
    p.vertex(frameSideWidth, ch - frameTopWidth);
    p.vertex(frameSideWidth, frameTopWidth);
    p.endShape(p.CLOSE);
  }
  function rightFrame() {
    p.beginShape();
    p.vertex(cw, 0); // top right
    p.vertex(cw, ch); // bottom right 
    p.vertex(cw - frameSideWidth, ch - frameTopWidth); // bottom left
    p.vertex(cw - frameSideWidth, frameTopWidth); // top left
    p.endShape(p.CLOSE);
  }
  function bottomFrame() {
    p.beginShape();
    p.vertex(0, ch);
    p.vertex(cw, ch);
    p.vertex(cw - frameSideWidth, ch-frameTopWidth);
    p.vertex(frameSideWidth, ch-frameTopWidth);
    p.endShape(p.CLOSE);
  }
  function fullframeMask () {
    leftFrame()
    rightFrame()
    bottomFrame()
    topFrame()
  }
  
  p.mousePressed = () => {
    // Check if mouse is inside canvas
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
    }
  }
};

const RoyalFrame: React.FC<RoyalFrameProps> = ({
  innerWidth, 
  innerHeight,
  frameTopWidth,
  frameSideWidth,
  innerSketch,
  includeBoxShadow,
  showPrompt = true
}) => {

  const min = 25
  const max = 150
  const _frameTopWidth = frameTopWidth ? frameTopWidth : Math.floor(Math.random() * (max - min) + min)
  const _frameSideWidth = frameSideWidth ? frameSideWidth : _frameTopWidth
  const totalHeight = innerHeight + (_frameTopWidth * 2)
  // const totalWidth = innerWidth +  + (_frameSideWidth * 2)

  const _outerSketch = mySketch(innerWidth, innerHeight, _frameTopWidth, _frameSideWidth);
  const _innerSketch = innerSketch;
  
  // const InnerSketchMemo = useMemo(() => <P5Wrapper includeSaveButton={false} sketch={_innerSketch} />, [_innerSketch]);
  // const OuterSketchMemo = useMemo(() => <P5Wrapper includeSaveButton={false} sketch={_outerSketch} />, [_outerSketch]);

  /** STYLES */
  const containerStyles: CSSProperties = {
    position: 'relative',
    boxShadow: includeBoxShadow ? '0px 10px 20px rgba(0, 0, 0, 0.2)' : 'none',
    height: `${innerHeight + _frameTopWidth + _frameSideWidth}px`,
    width: `${innerWidth + _frameSideWidth + _frameSideWidth}px`,
  }

  const childFrame: CSSProperties = {
    position: 'relative',
    top: `0px`,
    left: `0px`,
  }
  const childSketch: CSSProperties = {
    position: 'absolute',
    top: `${_frameTopWidth}px`,
    left: `${_frameSideWidth}px`,
  }
  
  const fancyFonts = [
    'Brush Script MT, cursive',
    'Lucida Handwriting, cursive',
    'Palatino Linotype, serif',
    'Garamond, serif',
    // 'Copperplate, fantasy',
    // 'Papyrus, fantasy'
  ];
  const labelContainerStyles: CSSProperties = {
    position: 'absolute',
    top: `${totalHeight - (_frameTopWidth)}px`,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 1000,
  }
  const labelStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    marginTop: `${Math.floor(Math.random() * (_frameTopWidth/2))}px`,
    width: '200px',
    textAlign: 'center',
    fontFamily: fancyFonts[Math.floor(Math.random() * fancyFonts.length)],
    fontSize: `${Math.floor(Math.random() * (18 - 24 + 1)) + 18}px`,
    color: 'white',
    backgroundColor: '#e7c59a',
    border: '1px solid #855e2e',
    borderRadius: '6px',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    padding: '4px 0px',
  }

  return (
    <div style={containerStyles}>
      {showPrompt && <div style={labelContainerStyles}>
        <div style={labelStyles} title="Some drawings take longer than others!">
          Click to Redraw 
        </div>
      </div>}
      <div style={childSketch}>
        <P5Wrapper 
          includeSaveButton={false} 
          sketch={_innerSketch}
        />
      </div>
      <div style={childFrame}>
        <P5Wrapper 
          includeSaveButton={false} 
          sketch={_outerSketch} 
        />
      </div>
    </div>
  );
};

export {mySketch};
export default RoyalFrame;