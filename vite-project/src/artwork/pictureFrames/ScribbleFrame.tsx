import React, { CSSProperties } from 'react';
import P5Wrapper from '../../components/P5Wrapper';
import p5 from 'p5';
import { ScribbleFrameProps, Subdivision, PatternFunction } from './types';
import { drawGradientRect } from '../../helpers/shapes';

const mySketch = (
  innerWidth: number, 
  innerHeight: number, 
  frameTopWidth: number, 
  frameSideWidth: number
) => (p: p5) => {

  /** CANVAS SETTINGS */
  let cw = innerWidth + (frameSideWidth * 2);
  let ch = innerHeight + (frameTopWidth * 2);
  const innerCoords = {
    top_left: {x: frameSideWidth, y: frameTopWidth},
    top_right: {x: frameSideWidth + innerWidth, y: frameTopWidth},
    bottom_left: {x: frameSideWidth, y: ch - frameTopWidth},
    bottom_right: {x: cw - frameSideWidth, y: ch - frameTopWidth}
  }
  const outerCoords = {
    top_left: {x: 0, y: 0},
    top_right: {x: cw, y: 0},
    bottom_left: {x: 0, y: ch},
    bottom_right: {x: cw, y: ch}
  }
  
  
  /** FRAME SETTINGS */
  let primaryColor: {base: p5.Color[], shadowLight: p5.Color[], shadowDark: p5.Color[], highlight: p5.Color[]}
  let gold: {base: p5.Color[], shadowLight: p5.Color[], shadowDark: p5.Color[], highlight: p5.Color[]}
  let allowTrim: boolean
  let trimWidth: number
  let trimColor: p5.Color
  
  p.preload = () => {
    // textureImg = p.loadImage('/textures/gold7.png');
  }

  p.setup = () => {
    p.createCanvas(cw, ch)
    p.colorMode(p.HSL)

    /** COLOR PALETTE */
    gold = {
      base: [p.color(39, 72.3, 81.6)],
      shadowLight: [p.color(31, 62.9, 67.3)],
      shadowDark: [p.color(31, 44.2, 50.1)],
      highlight: [p.color(35, 66.7, 96.5)],
    }

    /** FRAME COLORS */
    primaryColor = p.random([gold]) // Add more colors later
    
    /** TRIM SETTINGS */
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
    p.noStroke()
    p.fill(primaryColor.shadowLight[0])
    topFrame()
    rightFrame()
    p.fill(primaryColor.base[0])
    leftFrame()
    bottomFrame()
    p.pop()
    
    /** CREATE SUBDIVISIONS FOR EACH FRAME SHAPE/SIDE */
    let subdivisions = generateSubdivisions(p.random(2, 10)) // Divide frame into subdivisions
    let sideSubdivisions = normalizeSubdivisions(subdivisions, frameSideWidth) // Normalize subdivisions to fit side widths
    let topSubdivisions = normalizeSubdivisions(subdivisions, frameTopWidth) // Normalize subdivisions  to fit top & bottom widths
    
    /** DRAW GRADIENTS IN EACH FRAME SHAPE */
    let shadowColorLight = primaryColor.shadowLight[0]
    let shadowColorDark = primaryColor.shadowDark[0]
    drawPattern(drawSloppyRect, topSubdivisions, topFrame, "top", shadowColorDark) // Top
    drawPattern(drawSloppyRect, sideSubdivisions, rightFrame, "right", shadowColorDark) // Right 
    drawPattern(drawSloppyRect, topSubdivisions, bottomFrame, "bottom", shadowColorLight) // Bottom
    drawPattern(drawSloppyRect, sideSubdivisions, leftFrame, "left", shadowColorLight) // Left
    
    /** */

    /** DRAW FLORAL PATTERNS IN EACH FRAME SHAPE */
    // p.push();
    // // p.blendMode(p.SCREEN); // p.SCREEN, or p.ADD
    // let floralColor = primaryColor.shadowDark[0]
    // drawPattern(drawFloralPattern, 0, 0, 0, topSubdivisions, topFrame, "top", floralColor) // Top
    // drawPattern(drawFloralPattern, cw, ch, 180, topSubdivisions, bottomFrame, "bottom", floralColor) // Bottom
    // drawPattern(drawFloralPattern, 0, ch, -90, sideSubdivisions, leftFrame, "left", floralColor) // Left
    // drawPattern(drawFloralPattern, cw, 0, 90, sideSubdivisions,rightFrame, "right", floralColor) // Right 
    // p.pop();


    /** DRAW SHADOWS */
    // Shadow Settings
    const shadowWidth = innerWidth;
    const shadowHeight = innerHeight;
    const shadowDepth = p.random(1, 100);
    const shadowColor = p.color(3, 56, 17, 0.25)

    // Draw Shadows
    drawInnerShadowShapeSmall(shadowDepth, shadowColor, shadowWidth, shadowHeight, innerCoords.top_left.x, innerCoords.top_left.y, false)
    drawInnerShadowShapeLarge(shadowDepth + 10, shadowColor, shadowWidth, shadowHeight, innerCoords.top_left.x, innerCoords.top_left.y, false)

    /** APPLY TEXTURE */
    // applyTexture(p, textureImg, fullframeMask)
    applyNoiseTexture(p, fullframeMask)
  }

  /**
   * Draws patterns on a specific side of the frame
   * @param patternFunction - The function that draws the actual pattern
   * @param originX - X coordinate of the origin point
   * @param startY - Y coordinate of the origin point
   * @param subdivisions - Array of subdivision configurations
   * @param maskFunction - Function that defines the clipping mask
   * @param side - Which side of the frame ("top", "right", "bottom", "left")
   * @param color - Color to use for the pattern
   */
  function drawPattern(
    patternFunction: PatternFunction,
    subdivisions: Subdivision[],
    maskFunction: () => void,
    side: 'top' | 'right' | 'bottom' | 'left',
    color: p5.Color
  ) {
    // Set rotation based on which side we're drawing
    const rotationAngles = { top: 0, right: 90, bottom: 180, left: -90 } as const;
    const rotationDegrees = rotationAngles[side];

    // Set startX and startY based on side as well
    const startingCoordinates = {top: outerCoords.top_left, right: outerCoords.top_right, bottom: outerCoords.bottom_right, left: outerCoords.bottom_left}
    const startX = startingCoordinates[side].x
    const startY = startingCoordinates[side].y
    
    // Calculate pattern width based on side orientation
    const isVerticalSide = side === "left" || side === "right";
    const patternWidth = isVerticalSide ? ch : cw;
    
    p.push();
    
    // Apply clipping mask and transform
    p.clip(maskFunction); // Ensures that the pattern is only drawn within the mask
    p.translate(startX, startY);
    p.rotate(p.radians(rotationDegrees));
    
    // Draw each subdivision
    let currentY = 0;
    
    subdivisions.forEach(({ length, depth, direction, hasTrim }) => {
      // Determine pattern position and orientation
      const isUpward = direction === "upward";
      const patternY = isUpward ? currentY + length - depth : currentY;
      const patternHeight = depth;
      
      // Apply the pattern function
      patternFunction(0, patternY, patternWidth, patternHeight, isUpward, color);
      
      // Add decorative trim if enabled
      if (allowTrim && hasTrim) {
        drawTrimForSubdivision(0, currentY, patternWidth);
      }
      
      // Move to next subdivision
      currentY += length;
    });
    
    p.pop();
  }
  
  /**
   * Draws decorative trim for a subdivision
   */
  function drawTrimForSubdivision(x: number, y: number, width: number) {
    p.push();
    
    // Draw trim rectangle
    p.noStroke();
    p.fill(trimColor);
    p.rect(x, y - 1, width, trimWidth);
    
    // Draw shadow line below trim
    p.stroke(p.color(0, 0, 0, 0.25));
    p.strokeWeight(2);
    p.line(x, y + trimWidth, width, y + trimWidth);
    
    p.pop();
  }

  function drawSloppyRect (
    startX: number,
    startY: number,
    w: number,
    h: number,
    isUpward: boolean,
    shadowColor: p5.Color
  ) {
    p.push();
    p.fill(shadowColor);
    p.rect(startX, startY, w, h);
    p.noFill();
    p.strokeWeight(1);

    // Add slight variations to create wobble effect
    const wobble = 3;
    const segments = 8; // Number of segments per side
    
    // Draw each side of the rectangle with a wobbly line
    // Left side
    let prevX = startX;
    let prevY = startY;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const nextY = startY + h * t;
      const offsetX = p.random(-wobble, wobble);
      const currX = startX + offsetX;
      p.bezier(
        prevX, prevY,
        currX + p.random(-wobble, wobble), prevY + (nextY - prevY)/3,
        currX + p.random(-wobble, wobble), prevY + 2*(nextY - prevY)/3,
        currX, nextY
      );
      prevX = currX;
      prevY = nextY;
    }

    // Bottom side
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const nextX = startX + w * t;
      const offsetY = p.random(-wobble, wobble);
      const currY = startY + h + offsetY;
      p.bezier(
        prevX, prevY,
        prevX + (nextX - prevX)/3, currY + p.random(-wobble, wobble),
        prevX + 2*(nextX - prevX)/3, currY + p.random(-wobble, wobble),
        nextX, currY
      );
      prevX = nextX;
      prevY = currY;
    }

    // Right side
    for (let i = segments; i >= 0; i--) {
      const t = i / segments;
      const nextY = startY + h * t;
      const offsetX = p.random(-wobble, wobble);
      const currX = startX + w + offsetX;
      p.bezier(
        prevX, prevY,
        currX + p.random(-wobble, wobble), prevY + (nextY - prevY)/3,
        currX + p.random(-wobble, wobble), prevY + 2*(nextY - prevY)/3,
        currX, nextY
      );
      prevX = currX;
      prevY = nextY;
    }

    // Top side
    for (let i = segments; i >= 0; i--) {
      const t = i / segments;
      const nextX = startX + w * t;
      const offsetY = p.random(-wobble, wobble);
      const currY = startY + offsetY;
      p.bezier(
        prevX, prevY,
        prevX + (nextX - prevX)/3, currY + p.random(-wobble, wobble),
        prevX + 2*(nextX - prevX)/3, currY + p.random(-wobble, wobble),
        nextX, currY
      );
      prevX = nextX;
      prevY = currY;
    }

    p.pop();
  }

  function drawFloralPattern(
    p: p5, 
    x: number,
    y: number,
    w: number,
    h: number,
    _reverse: boolean,
    strokeColor: p5.Color
  ) {
    const flowerSize = h / 4; // Size of each flower
    const petalCount = 8; // Increased number of petals for more detail
    const petalSize = flowerSize / 2; // Size of each petal
    const innerPetalSize = petalSize / 1.5; // Smaller inner petals for added detail

    for (let i = x; i < x + w; i += flowerSize * 2) {
      for (let j = y; j < y + h; j += flowerSize * 2) {
        p.push();
        p.fill(strokeColor); // Yellow color for the center
        p.stroke(strokeColor);
        p.translate(i, j - h );
        // p.noStroke();
        for (let k = 0; k < petalCount; k++) {
          p.ellipse(0, petalSize, petalSize, petalSize * 2);
          p.rotate(p.TWO_PI / petalCount);
        }
        
        // Add inner petals for more detail
        for (let k = 0; k < petalCount; k++) {
          p.ellipse(0, innerPetalSize, innerPetalSize, innerPetalSize * 2);
          p.rotate(p.TWO_PI / petalCount);
        }

        // Add a central circle for the flower center
        p.ellipse(0, 0, petalSize, petalSize);

        // Add decorative lines radiating from the center
        p.strokeWeight(1);
        for (let k = 0; k < petalCount; k++) {
          p.line(0, 0, petalSize, 0);
          p.rotate(p.TWO_PI / petalCount);
        }

        p.pop();
      }
    }
  }

  function drawInnerShadowShapeSmall(shadowDepth: number, shadowColor: p5.Color, shadowWidth: number, _shadowHeight: number, startX: number, startY: number, debug: boolean) {
    p.push();
    p.translate(startX, startY)
    p.fill(shadowColor)
    p.noStroke()
    p.beginShape();

    // BOTTOM RIGHT
    if (debug) {
      p.push()
      p.stroke("red")
      p.strokeWeight(10)
      p.point(shadowWidth, 150)
      p.pop()
    }
    p.vertex(shadowWidth, 150); // (172, 81.94)
    
    // BOTTOM LEFT
    let control1 = {x: shadowWidth/1.27 + 112, y: 23.54}
    let control2 = {x: (shadowWidth/2.43) + 61.73, y: 0}
    let anchor = {x: shadowWidth/2.43, y: 0}

    if (debug) {
      p.push()
      p.strokeWeight(10)
      p.stroke("yellow")
      p.point(anchor.x, anchor.y)
      p.stroke("pink")
      p.point(control1.x, control1.y)
      p.stroke("orange")
      p.point(control2.x, control2.y)
      p.pop()
    }
    p.bezierVertex(control1.x, control1.y, control2.x, control2.y, anchor.x, anchor.y);
    
    // TOP LEFT
    if (debug) {
      p.push()
      p.stroke("blue")
      p.strokeWeight(10)
      p.point(0, 0)
      p.pop()
    }
    // p.vertex(0, 0);
    
    // TOP RIGHT
    if (debug) {
      p.push()
      p.stroke("green")
      p.strokeWeight(10)
      p.point(shadowWidth, 0)
      p.pop()
    }
    p.vertex(shadowWidth, 0);
    p.endShape(p.CLOSE);
    p.pop()

  }

  function drawInnerShadowShapeLarge(shadowDepth: number, shadowColor: p5.Color, shadowWidth: number, shadowHeight: number, startX: number, startY: number, debug: boolean) {
    
    p.push();
    p.translate(startX, startY)
    p.fill(shadowColor)
    p.noStroke()
    p.beginShape();

    // BOTTOM RIGHT
    if (debug) {
      p.push()
      p.stroke("red")
      p.strokeWeight(10)
      p.point(shadowWidth, innerHeight)
      p.point(shadowWidth - shadowDepth, innerHeight)
      p.pop()
    }
    p.vertex(shadowWidth, innerHeight);
    p.vertex(shadowWidth - shadowDepth, innerHeight);
    
    // BOTTOM LEFT
    let control1 = {x: shadowWidth/1.27, y: 23.54}
    let control2 = {x: 61.73, y: shadowDepth}
    let anchor = {x: 0, y: shadowDepth}
    if (debug) {
      p.push()
      p.strokeWeight(10)
      p.stroke("yellow")
      p.point(anchor.x, anchor.y)
      p.stroke("pink")
      p.point(control1.x, control1.y)
      p.stroke("orange")
      p.point(control2.x, control2.y)
      p.pop()
    }
    p.bezierVertex(control1.x, control1.y, control2.x, control2.y, anchor.x, anchor.y);
    
    // TOP LEFT
    if (debug) {
      p.push()
      p.stroke("blue")
      p.strokeWeight(10)
      p.point(0, 0)
      p.pop()
    }
    p.vertex(0, 0);
    
    // TOP RIGHT
    if (debug) {
      p.push()
      p.stroke("green")
      p.strokeWeight(10)
      p.point(shadowWidth, 0)
      p.pop()
    }
    p.vertex(shadowWidth, 0);
    p.endShape(p.CLOSE);
    p.pop()

  }

  function generateSubdivisions(numSubdivisions: number) {
    let subdivisions: Subdivision[] = [];

    // Generate random length and depth values for each subdivision.
    for (let i = 0; i < numSubdivisions; i++) {
      let length = p.random(2, 50);
      let depth = length / p.random(2, 5);
      let direction = p.random(0, 1) > 0.5 ? "upward" : "downward";
      let hasTrim = p.random(0, 1) > 0.5 ? true : false;
      subdivisions.push({length, depth, direction, hasTrim});
    }

    // Add outer and inner subdivisions to represent the inside and outside borders of the frame
    let outerSubdivisionLength = p.random(2, 3);
    let innerSubdivisionLength = p.random(2, 3);
    subdivisions.unshift({
      length: outerSubdivisionLength, 
      depth: outerSubdivisionLength, 
      direction: "downward",
      hasTrim: p.random(0, 1) > 0.5 ? true : false
    });
    subdivisions.push({
      length: innerSubdivisionLength, 
      depth: innerSubdivisionLength, 
      direction: "upward",
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

const ScribbleFrame: React.FC<ScribbleFrameProps> = ({
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
export default ScribbleFrame;