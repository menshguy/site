import p5 from 'p5';
import {VermontTree} from './treeHelpers.tsx';

type TimeOfDay = "night" | "day";
type Moon = {x: number, y: number, r: number}
type Stars = {numStars: number, minR: number, maxR: number, minX: number, maxX: number, minY: number, maxY: number}

const drawStars = (
  p: p5, 
  numStars: number, 
  minX: number, 
  maxX: number, 
  minY: number, 
  maxY: number,
  minR: number,
  maxR: number,
) => {
  for (let i = 0; i < numStars; i++) {
    let x = p.random(minX, maxX);
    let y = p.random(minY, maxY);
    let r = p.random(minR, maxR);
    p.noStroke();
    p.fill(255, 100, 100); // white for stars
    p.circle(x, y, r)
  }
}

const drawMoon = (p: p5, x: number, y: number, r: number) => {
  p.fill(63, 89, 92); //yellowish white for moon
  p.circle(x, y, r);
}

const drawLake = (
  buffer: p5.Graphics, 
  canvas: p5,
  bottomY: number,
  timeOfDay: TimeOfDay
) => {

  // Create a rectangle for the lake
  buffer.colorMode(buffer.HSL);
  buffer.noStroke()
  buffer.fill(timeOfDay === "night" ? canvas.color(223, 68, 8) : buffer.color(215, 40.7, 64.2))
  buffer.rect(0, bottomY, buffer.width, buffer.height)
  
  // Erase random ovals from the rectangle - the erased sections will expose the reflection underneath
  let eraserBuffer = canvas.createGraphics(canvas.width, buffer.height - bottomY);
  let eraserImage = _generateEraserCircles(eraserBuffer, 5)
  
  // Erase the eraserBuffer circles from buffer
  buffer.blendMode(buffer.REMOVE as any); // For some reason REMOVE gets highlighted as an issue, but it is in the docs: https://p5js.org/reference/p5/blendMode/
  buffer.image(eraserImage, 0, bottomY);
  buffer.blendMode(buffer.BLEND); // Reset to normal blend mode
  
  // Draw the rectangle with erased circles
  canvas.image(buffer, 0, 0);
}

const drawReflection = (
  buffer: p5.Graphics, 
  canvas: p5, 
  trees: VermontTree[],
  bottomY: number,
  timeOfDay: TimeOfDay, 
  moon: Moon, 
  stars: Stars
) => {

  // If its night, draw the moon & stars
  if (timeOfDay === "night"){
    drawMoon(buffer, moon.x, (bottomY) + (bottomY - moon.y), moon.r);
    drawStars(
      buffer, 
      stars.numStars, 
      stars.minX, 
      stars.maxX, 
      (bottomY) + (bottomY - stars.minY), 
      (bottomY) + (bottomY - stars.maxY), 
      stars.minR, 
      stars.maxR);
  }

  // Flip and translate to draw updside down
  buffer.push();
  buffer.colorMode(buffer.HSL);
  buffer.scale(1, -1); // Flip the y-axis to draw upside down
  buffer.translate(0, -(bottomY)*2); // Adjust translation for the buffer
  
  // Draw all of the trees upside down, starting from bottom
  trees.forEach((tree: VermontTree) => {
    tree.leaves.forEach(leaf => {
      // Darken and desaturate the reflection leaves
      let c = leaf.fill_c;
      leaf.fill_c = buffer.color(
        buffer.hue(c), 
        buffer.saturation(c) * 0.6, 
        buffer.lightness(c) * 0.85
      )
      tree.drawLeaf(buffer, leaf)
    });
  });
  
  // Add blur and draw to buffer
  buffer.filter(buffer.BLUR, 3); // Add blur to buffer
  canvas.image(buffer, 0, 0)
  buffer.pop();
}

function _generateEraserCircles(buffer: p5.Graphics, numCirlces: number) {
  for (let i = 0; i <= numCirlces; i++) { // Adjust the number of ovals as needed
    buffer.push();
    let y = buffer.random(0, buffer.height)
    let x = buffer.random(buffer.width/2 - 100, buffer.width/2 + 100)
    let w = buffer.random(1600, 2000); 
    let h = buffer.map(y, 0, buffer.height, 5, 80);

    // Draw ellipse with soft edges
    buffer.colorMode(buffer.HSL);
    buffer.noStroke();
    buffer.fill("white");
    buffer.ellipse(x, y, w, h);
    let blurAmount = buffer.map(y, 0, buffer.height, 0, 3) // Increase blur as y increases
    buffer.filter(buffer.BLUR, blurAmount); // Apply blur to soften edges
    buffer.pop();
  }
  return buffer;
}

export {drawMoon, drawStars, drawLake, drawReflection}
export type {Moon, Stars, TimeOfDay};