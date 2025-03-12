import p5 from 'p5';
import { Subdivision, PatternFunction } from './types';
import blankSketch from './blankSketch';
import { ColorSettings } from './types';

type Direction = 'NORTH' | 'NORTHEAST' | 'EAST' | 'SOUTHEAST' | 'SOUTH' | 'SOUTHWEST' | 'WEST' | 'NORTHWEST';

const DEBUG_SHADOWS = true

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

  /** INNER SKETCH (The actual "painitng" inside the frame) */
  const innerSketch = blankSketch(frameSideWidth, frameTopWidth, innerWidth, innerHeight)(p);
  
  
  /** FRAME SETTINGS */
  let primaryColor: ColorSettings
  let gold: ColorSettings
  let allowTrim: boolean
  let trimWidth: number
  let trimColor: p5.Color
  let subdivisions: Subdivision[]
  let sideSubdivisions: Subdivision[]
  let topSubdivisions: Subdivision[]
  // let _shadowWidth: number
  // let _shadowHeight: number
  // let _shadowDepth: number
  let shadowColor: p5.Color
  let lightSourceCoords: {x: number, y: number}
  let lightSourceDirection: Direction
  let lightSourceDirections: Record<Direction, boolean>
  
  p.preload = () => {
    // textureImg = p.loadImage('/textures/gold7.png');
  }

  p.setup = () => {
    /** INNER SKETCH */
    innerSketch.setup();

    /** FRAME SKETCH */
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
      p.color("black"), //black in HSL
      p.color(34, 62.1, 74.1),
      p.color(15, 63, 44), //deep red in HSL
      p.color(15, 83, 14), //darker deep red in HSL
    ])

    /** LIGHT SOURCE SETTINGS */
    lightSourceCoords = {x: outerCoords.top_right.x, y: outerCoords.top_right.y}
    lightSourceDirections = {
      NORTH: lightSourceCoords.x > innerCoords.top_left.x && lightSourceCoords.x < innerCoords.top_right.x && lightSourceCoords.y < innerCoords.top_left.y,
      NORTHEAST: lightSourceCoords.x > innerCoords.top_right.x && lightSourceCoords.y < innerCoords.top_left.y, 
      EAST: lightSourceCoords.x > innerCoords.top_right.x && lightSourceCoords.y > innerCoords.top_right.y && lightSourceCoords.y < innerCoords.bottom_right.y, 
      SOUTHEAST: lightSourceCoords.x > innerCoords.bottom_right.x && lightSourceCoords.y > innerCoords.bottom_right.y,
      SOUTH: lightSourceCoords.x > innerCoords.bottom_left.x && lightSourceCoords.x < innerCoords.bottom_right.x && lightSourceCoords.y > innerCoords.bottom_left.y, 
      SOUTHWEST: lightSourceCoords.x < innerCoords.bottom_left.x && lightSourceCoords.y > innerCoords.bottom_left.y, 
      WEST: lightSourceCoords.x < innerCoords.top_left.x && lightSourceCoords.y > innerCoords.top_left.y && lightSourceCoords.y < innerCoords.bottom_left.y, 
      NORTHWEST: lightSourceCoords.x < innerCoords.top_left.x && lightSourceCoords.y > innerCoords.top_left.y
    } as const;
    console.log("Directions", lightSourceDirections, "Direction", lightSourceDirection)

    /** SHADOW SETTINGS */
    // _shadowWidth = innerWidth;
    // _shadowHeight = innerCoords.top_left.y - lightSourceCoords.y;
    // _shadowDepth = p.random(1, 100);
    shadowColor = p.color(3, 56, 17, 0.25)
    
    /** CREATE SUBDIVISIONS FOR EACH FRAME SHAPE/SIDE */
    subdivisions = generateSubdivisions(p.random(2, 10)) // Divide frame into subdivisions
    sideSubdivisions = normalizeSubdivisions(subdivisions, frameSideWidth) // Normalize subdivisions to fit side widths
    topSubdivisions = normalizeSubdivisions(subdivisions, frameTopWidth) // Normalize subdivisions  to fit top & bottom widths
    
    /** DRAW FLORAL PATTERNS IN EACH FRAME SHAPE */
    // p.push();
    // // p.blendMode(p.SCREEN); // p.SCREEN, or p.ADD
    // let floralColor = primaryColor.shadowDark[0]
    // drawPattern(drawFloralPattern, 0, 0, 0, topSubdivisions, topFrame, "top", floralColor) // Top
    // drawPattern(drawFloralPattern, cw, ch, 180, topSubdivisions, bottomFrame, "bottom", floralColor) // Bottom
    // drawPattern(drawFloralPattern, 0, ch, -90, sideSubdivisions, leftFrame, "left", floralColor) // Left
    // drawPattern(drawFloralPattern, cw, 0, 90, sideSubdivisions,rightFrame, "right", floralColor) // Right 
    // p.pop();
    

  }
  
  p.draw = () => {
    p.clear()

    /** INNER SKETCH */
    innerSketch.draw();

    /** FRAME SKETCH */
    // p.noLoop()

    /** LIGHT SOURCE UPDATE */
    lightSourceCoords = {x: p.mouseX || outerCoords.top_right.x, y: p.mouseY || outerCoords.top_right.y}
    lightSourceDirections = {
      NORTH: lightSourceCoords.x > innerCoords.top_left.x && lightSourceCoords.x < innerCoords.top_right.x && lightSourceCoords.y < innerCoords.top_left.y,
      NORTHEAST: lightSourceCoords.x > innerCoords.top_right.x && lightSourceCoords.y < innerCoords.top_left.y, 
      EAST: lightSourceCoords.x > innerCoords.top_right.x && lightSourceCoords.y > innerCoords.top_right.y && lightSourceCoords.y < innerCoords.bottom_right.y, 
      SOUTHEAST: lightSourceCoords.x > innerCoords.bottom_right.x && lightSourceCoords.y > innerCoords.bottom_right.y,
      SOUTH: lightSourceCoords.x > innerCoords.bottom_left.x && lightSourceCoords.x < innerCoords.bottom_right.x && lightSourceCoords.y > innerCoords.bottom_left.y, 
      SOUTHWEST: lightSourceCoords.x < innerCoords.bottom_left.x && lightSourceCoords.y > innerCoords.bottom_left.y, 
      WEST: lightSourceCoords.x < innerCoords.top_left.x && lightSourceCoords.y > innerCoords.top_left.y && lightSourceCoords.y < innerCoords.bottom_left.y,
      NORTHWEST: lightSourceCoords.x < innerCoords.top_left.x && lightSourceCoords.y < innerCoords.top_left.y && lightSourceCoords.y < innerCoords.bottom_left.y, 
    } as const;
    lightSourceDirection = Object.keys(lightSourceDirections).find(key => lightSourceDirections[key as Direction] === true) as Direction;

    /** DRAW FRAME SHAPES */
    p.push()
    
    p.noStroke()
    const shadowLightColor = primaryColor.shadowLight?.[0] ?? primaryColor.base[0]
    p.fill(shadowLightColor)
    topFrame()
    rightFrame()

    p.fill(primaryColor.base[0])
    leftFrame()
    bottomFrame()

    p.pop()

    /** DRAW GRADIENTS IN EACH FRAME SHAPE */
    let shadowColorLight = primaryColor.shadowLight?.[0] ?? primaryColor.base[0]
    let shadowColorDark = primaryColor.shadowDark[0]
    drawPattern(drawSloppyRect, topSubdivisions, topFrame, "top", shadowColorDark) // Top
    drawPattern(drawSloppyRect, sideSubdivisions, rightFrame, "right", shadowColorDark) // Right 
    drawPattern(drawSloppyRect, topSubdivisions, bottomFrame, "bottom", shadowColorLight) // Bottom
    drawPattern(drawSloppyRect, sideSubdivisions, leftFrame, "left", shadowColorLight) // Left

    /** Draw Light Source Dot*/
    p.push()
    p.strokeWeight(10)
    p.stroke("red")
    p.point(lightSourceCoords.x, lightSourceCoords.y)
    p.pop()
    
    /** DRAW SHADOWS */
    p.push()
    p.fill(shadowColor)
    p.noStroke()

    const MAX_SHADOW_DEPTH_SIDES = innerWidth;
    const MAX_SHADOW_DEPTH_TOP = innerHeight;
    let _topShadowDepth = Math.min(innerCoords.top_right.y - lightSourceCoords.y, MAX_SHADOW_DEPTH_TOP)
    let _leftSideShadowDepth = Math.min(innerCoords.top_left.x - lightSourceCoords.x, MAX_SHADOW_DEPTH_SIDES)
    let _bottomShadowDepth = Math.min(lightSourceCoords.y - innerCoords.bottom_left.y, MAX_SHADOW_DEPTH_TOP)
    let _rightSideShadowDepth = Math.min(lightSourceCoords.x - innerCoords.top_right.x, MAX_SHADOW_DEPTH_SIDES)

    function addBezier(
      a: {x: number, y: number}, 
      b: {x: number, y: number}, 
      min: number,
      max: number,
      mouse: number,
      topShadowDepth: number,
      sideShadowDepth: number
    ) {
      p.beginShape()
      p.vertex(a.x, a.y) 
      p.vertex(b.x, b.y) 
      
      const anchor1Clamp = b.y + _topShadowDepth;
      const anchor2Clamp = a.y + _topShadowDepth;
      const anchor1 = {x: b.x, y: Math.max(p.map(mouse, b.x, a.x/2 + frameSideWidth, max, min + topShadowDepth), anchor1Clamp)}
      const anchor2 = {x: Math.min(a.x - sideShadowDepth, a.x), y: Math.max(p.map(mouse, b.x + innerWidth/2, a.x, min + topShadowDepth, max), anchor2Clamp)}
      const control1 = {x: Math.max(mouse, b.x), y: b.y + topShadowDepth}
      const control2 = {x: Math.min(mouse, a.x), y: b.y + topShadowDepth}
      p.vertex(anchor1.x, anchor1.y) 
      p.bezierVertex(control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y); 

      p.vertex(a.x, a.y + topShadowDepth)
      p.endShape(p.CLOSE)

      if (DEBUG_SHADOWS) {
        drawControlPoint(a, "yellow")
        drawControlPoint(b, "yellow")
        drawControlPoint(anchor1, "pink")
        drawControlPoint(control1, "blue")
        drawControlPoint(control2, "lightblue")
        drawControlPoint(anchor2, "green")
      }
    }

    function addInvertedBezier(
      a: {x: number, y: number}, 
      b: {x: number, y: number}, 
      min: number,
      max: number,
      mouse: number,
      bottomShadowDepth: number,
      sideShadowDepth: number
    ) {
      p.beginShape()
      p.vertex(a.x, a.y) 
      p.vertex(b.x, b.y) 
      
      // Invert the calculations to make the shadow point downward
      const anchor1Clamp = b.y - bottomShadowDepth;
      const anchor2Clamp = a.y - bottomShadowDepth;
      const anchor1 = {x: b.x, y: Math.min(p.map(mouse, b.x, a.x/2 + frameSideWidth, max, min - bottomShadowDepth), anchor1Clamp)}
      const anchor2 = {x: Math.min(a.x - sideShadowDepth, a.x), y: Math.min(p.map(mouse, b.x + innerWidth/2, a.x, min - bottomShadowDepth, max), anchor2Clamp)}
      const control1 = {x: Math.max(mouse, b.x), y: b.y - bottomShadowDepth}
      const control2 = {x: Math.min(mouse, a.x), y: b.y - bottomShadowDepth}
      p.vertex(anchor1.x, anchor1.y) 
      p.bezierVertex(control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y); 
    
      p.vertex(a.x, a.y - bottomShadowDepth)
      p.endShape(p.CLOSE)
    
      if (DEBUG_SHADOWS) {
        drawControlPoint(a, "yellow")
        drawControlPoint(b, "yellow")
        drawControlPoint(anchor1, "pink")
        drawControlPoint(control1, "blue")
        drawControlPoint(control2, "blue")
        drawControlPoint(anchor2, "green")
      }
    }

    if (lightSourceDirection === "NORTH") {
      let topShadowDepth = _topShadowDepth
      let sideShadowDepth = _rightSideShadowDepth

      addBezier(
        innerCoords.top_right, //upper right
        innerCoords.top_left, //upper left
        frameTopWidth,
        ch - frameTopWidth,
        p.mouseX,
        topShadowDepth,
        sideShadowDepth 
      )
    }
    if (lightSourceDirection === "NORTHEAST"){
      let sideShadowDepth = _rightSideShadowDepth
      let topShadowDepth = _topShadowDepth

      p.beginShape()
      p.vertex(innerCoords.top_right.x, innerCoords.top_right.y) //upper right
      p.vertex(innerCoords.top_left.x, innerCoords.top_left.y)  //upper left
      p.vertex(innerCoords.top_left.x, innerCoords.top_left.y + topShadowDepth) //lower left
      
      let control1 = {x: innerCoords.bottom_right.x - sideShadowDepth, y: innerCoords.top_left.y + topShadowDepth}
      let control2 = {x: innerCoords.bottom_right.x - sideShadowDepth, y: innerCoords.top_left.y + topShadowDepth}
      let anchor2 = {x: innerCoords.bottom_right.x - sideShadowDepth, y: innerCoords.bottom_right.y}
      // drawControlPoint(control1, control2, "green", DEBUG_SHADOWS)
      p.bezierVertex(control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y); // lower right (inner)
      
      p.vertex(innerCoords.bottom_right.x, innerCoords.bottom_right.y) //lower right2 (outer)
      p.endShape(p.CLOSE)
    }
    if (lightSourceDirection === "EAST"){
      let sideShadowDepth = _rightSideShadowDepth

      p.beginShape()
      p.vertex(innerCoords.top_right.x, innerCoords.top_right.y)
      p.vertex(innerCoords.bottom_right.x, innerCoords.bottom_right.y)
      p.vertex(innerCoords.bottom_right.x - sideShadowDepth, innerCoords.bottom_right.y)
      p.vertex(innerCoords.top_right.x - sideShadowDepth, innerCoords.top_right.y)
      p.endShape(p.CLOSE)
    }
    if (lightSourceDirection === "SOUTHEAST"){
      let sideShadowDepth = _rightSideShadowDepth
      let bottomShadowDepth = _bottomShadowDepth
      p.beginShape()
      p.vertex(innerCoords.bottom_right.x, innerCoords.bottom_right.y)
      p.vertex(innerCoords.top_right.x, innerCoords.top_right.y)
      p.vertex(innerCoords.top_right.x - sideShadowDepth, innerCoords.top_right.y)
      
      let control1 = {x: innerCoords.bottom_right.x - sideShadowDepth, y: innerCoords.bottom_right.y - bottomShadowDepth}
      let control2 = {x: innerCoords.bottom_right.x - sideShadowDepth, y: innerCoords.bottom_right.y - bottomShadowDepth}
      let anchor2 = {x: innerCoords.bottom_left.x, y: innerCoords.bottom_left.y - bottomShadowDepth}
      p.bezierVertex(control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y); // lower right (inner)
      
      p.vertex(innerCoords.bottom_left.x, innerCoords.bottom_left.y)
      p.endShape(p.CLOSE)
    }
    if (lightSourceDirection === "SOUTH"){
      let bottomShadowDepth = _bottomShadowDepth
      let sideShadowDepth = _rightSideShadowDepth
      
      addInvertedBezier(
        innerCoords.bottom_right,
        innerCoords.bottom_left,
        ch - frameTopWidth,
        frameTopWidth,
        p.mouseX,
        bottomShadowDepth,
        sideShadowDepth 
      )
    }
    if (lightSourceDirection === "SOUTHWEST"){
      let sideShadowDepth = _leftSideShadowDepth
      let bottomShadowDepth = _bottomShadowDepth
      p.beginShape()
      p.vertex(innerCoords.bottom_left.x, innerCoords.bottom_left.y)
      p.vertex(innerCoords.top_left.x, innerCoords.top_left.y)
      p.vertex(innerCoords.top_left.x + sideShadowDepth, innerCoords.top_left.y)
      
      let control1 = {x: innerCoords.bottom_left.x + sideShadowDepth, y: innerCoords.bottom_left.y - bottomShadowDepth}
      let control2 = {x: innerCoords.bottom_left.x + sideShadowDepth, y: innerCoords.bottom_left.y - bottomShadowDepth}
      let anchor2 = {x: innerCoords.bottom_right.x, y: innerCoords.bottom_right.y - bottomShadowDepth}
      p.bezierVertex(control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y); // lower right (inner)
      
      p.vertex(innerCoords.bottom_right.x, innerCoords.bottom_right.y)
      p.endShape(p.CLOSE)
    }
    if (lightSourceDirection === "WEST"){
      let shadowDepth = _leftSideShadowDepth
      p.beginShape()
      p.vertex(innerCoords.bottom_left.x, innerCoords.bottom_left.y)
      p.vertex(innerCoords.top_left.x, innerCoords.top_left.y)
      p.vertex(innerCoords.top_left.x + shadowDepth, innerCoords.top_left.y)
      p.vertex(innerCoords.bottom_left.x + shadowDepth, innerCoords.bottom_left.y )
      p.endShape(p.CLOSE)
    }
    if (lightSourceDirection === "NORTHWEST"){
      let sideShadowDepth = _leftSideShadowDepth
      let topShadowDepth = _topShadowDepth
      p.beginShape()
      p.vertex(innerCoords.top_left.x, innerCoords.top_left.y)
      p.vertex(innerCoords.top_right.x, innerCoords.top_right.y)
      p.vertex(innerCoords.top_right.x, innerCoords.top_right.y + topShadowDepth)
      
      let control1 = {x: innerCoords.top_left.x + sideShadowDepth, y: innerCoords.top_left.y + topShadowDepth}
      let control2 = {x: innerCoords.top_left.x + sideShadowDepth, y: innerCoords.top_left.y + topShadowDepth}
      let anchor2 = {x: innerCoords.bottom_left.x + sideShadowDepth, y: innerCoords.bottom_left.y}
      p.bezierVertex(control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y); // lower right (inner)
      
      p.vertex(innerCoords.bottom_left.x, innerCoords.bottom_left.y)
      p.endShape(p.CLOSE)
    }
    
    p.pop()

    /** APPLY TEXTURE */
    // applyNoiseTexture(p, fullframeMask)
    // applyTexture(p, textureImg, fullframeMask)
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
      patternFunction(p, 0, patternY, patternWidth, patternHeight, isUpward, color);
      
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

  /**
   * Draws a sloppy rectangle with a wobble effect
   * @param {number} startX The x-coordinate of the top-left corner of the rectangle
   * @param {number} startY The y-coordinate of the top-left corner of the rectangle
   * @param {number} w The width of the rectangle
   * @param {number} h The height of the rectangle
   * @param {boolean} reverse Whether the rectangle is oriented upward (true) or downward (false)
   * @param {p5.Color} shadowColor The color of the shadow rectangle
   */
  function drawSloppyRect (
    p: p5.Graphics | p5,
    startX: number,
    startY: number,
    w: number,
    h: number,
    _reverse: boolean,
    color: p5.Color
  ) {
    p.push();
    p.fill(color);
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

  // function drawFloralPattern(
  //   p: p5.Graphics | p5, 
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
  //       // p.noStroke();
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

  // function drawInnerShadowShapeSmall(shadowDepth: number, shadowColor: p5.Color, shadowWidth: number, __shadowHeight: number, startX: number, startY: number, debug: boolean) {
  //   p.push();
  //   p.translate(startX, startY)
  //   p.fill(shadowColor)
  //   p.noStroke()
  //   p.beginShape();

  //   // BOTTOM RIGHT
  //   if (debug) {
  //     p.push()
  //     p.stroke("red")
  //     p.strokeWeight(10)
  //     p.point(shadowWidth, 150)
  //     p.pop()
  //   }
  //   p.vertex(shadowWidth, 150); // (172, 81.94)
    
  //   // BOTTOM LEFT
  //   let control1 = {x: shadowWidth/1.27 + 112, y: 23.54}
  //   let control2 = {x: (shadowWidth/2.43) + 61.73, y: 0}
  //   let anchor = {x: shadowWidth/2.43, y: 0}

  //   if (debug) {
  //     p.push()
  //     p.strokeWeight(10)
  //     p.stroke("yellow")
  //     p.point(anchor.x, anchor.y)
  //     p.stroke("pink")
  //     p.point(control1.x, control1.y)
  //     p.stroke("orange")
  //     p.point(control2.x, control2.y)
  //     p.pop()
  //   }
  //   p.bezierVertex(control1.x, control1.y, control2.x, control2.y, anchor.x, anchor.y);
    
  //   // TOP LEFT
  //   if (debug) {
  //     p.push()
  //     p.stroke("blue")
  //     p.strokeWeight(10)
  //     p.point(0, 0)
  //     p.pop()
  //   }
  //   // p.vertex(0, 0);
    
  //   // TOP RIGHT
  //   if (debug) {
  //     p.push()
  //     p.stroke("green")
  //     p.strokeWeight(10)
  //     p.point(shadowWidth, 0)
  //     p.pop()
  //   }
  //   p.vertex(shadowWidth, 0);
  //   p.endShape(p.CLOSE);
  //   p.pop()

  // }

  // function drawInnerShadowShapeLarge(shadowDepth: number, shadowColor: p5.Color, shadowWidth: number, shadowHeight: number, startX: number, startY: number, debug: boolean) {
    
  //   p.push();
  //   p.translate(startX, startY)
  //   p.fill(shadowColor)
  //   p.noStroke()
  //   p.beginShape();

  //   // BOTTOM RIGHT
  //   if (debug) {
  //     p.push()
  //     p.stroke("red")
  //     p.strokeWeight(10)
  //     p.point(shadowWidth, innerHeight)
  //     p.point(shadowWidth - shadowDepth, innerHeight)
  //     p.pop()
  //   }
  //   p.vertex(shadowWidth, innerHeight);
  //   p.vertex(shadowWidth - shadowDepth, innerHeight);
    
  //   // BOTTOM LEFT
  //   let control1 = {x: shadowWidth/1.27, y: 23.54}
  //   let control2 = {x: 61.73, y: shadowDepth}
  //   let anchor = {x: 0, y: shadowDepth}
  //   if (debug) {
  //     p.push()
  //     p.strokeWeight(10)
  //     p.stroke("yellow")
  //     p.point(anchor.x, anchor.y)
  //     p.stroke("pink")
  //     p.point(control1.x, control1.y)
  //     p.stroke("orange")
  //     p.point(control2.x, control2.y)
  //     p.pop()
  //   }
  //   p.bezierVertex(control1.x, control1.y, control2.x, control2.y, anchor.x, anchor.y);
    
  //   // TOP LEFT
  //   if (debug) {
  //     p.push()
  //     p.stroke("blue")
  //     p.strokeWeight(10)
  //     p.point(0, 0)
  //     p.pop()
  //   }
  //   p.vertex(0, 0);
    
  //   // TOP RIGHT
  //   if (debug) {
  //     p.push()
  //     p.stroke("green")
  //     p.strokeWeight(10)
  //     p.point(shadowWidth, 0)
  //     p.pop()
  //   }
  //   p.vertex(shadowWidth, 0);
  //   p.endShape(p.CLOSE);
  //   p.pop()

  // }

  
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
  // function fullframeMask () {
  //   leftFrame()
  //   rightFrame()
  //   bottomFrame()
  //   topFrame()
  // }

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

export default mySketch;