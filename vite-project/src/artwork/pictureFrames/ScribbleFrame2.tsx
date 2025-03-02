import React, { CSSProperties } from 'react';
import P5Wrapper from '../../components/P5Wrapper';
import p5 from 'p5';
import { ScribbleFrameProps } from './types';

type Direction = "NORTH" | "NORTHEAST" | "EAST" | "SOUTHEAST" | "SOUTH" | "SOUTHWEST" | "WEST" | "NORTHWEST";

interface Subdivision {
  subdivisionHeight: number, 
  isShadowShape: boolean,
}

type PatternFunction = (
  x: number,
  y: number,
  w: number,
  h: number,
  strokeColor: p5.Color
) => void;

const DEBUG_SHADOWS = true;

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
  let subdivisions: Subdivision[]
  let sideSubdivisions: Subdivision[]
  let topSubdivisions: Subdivision[]
  let shadowWidth : number
  let shadowHeight : number
  let shadowDepth : number
  let shadowColor : p5.Color
  let lightSourceCoords: {x: number, y: number}
  
  p.preload = () => {
    // textureImg = p.loadImage('/textures/gold7.png');
  }

  p.setup = () => {
    p.createCanvas(cw, ch)
    p.colorMode(p.HSL)

    /** COLOR PALETTE(s) */
    gold = {
      base: [p.color(39, 72.3, 81.6)],
      shadowLight: [p.color(31, 62.9, 67.3)],
      shadowDark: [p.color(18, 36.7, 44)],
      highlight: [p.color(80, 66.7, 96.5)],
    }

    /** FRAME COLORS */
    primaryColor = gold // Add more colors later
    
    /** CREATE SUBDIVISIONS FOR EACH FRAME SHAPE/SIDE */
    subdivisions = generateSubdivisions(p.random(1, 5)) // Divide frame into subdivisions
    sideSubdivisions = normalizeSubdivisions(subdivisions, frameSideWidth) // Normalize subdivisions to fit side widths
    topSubdivisions = normalizeSubdivisions(subdivisions, frameTopWidth) // Normalize subdivisions  to fit top & bottom widths
  }
  
  p.draw = () => {
    p.noLoop()
    p.clear()

    /** DRAW GRADIENTS IN EACH FRAME SHAPE */
    drawSubdivision(drawSloppyRect, "top", primaryColor, true) // Top
    drawSubdivision(drawSloppyRect, "right", primaryColor, true) // Right 
    drawSubdivision(drawSloppyRect, "bottom", primaryColor, false) // Bottom
    drawSubdivision(drawSloppyRect, "left", primaryColor, false) // Left
    
    /** DRAW CIRCLES */
    drawSubdivision(drawFlourishes, "top", primaryColor, true) // Top
    drawSubdivision(drawFlourishes, "right", primaryColor, true) // Right 
    drawSubdivision(drawFlourishes, "bottom", primaryColor, false) // Bottom
    drawSubdivision(drawFlourishes, "left", primaryColor, false) // Left
    
    /** DRAW SHADOWS */
    let lightSourceCoords = {x: outerCoords.top_right.x, y: outerCoords.top_right.y}
    shadowWidth = innerWidth;
    shadowHeight = innerCoords.top_left.y - lightSourceCoords.y;
    shadowDepth = p.random(1, 100);
    shadowColor = p.color(3, 56, 17, 0.25)
    
    p.push()
    p.noStroke()
    drawInnerShadowShapeSmall(shadowDepth, shadowColor, shadowWidth, shadowHeight, innerCoords.top_left.x, innerCoords.top_left.y, false)
    drawInnerShadowShapeLarge(shadowDepth + 10, shadowColor, shadowWidth, shadowHeight, innerCoords.top_left.x, innerCoords.top_left.y, false)
    p.pop()
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
  function drawSubdivision(
    patternFunction: PatternFunction,
    side: 'top' | 'right' | 'bottom' | 'left',
    color: {base: p5.Color[], shadowLight: p5.Color[], shadowDark: p5.Color[], highlight: p5.Color[]},
    isInShadow: boolean
  ) {
    
    // Set clip function to form shape of frame side
    const maskFunction = {top: topFrame ,right: rightFrame, bottom: bottomFrame, left: leftFrame,}[side]

    // Set subdivisions based on side
    const subdivisions: Subdivision[] = {top: topSubdivisions, right: sideSubdivisions, bottom: topSubdivisions, left: sideSubdivisions}[side]

    // Set rotation based on which side we're drawing
    const rotationAngles = { top: 0, right: 90, bottom: 180, left: -90 } as const;
    const rotationDegrees = rotationAngles[side];

    // Set startX and startY based on side as well
    const startingCoordinates = {top: outerCoords.top_left, right: outerCoords.top_right, bottom: outerCoords.bottom_right, left: outerCoords.bottom_left}
    const startX = startingCoordinates[side].x
    const startY = startingCoordinates[side].y
    
    // Calculate pattern width based on side orientation
    const subDivisionWidth = {left: ch, right: ch, top: cw, bottom: cw}[side]
    
    p.push();
    
    // Apply clipping mask and transform
    p.clip(maskFunction); // Ensures that the pattern is only drawn within the mask
    p.translate(startX, startY);
    p.rotate(p.radians(rotationDegrees));
    
    // Draw each subdivision
    let currentY = 0;
    
    subdivisions.forEach(({ subdivisionHeight, isShadowShape }) => {
      // Apply the pattern function
      const baseColor = isInShadow ? color.shadowLight[0] : color.base[0]
      const shadowColor = isInShadow ? color.shadowDark[0] : color.shadowLight[0]
      const _color = isShadowShape ? shadowColor : baseColor
      patternFunction(0, currentY, subDivisionWidth, subdivisionHeight, _color);
      
      // Move to next subdivision
      currentY += subdivisionHeight;
    });
    
    p.pop();
  }
  
  /**
   * Draws a sloppy rectangle with a wobble effect
   * @param {number} startX The x-coordinate of the top-left corner of the rectangle
   * @param {number} startY The y-coordinate of the top-left corner of the rectangle
   * @param {number} w The width of the rectangle
   * @param {number} h The height of the rectangle
   * @param {p5.Color} shadowColor The color of the shadow rectangle
   */
  function drawFlourishes (
    startX: number,
    startY: number,
    w: number,
    h: number,
    color: p5.Color
  ) {
    p.push();
    p.fill(color);
    // p.strokeWeight(2);
    p.noStroke();
    p.beginShape();

    
    
    p.pop();
  }
  
  /**
   * Draws a sloppy rectangle with a wobble effect
   * @param {number} startX The x-coordinate of the top-left corner of the rectangle
   * @param {number} startY The y-coordinate of the top-left corner of the rectangle
   * @param {number} w The width of the rectangle
   * @param {number} h The height of the rectangle
   * @param {p5.Color} shadowColor The color of the shadow rectangle
   */
  function drawSloppyRect (
    startX: number,
    startY: number,
    w: number,
    h: number,
    color: p5.Color
  ) {
    p.push();
    p.fill(color);
    // p.strokeWeight(2);
    p.noStroke();
    p.beginShape();

    // Add slight variations to create wobble effect
    const wobble = 5;
    const segments = 3; // Number of segments per side
    
    // Draw each side of the rectangle with a wobbly line
    // Left side
    let prevX = startX;
    let prevY = startY;
    p.vertex(prevX, prevY)
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const nextY = startY + h * t;
      const offsetX = p.random(-wobble, wobble);
      const currX = startX + offsetX;
      p.bezierVertex(
        // prevX, prevY,
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
      p.bezierVertex(
        // prevX, prevY,
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
      p.bezierVertex(
        // prevX, prevY,
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
      p.bezierVertex(
        // prevX, prevY,
        prevX + (nextX - prevX)/3, currY + p.random(-wobble, wobble),
        prevX + 2*(nextX - prevX)/3, currY + p.random(-wobble, wobble),
        nextX, currY
      );
      prevX = nextX;
      prevY = currY;
    }

    p.vertex(prevX, prevY)
    p.endShape(p.CLOSE);
    p.pop();
  }

  function generateSubdivisions(numSubdivisions: number) {
    let subdivisions: Subdivision[] = [];

    // Generate random length and depth values for each subdivision.
    for (let i = 0; i < numSubdivisions; i++) {
      let subdivisionHeight = p.random(2, 10);
      let isShadowShape = p.random(0, 1) > 0.75 ? true : false;
      subdivisions.push({subdivisionHeight, isShadowShape});
    }

    // Add outer and inner subdivisions to represent the inside and outside borders of the frame
    let outerSubdivisionHeight = p.random(1, 5);
    let innerSubdivisionHeight = p.random(1, 5);
    subdivisions.unshift({
      subdivisionHeight: outerSubdivisionHeight,
      isShadowShape: false,
    });
    subdivisions.push({
      subdivisionHeight: innerSubdivisionHeight, 
      isShadowShape: true,
    });
    
    return subdivisions;
  }

  function normalizeSubdivisions(subdivisions: Subdivision[], h: number) {

    // Calculate the total length of all subdivisions
    let total = subdivisions.reduce((acc, subdivision) => acc + subdivision.subdivisionHeight, 0);
    
    // Normalize the subdivisions and depth values to sum up to h
    const normalized = subdivisions.map(subdivision => ({
      ...subdivision,
      subdivisionHeight: subdivision.subdivisionHeight / total * h,
    }));
    
    return normalized;
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

  function drawControlPoint(point1: {x: number, y: number}, color: string) {
    p.push()
    p.strokeWeight(10)
    p.stroke(color)
    p.point(point1.x, point1.y)
    p.pop()
  }
  
  p.mousePressed = () => {
    // Check if mouse is inside canvas
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
    }
  }
};

const ScribbleFrame2: React.FC<ScribbleFrameProps> = ({
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
    cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"white\"><path d=\"M12 2C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm-3 19v-1h6v1c0 .55-.45 1-1 1h-4c-.55 0-1-.45-1-1z\"/></svg>') 16 16, pointer",
  };

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
          disableClickToSetup
          // disableClickToClear
          includeSaveButton={false} 
          sketch={_outerSketch} 
        />
      </div>
    </div>
  );
};

export {mySketch};
export default ScribbleFrame2;