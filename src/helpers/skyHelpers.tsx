import p5 from 'p5';

type TimeOfDay = "night" | "day";
type Moon = {x: number, y: number, r: number, fill: p5.Color}
type Stars = {numStars: number, fill: p5.Color, minR: number, maxR: number, minX: number, maxX: number, minY: number, maxY: number}

const drawStars = (p: p5, settings: Stars) => {
  let {numStars, minX, maxX, minY, maxY, minR, maxR, fill} = settings
  for (let i = 0; i < numStars; i++) {
    let x = p.random(minX, maxX);
    let y = p.random(minY, maxY);
    let r = p.random(minR, maxR);
    
    p.push()
    p.noStroke();
    p.fill(fill); // white for stars
    p.circle(x, y, r)
    p.pop()
  }
}

const drawMoon = (p: p5, settings: Moon) => {
  let {x, y, r, fill} = settings
  p.push()
  p.noStroke()
  p.fill(fill); //yellowish white for moon
  p.circle(x, y, r);
  p.pop()
}

const drawLake = (
  p: p5,
  y: number,
  lakeFill: p5.Color
) => {
  let buffer = p.createGraphics(p.width, p.height);
  // Create a rectangle for the lake
  buffer.colorMode(buffer.HSL);
  buffer.noStroke()
  buffer.fill(lakeFill)
  buffer.rect(0, y, buffer.width, buffer.height);
  return buffer;
}

const eraseCirclesFromBuffer = (p: p5, buffer: p5.Graphics, bottomY: number) => {
  // Erase random ovals from the rectangle - the erased sections will expose the reflection underneath
  let eraserBuffer = p.createGraphics(p.width, p.height - bottomY);
  let eraserImage = _generateCircles(eraserBuffer, 5)
  
  // Erase the eraserBuffer circles from buffer
  buffer.blendMode(buffer.REMOVE as any); // For some reason REMOVE gets highlighted as an issue, but it is in the docs: https://p5js.org/reference/p5/blendMode/
  buffer.image(eraserImage, 0, bottomY);
  buffer.blendMode(buffer.BLEND); // Reset to normal blend mode
  return buffer;
}

const drawCirclesToBuffer = (p: p5, buffer: p5.Graphics, y: number, fill: p5.Color) => {
  // Erase random ovals from the rectangle - the erased sections will expose the reflection underneath
  let circlesBuffer = p.createGraphics(p.width, p.height - y);
  let circlesImage = _generateCircles(circlesBuffer, 3, fill)
  
  // Erase the eraserBuffer circles from buffer
  // buffer.blendMode(buffer.REMOVE as any); // For some reason REMOVE gets highlighted as an issue, but it is in the docs: https://p5js.org/reference/p5/blendMode/
  buffer.image(circlesImage, 0, y);
  buffer.blendMode(buffer.BLEND); // Reset to normal blend mode
  return buffer;
}

const drawReflection = (
  p: p5, 
  imageToReflect: p5.Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
) => {
  
  // Draw image to a buffer, flip, and then translate to correct x & y coords
  let reflectionBuffer = p.createGraphics(w, h)
  reflectionBuffer.push();
  reflectionBuffer.colorMode(reflectionBuffer.HSL);
  reflectionBuffer.scale(1, -1); // Flip the y-axis to draw upside down
  reflectionBuffer.translate(x, -(y)*2); // Adjust translation for the buffer
  reflectionBuffer.image(imageToReflect, 0, 0);
  
  // Add blur 
  reflectionBuffer.filter(reflectionBuffer.BLUR, 3); // Add blur to buffer
  reflectionBuffer.pop();

  return reflectionBuffer;
}

function _generateCircles(buffer: p5.Graphics, numCirlces: number, fill?: p5.Color) {
  for (let i = 0; i <= numCirlces; i++) { // Adjust the number of ovals as needed
    buffer.push();
    let y = buffer.random(0, buffer.height)
    let x = buffer.random(buffer.width/2 - 100, buffer.width/2 + 100)
    let w = buffer.random(1600, 2000); 
    let h = buffer.map(y, 0, buffer.height, 5, 80);

    // Draw ellipse with soft edges
    buffer.colorMode(buffer.HSL);
    buffer.noStroke();
    buffer.fill(fill || buffer.color("white"));
    buffer.ellipse(x, y, w, h);
    let blurAmount = buffer.map(y, 0, buffer.height, 0, 3) // Increase blur as y increases
    buffer.filter(buffer.BLUR, blurAmount); // Apply blur to soften edges
    buffer.pop();
  }
  return buffer;
}

export {drawMoon, drawStars, drawLake, drawReflection, eraseCirclesFromBuffer, drawCirclesToBuffer}
export type {Moon, Stars, TimeOfDay};