import React, { CSSProperties } from 'react';
import P5Wrapper from '../../components/P5Wrapper';
import p5 from 'p5';
import { ScribbleFrameProps } from './types';
import { rect_wobbly } from '../../helpers/shapes';

type Direction = "NORTH" | "NORTHEAST" | "EAST" | "SOUTHEAST" | "SOUTH" | "SOUTHWEST" | "WEST" | "NORTHWEST";

interface Subdivision {
  subdivisionHeight: number, 
  colorType: ColorType
}

type Color = {base: p5.Color[], shadowLight: p5.Color[], shadowDark: p5.Color[], highlight: p5.Color[]}

type ColorType = "base" | "shadowLight" | "shadowDark" | "highlight"

type PatternFunction = (
  p: p5.Graphics | p5,
  x: number,
  y: number,
  w: number,
  h: number,
  wobble?: number,
  segments?: number,
  fill?: {color: p5.Color},
  stroke?: {color: p5.Color, strokeWeight: number},
) => void;

const DEBUG_SHADOWS = false;
const DEBUG_SHADOWS_SMALL = false;

const mySketch = (
  innerWidth: number, 
  innerHeight: number, 
  frameTopWidth: number, 
  frameSideWidth: number
) => (p: p5) => {

  /** CANVAS SETTINGS */
  const padding = 50; // Add padding around the drawing
  let frameWidth = innerWidth + (frameSideWidth * 2)
  let frameHeight = innerHeight + (frameTopWidth * 2)
  let cw = frameWidth + (padding * 2);
  let ch = frameHeight + (padding * 2);
  // let textureImg: p5.Image;
  const innerCoords = {
    top_left: {x: frameSideWidth + padding, y: frameTopWidth + padding},
    top_right: {x: frameSideWidth + innerWidth + padding, y: frameTopWidth + padding},
    bottom_left: {x: frameSideWidth + padding, y: ch - frameTopWidth - padding},
    bottom_right: {x: cw - frameSideWidth - padding, y: ch - frameTopWidth - padding}
  }
  const outerCoords = {
    top_left: {x: padding, y: padding},
    top_right: {x: cw - padding, y: padding},
    bottom_left: {x: padding, y: ch - padding},
    bottom_right: {x: cw - padding, y: ch - padding}
  }
  
  
  /** FRAME SETTINGS */
  let primaryColor: {base: p5.Color[], shadowLight: p5.Color[], shadowDark: p5.Color[], highlight: p5.Color[]}
  let secondaryColor: {base: p5.Color[], shadowLight: p5.Color[], shadowDark: p5.Color[], highlight: p5.Color[]}
  let gold: {base: p5.Color[], shadowLight: p5.Color[], shadowDark: p5.Color[], highlight: p5.Color[]}
  let goldDark: {base: p5.Color[], shadowLight: p5.Color[], shadowDark: p5.Color[], highlight: p5.Color[]}
  let subdivisions: Subdivision[]
  let sideSubdivisions: Subdivision[]
  let topSubdivisions: Subdivision[]
  let shadowWidth : number
  let shadowHeight : number
  let shadowDepth : number
  let shadowColor : p5.Color
  let lightSourceCoords: {x: number, y: number}
  
  p.preload = () => {
    // textureImg = p.loadImage('/textures/watercolor_1.jpg');
  }

  p.setup = () => {
    p.createCanvas(cw, ch)
    p.colorMode(p.HSL)

    /** COLOR PALETTE(s) */
    gold = {
      base: [p.color(34, 82.3, 73.6)],
      shadowLight: [p.color(34, 82.3, 67.6)],
      shadowDark: [p.color(34, 48.7, 44)],
      highlight: [p.color(34, 82.3, 78.6)],
      // highlight: [p.color(34, 95.3, 87.6)],
    }
    
    goldDark = {
      base: [p.color(34, 60.3, 55.6)],
      shadowLight: [p.color(34, 60.3, 50.6)],
      shadowDark: [p.color(34, 42.7, 36)],
      highlight: [p.color(34, 82.3, 78.6)],
      // highlight: [p.color(34, 95.3, 87.6)],
    }
    
    // goldDark = {
    //   base: [p.color(31, 62.9, 67.3)],
    //   shadowLight: [p.color(28, 42.7, 44)],
    //   shadowDark: [p.color(28, 42.7, 44)],
    //   highlight: [p.color(60, 66.7, 96.5)],
    // }

    /** FRAME COLORS */
    primaryColor = gold // Add more colors later
    secondaryColor = goldDark // Add more colors later
    
    /** CREATE SUBDIVISIONS FOR EACH FRAME SHAPE/SIDE */
    subdivisions = generateSubdivisions(p.random(1, 3)) // Divide frame into subdivisions
    sideSubdivisions = normalizeSubdivisions(subdivisions, frameSideWidth) // Normalize subdivisions to fit side widths
    topSubdivisions = normalizeSubdivisions(subdivisions, frameTopWidth) // Normalize subdivisions  to fit top & bottom widths
  }
  
  p.draw = () => {
    p.noLoop()
    p.clear()
    
    // Draw Subtle border around canvas
    p.push()
    p.stroke("lightgray")
    p.strokeWeight(1)
    p.noFill()
    p.rect(0, 0, cw, ch)
    p.pop()

    /** DRAW SHADOWS */
    let lightSourceCoords = {x: outerCoords.top_right.x, y: outerCoords.top_right.y}
    shadowWidth = innerWidth;
    shadowHeight = innerCoords.top_left.y - lightSourceCoords.y;
    shadowDepth = p.random(1, 100);
    // shadowColor = p.color(3, 56, 17, 0.15)
    shadowColor = p.color(3, 16, 47, 0.60)

    // Draw Shadow shape first so that remaining layers are drawn on top
    p.push()
    p.noStroke()
    // drawInnerShadowShapeSmall(shadowDepth, shadowColor, shadowWidth, shadowHeight, innerCoords.top_left.x, innerCoords.top_left.y, false)
    drawInnerShadowShapeLarge(shadowDepth + 10, shadowColor, shadowWidth, shadowHeight, innerCoords.top_left.x, innerCoords.top_left.y, false)
    drawOuterShadowShape(
      shadowDepth + 10, 
      shadowColor, 
      {x: outerCoords.top_left.x, y: outerCoords.top_left.y + shadowDepth}, 
      outerCoords.bottom_left, 
      {x: outerCoords.bottom_right.x - shadowDepth, y: outerCoords.bottom_right.y}, 
      false
    )
    p.pop()


    /** DRAW GRADIENTS IN EACH FRAME SHAPE */
    drawSubdivision(rect_wobbly, "top", true)
    drawSubdivision(rect_wobbly, "right", true)
    drawSubdivision(rect_wobbly, "bottom", false)
    drawSubdivision(rect_wobbly, "left", false)
    
    /** DRAW CIRCLES */
    drawFlourishes("top", false)
    drawFlourishes("top_right", false)
    // drawFlourishes("right", false)
    drawFlourishes("bottom_right", false)
    // drawFlourishes("bottom", false)
    drawFlourishes("bottom_left", false)
    // drawFlourishes("left", false) 
    drawFlourishes("top_left", false)
    
    // p.push();
    // p.clip(fullframeMask);
    // p.blendMode(p.OVERLAY);
    // p.image(textureImg, 0, 0 )
    // p.pop()
  }

  /**
   * Draws patterns on a specific side of the frame
   * @param patternFunction - The function that draws the actual pattern
   * @param side - Which side of the frame ("top", "right", "bottom", "left")
   * @param isInShadow - Boolean used to determine which side of the frame we are drawing
   */
  function drawSubdivision(
    patternFunction: PatternFunction,
    side: 'top' | 'right' | 'bottom' | 'left',
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
    
    subdivisions.forEach(({ subdivisionHeight, colorType }) => {
      const color = isInShadow ? secondaryColor[colorType][0] : primaryColor[colorType][0];

      // Apply the pattern function
      let wobble = 3;
      let segments = 5;
      patternFunction(p, 0, currentY, subDivisionWidth, subdivisionHeight, wobble, segments, {color} );
      
      // Move to next subdivision
      currentY += subdivisionHeight;
    });
    
    p.pop();
  }

  function generateSubdivisions(numSubdivisions: number) {
    let subdivisions: Subdivision[] = [];

    // Generate random length and depth values for each subdivision.
    for (let i = 0; i < numSubdivisions; i++) {
      let subdivisionHeight = p.random(2, 10);
      let colorType = p.random(["shadowLight", "base"]) as ColorType;
      subdivisions.push({subdivisionHeight, colorType});
    }

    // Add outer and inner subdivisions to represent the inside and outside borders of the frame
    let outerSubdivisionHeight = p.random(5, 10);
    let innerSubdivisionHeight = p.random(1, 5);
    subdivisions.unshift({
      subdivisionHeight: outerSubdivisionHeight,
      colorType: "highlight",
    });
    subdivisions.push({
      subdivisionHeight: innerSubdivisionHeight, 
      colorType: "shadowDark",
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
  
  /**
   * Draws the corner and center segement flourishes that are common in picture frames
   * @param side - Which side of the frame ("top", "right", "bottom", "left")
   * @param isInShadow - Boolean used to determine which side of the frame we are drawing
   */
  function drawFlourishes (
    side: 'top' | 'top_right' | 'right' | 'bottom_right' | 'bottom' | 'bottom_left' | 'left' | 'top_left',
    isInShadow: boolean,
  ) {

    // Set startX and startY based on side as well
    let sw = frameSideWidth/2
    let w = frameWidth/2
    let tw = frameTopWidth/6
    let h = frameHeight/2
    const startingRotations = {
      top: 0,
      top_right: 45,
      right: 90,
      bottom_right: 135,
      bottom: 180,
      bottom_left: 225,
      left: 270,
      top_left: 315
    }
    const startingCoordinates = {
      top: {x: cw/2, y: outerCoords.top_left.y + tw},
      top_right: {x: outerCoords.top_right.x - sw, y: outerCoords.top_right.y + tw},
      right: {x: outerCoords.top_right.x - sw, y: outerCoords.top_right.y + h},
      bottom_right: {x: outerCoords.bottom_right.x - sw, y: outerCoords.bottom_right.y - tw},
      bottom: {x: outerCoords.bottom_right.x - w, y: outerCoords.bottom_right.y - tw},
      bottom_left: {x: outerCoords.bottom_left.x + sw, y: outerCoords.bottom_left.y - tw},
      left: {x: outerCoords.bottom_left.x + sw, y: outerCoords.bottom_left.y - h},
      top_left: {x: outerCoords.top_left.x + sw, y: outerCoords.top_left.y + tw}
    }

    // Set the translation settings
    const startX = startingCoordinates[side].x
    const startY = startingCoordinates[side].y
    const startingRotation = startingRotations[side]

    if (false) {
      //debug
      Object.keys(startingCoordinates).forEach(key => {
        // Type assertion to tell TypeScript that key is a valid key of startingCoordinates
        const typedKey = key as keyof typeof startingCoordinates;
        drawPoint(startingCoordinates[typedKey], "red");
      });
    }

    // Set Color
    const color = isInShadow ? secondaryColor : primaryColor;

    // Translate to starting position & rotate
    p.translate(startX, startY);
    p.rotate(startingRotation * p.PI / 180);

    const shapeWidth = 300
    const shapeHeight = 100
    const shadowDepth = 10
    const wobble = 2
    const segments = 2
    rect_wobbly(p, 0 - (shapeWidth/2) - shadowDepth, 0 - (shapeHeight/2) + shadowDepth, shapeWidth, shapeHeight, wobble, segments, {color: color.shadowDark[0]})
    rect_wobbly(p, 0 - (shapeWidth/2), 0 - (shapeHeight/2), shapeWidth, shapeHeight, wobble, segments, {color: color.highlight[0]})
    
    const sphereWidth = 150
    p.circle(startX , startY , sphereWidth/2)
  }

  // function _drawFlourishes_Old_UsingBeziers (
  //   side: 'top' | 'top_right' | 'right' | 'bottom_right' | 'bottom' | 'bottom_left' | 'left' | 'top_left',
  //   isInShadow: boolean,
  // ) {

  //   // Set startX and startY based on side as well
  //   let sw = frameSideWidth/2
  //   let w = frameWidth/2
  //   let tw = frameTopWidth/6
  //   let h = frameHeight/2
  //   const startingRotations = {
  //     top: 0,
  //     top_right: 45,
  //     right: 90,
  //     bottom_right: 135,
  //     bottom: 180,
  //     bottom_left: 225,
  //     left: 270,
  //     top_left: 315
  //   }
  //   const startingCoordinates = {
  //     top: {x: cw/2, y: outerCoords.top_left.y + tw},
  //     top_right: {x: outerCoords.top_right.x - sw, y: outerCoords.top_right.y + tw},
  //     right: {x: outerCoords.top_right.x - sw, y: outerCoords.top_right.y + h},
  //     bottom_right: {x: outerCoords.bottom_right.x - sw, y: outerCoords.bottom_right.y - tw},
  //     bottom: {x: outerCoords.bottom_right.x - w, y: outerCoords.bottom_right.y - tw},
  //     bottom_left: {x: outerCoords.bottom_left.x + sw, y: outerCoords.bottom_left.y - tw},
  //     left: {x: outerCoords.bottom_left.x + sw, y: outerCoords.bottom_left.y - h},
  //     top_left: {x: outerCoords.top_left.x + sw, y: outerCoords.top_left.y + tw}
  //   }

  //   // Set the translation settings
  //   const startX = startingCoordinates[side].x
  //   const startY = startingCoordinates[side].y
  //   const startingRotation = startingRotations[side]

  //   if (false) {
  //     //debug
  //     Object.keys(startingCoordinates).forEach(key => {
  //       // Type assertion to tell TypeScript that key is a valid key of startingCoordinates
  //       const typedKey = key as keyof typeof startingCoordinates;
  //       drawPoint(startingCoordinates[typedKey], "red");
  //     });
  //   }

  //   // Set Color
  //   const color = isInShadow ? secondaryColor : primaryColor;

  //   let debug = true

  //   // TODO: make these arguments
  //   let shapeWidth = 300
  //   let shapeHeight = 200
  //   let shapeInnerWidth = 100
  //   let shapeInnerHeight = 150
    
  //   p.push();

  //   // Translate to starting position & rotate
  //   p.translate(startX, startY);
  //   p.rotate(startingRotation * p.PI / 180);

  //   p.fill(color.highlight[0]);
  //   p.noStroke();

  //   p.beginShape()

  //   let pointa = {x: 0, y: 0}
  //   p.vertex(pointa.x, pointa.y); // (172, 81.94)
  //   if (debug) {
  //     p.push()
  //     // p.stroke("yellow")
  //     // p.strokeWeight(10)
  //     p.point(pointa.x, pointa.y)
  //     p.pop()
  //   }
    
  //   let controlb1 = {x: 50, y: -10}
  //   let controlb2 = {x: 40, y: 0}
  //   let pointb = {x: 50, y: 0}
  //   p.bezierVertex(controlb1.x, controlb1.y, controlb2.x, controlb2.y, pointb.x, pointb.y);
  //   if (debug) {
  //     p.push()
  //     // p.stroke("red")
  //     p.strokeWeight(10)
  //     p.point(pointb.x, pointb.y)
  //     p.stroke("darkred")
  //     p.point(controlb1.x, controlb1.y)
  //     p.point(controlb2.x, controlb2.y)
  //     p.pop()
  //   }
    
  //   let controlc1 = {x: 50, y: -20}
  //   let controlc2 = {x: 60, y: -30}
  //   let pointc = {x: 50, y: -30}
  //   p.bezierVertex(controlc1.x, controlc1.y, controlc2.x, controlc2.y, pointc.x, pointc.y);
  //   if (debug) {
  //     p.push()
  //     // p.stroke("green")
  //     p.strokeWeight(10)
  //     p.point(pointc.x, pointc.y)
  //     p.stroke("darkgreen")
  //     p.point(controlc1.x, controlc1.y)
  //     p.point(controlc2.x, controlc2.y)
  //     p.pop()
  //   }
    
  //   let controld1 = {x: 90, y: -30}
  //   let controld2 = {x: 100, y: -20}
  //   let pointd = {x: 100, y: -30}
  //   p.bezierVertex(controld1.x, controld1.y, controld2.x, controld2.y, pointd.x, pointd.y);
  //   if (debug) {
  //     p.push()
  //     // p.stroke("red")
  //     p.strokeWeight(10)
  //     p.point(pointd.x, pointd.y)
  //     p.stroke("pink")
  //     p.point(controld1.x, controld1.y)
  //     p.stroke("orange")
  //     p.point(controld2.x, controld2.y)
  //     p.pop()
  //   }
    
  //   let controle1 = {x: 100, y: -10}
  //   let controle2 = {x: 110, y: 0}
  //   let pointe = {x: 100, y: 0}
  //   p.bezierVertex(controle1.x, controle1.y, controle2.x, controle2.y, pointe.x, pointe.y);
  //   if (debug) {
  //     p.push()
  //     // p.stroke("green")
  //     p.strokeWeight(10)
  //     p.point(pointe.x, pointe.y)
  //     p.stroke("yellow")
  //     p.point(controle1.x, controle1.y)
  //     p.stroke("orange")
  //     p.point(controle2.x, controle2.y)
  //     p.pop()
  //   }
    
  //   let pointf = {x: 150, y: 0}
  //   p.vertex(pointf.x, pointf.y);
  //   if (debug) {
  //     p.push()
  //     // p.stroke("blue")
  //     // p.strokeWeight(10)
  //     p.point(pointf.x, pointf.y)
  //     p.pop()
  //   }
    
  //   let pointg = {x: 150, y: 30}
  //   p.vertex(pointg.x, pointg.y);
  //   if (debug) {
  //     p.push()
  //     // p.stroke("blue")
  //     // p.strokeWeight(10)
  //     p.point(pointg.x, pointg.y)
  //     p.pop()
  //   }
    
  //   let pointh = {x: 0, y: 30}
  //   p.vertex(pointh.x, pointh.y);
  //   if (debug) {
  //     p.push()
  //     // p.stroke("blue")
  //     // p.strokeWeight(10)
  //     p.point(pointh.x, pointh.y)
  //     p.pop()
  //   }
    
  //   p.endShape(p.CLOSE)
  //   p.pop();
  // }
  
  function drawInnerShadowShapeSmall(shadowDepth: number, shadowColor: p5.Color, shadowWidth: number, _shadowHeight: number, startX: number, startY: number, debug: boolean) {
    p.push();
    p.translate(startX, startY)
    p.fill(shadowColor)
    p.noStroke()
    p.beginShape();

    // BOTTOM RIGHT, LEFT
    let anchor1 = {x: shadowWidth, y: 150}
    let anchor2 = {x: shadowWidth/2.43, y: 0}
    let control1 = {x: shadowWidth/1.27 + 112, y: 23.54}
    let control2 = {x: shadowWidth - 80 , y: 0}
    p.vertex(anchor1.x, anchor1.y); // (172, 81.94)
    p.bezierVertex(control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y);

    if (DEBUG_SHADOWS_SMALL) {
      p.push()
      p.strokeWeight(10)
      p.stroke("green")
      p.point(anchor1.x, anchor1.y)
      p.stroke("yellow")
      p.point(anchor2.x, anchor2.y)
      p.stroke("pink")
      p.point(control1.x, control1.y)
      p.stroke("orange")
      p.point(control2.x, control2.y)
      p.pop()
    }
    
    // TOP RIGHT
    p.vertex(shadowWidth, 0);
    p.endShape(p.CLOSE);
    p.pop()

  }

  

  function drawInnerShadowShapeLarge(shadowDepth: number, shadowColor: p5.Color, shadowWidth: number, shadowHeight: number, startX: number, startY: number, debug: boolean) {
    
    p.push()
    p.clip(() => {
      topFrame()
      rightFrame()
    })
    p.fill("lightgray")
    p.rect(0, 0, cw, ch)
    p.pop()
    
    p.push();
    p.translate(startX, startY)
    p.fill(shadowColor)
    p.noStroke()
    p.beginShape();

    // BOTTOM RIGHT
    if (DEBUG_SHADOWS) {
      p.push()
      p.stroke("red")
      p.strokeWeight(10)
      p.point(shadowWidth, innerHeight)
      p.point(shadowWidth - shadowDepth, innerHeight)
      p.pop()
    }
    p.vertex(shadowWidth, innerHeight);
    
    // BOTTOM LEFT
    let anchor1 = {x: shadowWidth - shadowDepth, y: innerHeight}
    let anchor2 = {x: 0, y: shadowDepth}
    let control1 = {x: anchor1.x + (innerCoords.top_right.x - anchor1.x)/3, y: 23.54}
    let control2 = {x: anchor1.x, y: shadowDepth/2}
    p.vertex(anchor1.x, anchor1.y);
    p.bezierVertex(control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y);
    if (DEBUG_SHADOWS) {
      p.push()
      p.strokeWeight(20)
      p.stroke("yellow")
      p.point(anchor1.x, anchor1.y)
      p.stroke("green")
      p.point(anchor2.x, anchor2.y)
      p.stroke("pink")
      p.point(control1.x, control1.y)
      p.stroke("orange")
      p.point(control2.x, control2.y)
      p.pop()
    }
    
    // TOP LEFT
    if (DEBUG_SHADOWS) {
      p.push()
      p.stroke("blue")
      p.strokeWeight(10)
      p.point(0, 0)
      p.pop()
    }
    p.vertex(0, 0);
    
    // TOP RIGHT
    if (DEBUG_SHADOWS) {
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
 
  function drawOuterShadowShape(shadowDepth: number, shadowColor: p5.Color, pointA: {x:number, y:number}, pointB: {x:number, y:number}, pointC: {x:number, y:number}, debug: boolean) {
    // (shadowDepth + 10, shadowColor, shadowWidth, shadowHeight, outerCoords.top_left.x, outerCoords.bottom_left, outerCoords.bottom_right, false)
    p.push();
    p.fill(shadowColor)
    p.noStroke()
    p.beginShape()
    p.vertex(pointA.x, pointA.y);
    p.vertex(pointB.x, pointB.y);
    p.vertex(pointC.x, pointC.y);
    p.vertex(pointC.x - shadowDepth, pointC.y + shadowDepth);
    p.vertex(pointB.x - shadowDepth, pointB.y + shadowDepth);
    p.vertex(pointA.x - shadowDepth, pointA.y + shadowDepth);
    p.endShape(p.CLOSE)
    p.pop();
  }

  /** FRAME SHAPES */
  function topFrame() {
    p.beginShape();
    p.vertex(padding, padding);
    p.vertex(cw - padding, padding);
    p.vertex(cw - padding - frameSideWidth, frameTopWidth + padding);
    p.vertex(frameSideWidth + padding, frameTopWidth + padding);
    p.endShape(p.CLOSE);
  }
  function leftFrame() {
    p.beginShape();
    p.vertex(padding, padding);
    p.vertex(padding, ch - padding);
    p.vertex(frameSideWidth + padding, ch - frameTopWidth - padding);
    p.vertex(frameSideWidth + padding, frameTopWidth + padding);
    p.endShape(p.CLOSE);
  }
  function rightFrame() {
    p.beginShape();
    p.vertex(cw - padding, padding); // top right
    p.vertex(cw - padding, ch - padding); // bottom right 
    p.vertex(cw - frameSideWidth - padding, ch - frameTopWidth - padding); // bottom left
    p.vertex(cw - frameSideWidth - padding, frameTopWidth + padding); // top left
    p.endShape(p.CLOSE);
  }
  function bottomFrame() {
    p.beginShape();
    p.vertex(padding, ch - padding);
    p.vertex(cw - padding, ch - padding);
    p.vertex(cw - frameSideWidth - padding, ch - frameTopWidth - padding);
    p.vertex(frameSideWidth + padding, ch - frameTopWidth - padding);
    p.endShape(p.CLOSE);
  }
  function fullframeMask () {
    leftFrame()
    rightFrame()
    bottomFrame()
    topFrame()
  }

  function drawPoint(point1: {x: number, y: number}, color: string) {
    p.push()
    p.strokeWeight(10)
    p.stroke(color)
    p.point(point1.x, point1.y)
    p.pop()
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
  const padding = 50; // Add padding around the drawing
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
    top: `${_frameTopWidth + padding}px`,
    left: `${_frameSideWidth + padding}px`,
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
    top: `${totalHeight - (_frameTopWidth) + padding}px`,
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
          disableClickToClear
          disableClickToRedraw
          includeSaveButton={false} 
          sketch={_outerSketch} 
        />
      </div>
    </div>
  );
};

export {mySketch};
export default ScribbleFrame2;