import p5 from "p5";

/** ---------------- */
/** CIRCLE SHAPES */
/** ---------------- */

const circle_gradient = (
  p: p5.Graphics, 
  x: number, 
  y: number, 
  radius: number, 
  reverse: boolean,
  strokeColor: p5.Color
) => {
  let {hue, sat, lum} = {hue: p.hue(strokeColor), sat: p.saturation(strokeColor), lum: p.lightness(strokeColor)}
  let alphaStart = reverse ? 0 : 1
  let alphaEnd = reverse ? 1 : 0
  for (let r = 0; r < radius; r++) {
    const alpha = p.map(r, 0, radius, alphaStart, alphaEnd); // Map radius to alpha
    p.noFill()
    p.stroke(hue, sat, lum, alpha);
    p.circle(x, y, r);
  }
}




/** ---------------- */
/** RECTANGLE SHAPES */
/** ---------------- */

const rect_gradient = (
  p: p5, 
  x: number,
  y: number,
  w: number,
  h: number,
  reverse: boolean,
  strokeColor: p5.Color
) => {
  p.push();
  p.noFill();
  p.strokeWeight(1);
  let {hue, sat, lum} = {hue: p.hue(strokeColor), sat: p.saturation(strokeColor), lum: p.lightness(strokeColor)}
  if (reverse) {
    for (let i = 0; i < h; i++) {
      let alpha = p.map(i, 0, h, 0, 1); // Map i to alpha from 0 - 1
      p.stroke(p.color(hue, sat, lum, alpha));
      p.line(x, y + i, x + w, y + i);
      // line_broken(p, x, y + i, x + w);
    }
  } else {
    for (let i = h; i > 0; i--) {
      let alpha = p.map(i, h, 0, 0, 1); // Reverse the mapping for alpha
      p.stroke(p.color(hue, sat, lum, alpha));
      p.line(x, y + i, x + w, y + i);
    }
  }
  p.pop();
}

/**
   * Draws a sloppy rectangle with a wobble effect
   * @param {number} p The p5 instance
   * @param {number} startX The x-coordinate of the top-left corner of the rectangle
   * @param {number} startY The y-coordinate of the top-left corner of the rectangle
   * @param {number} w The width of the rectangle
   * @param {number} h The height of the rectangle
   * @param {number} wobble The amount of wobble (default 3)
   * @param {number} segments The number of segments (default 5)
   * @param {object} fill The fill color of the rectangle
   * @param {object} stroke The stroke color and weight of the rectangle
   */
function rect_wobbly (
  p: p5.Graphics | p5,
  startX: number,
  startY: number,
  w: number,
  h: number,
  wobble: number = 3, // Add slight variations to create wobble effect
  segments: number = 5, // Number of segments per side
  fill: {color: p5.Color} = {color: p.color("white")},
  stroke: {color: p5.Color, strokeWeight: number} = {color: p.color("black"), strokeWeight: 0},
) {
  p.push();
  p.fill(fill.color);
  p.stroke(stroke.color);
  p.strokeWeight(stroke.strokeWeight)
  p.beginShape();

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




/** ---------------- */
/**       LINES      */
/** ---------------- */

/**
   * Draws a sloppy rectangle with a wobble effect
   * @param {number} startX The x-coordinate that starts the line
   * @param {number} startY The y-coordinate that starts the line
   * @param {number} endX The x-coordinate that end the line
   * @param {number} endY The y-coordinate that end the line
   * @param {number} strokeWeight The line weight (default 1)
   * @param {p5.Color} color The color of the stroke
   * @param {number} wobble The amount of wobble (default 3)
   * @param {number} segments The number of segments (default 5)
   */
function line_wobbly (
  p: p5.Graphics | p5,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  strokeWeight: number = 1,
  color: p5.Color,
  wobble: number = 3, // Add slight variations to create wobble effect
  segments: number = 5 // Number of segments per side
) {
  p.push();
  p.noFill();
  p.stroke(color);
  p.strokeWeight(strokeWeight);
  p.beginShape();

  // Calculate length
  const length = p.dist(startX, startY, endX, endY);

  // Draw each segment of the wobbly line
  let prevX = startX;
  let prevY = startY;
  p.vertex(prevX, prevY)
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const nextY = startY + length * t;
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

  p.vertex(prevX, prevY)
  p.endShape();
  p.pop();
}

export {
  circle_gradient, 
  rect_gradient, rect_wobbly, // rectangle shapes
  line_wobbly
}