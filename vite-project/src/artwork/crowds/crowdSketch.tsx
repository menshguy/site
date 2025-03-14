import p5 from "p5";
/** I was using this for leaves in the wind,
 * but it looks a lot like the bobbing crowd motion I wanted,
 * So I am storing it here for now.
 */

type Dot = {
  movementFactor: number;
  movementDirection: number;
  x: number;
  y: number;
  size: number;
  angle: number;
  fill_c: p5.Color;
}

function animateDot(p: p5, dot: Dot) {

  /** REFERENCE - this is what leaves looked like. shape dots similarly */
  // let {movementFactor, movementDirection, x, y, w, h, angle, fill_c} = dot;

  /** 
   * Set movement factor - will affect the speed of movement in animation (0.1 is slow, 1 is fast)
      let movementFactor: number = p.random(0.1, 0.25);
      let movementDirection: number = p.random(0, p.PI); 
  */
  let time = p.frameCount * 0.25;
  let randomFactorX = p.random(-0.8, 0.8); // Random factor for x direction
  let randomFactorY = p.random(-0.8, 0.8); // Random factor for y direction

  // Calculate directional movement
  let directionX = Math.cos(dot.movementDirection);
  let directionY = Math.sin(dot.movementDirection);

  // Update dot position with direction
  dot.y = dot.y + (Math.cos(time) / (dot.movementFactor * 2)) * directionY + randomFactorY;
  dot.x = dot.x + (Math.sin(time) * dot.movementFactor) * directionX + randomFactorX;

  return dot;
}


const crowdSketch = (p: p5) => {

  let dots: Dot[];
  let isAnimating = false;
  
  p.setup = () => {
    p.createCanvas(500, 500)
    p.colorMode(p.HSL);

    const size = 20;
    const gap = 15;
    const rows = p.floor(p.width / gap);
    const columns = p.floor(p.height / gap);
    dots = createDots(rows, columns, size, gap);

    // Add these lines
    const button = p.createButton('Toggle Animation');
    button.position(10, 510);
    button.mousePressed(() => {
      isAnimating = !isAnimating;
    });
  }

  p.draw = () => {
    p.clear();
    p.background("antiqueWhite")
  
    p.push()
    dots.forEach(dot => {
      if (isAnimating) {  // Add this condition
        dot = animateDot(p, dot);
      }
      p.strokeWeight(20)
      p.stroke(dot.fill_c)
      p.point(dot.x, dot.y)
    })
    p.pop()
  }

  function createDots(rows: number, columns: number, size: number, gap: number) {
    const dots: Dot[] = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const x = j * gap;
        const y = i * gap;
        const dot = new Dot(x, y, size);
        dots.push(dot);
      }
    }
    return dots;
  }
  
  class Dot {
    movementFactor: number;
    movementDirection: number;
    x: number;
    y: number;
    size: number;
    angle: number;
    fill_c: p5.Color;
  
    constructor(x: number, y: number, size: number) {
      this.movementFactor = p.random(0.1, 0.25);
      this.movementDirection = p.random(0, p.PI);
      this.x = x;
      this.y = y;
      this.size = size;
      this.angle = 0;
      this.fill_c = p.random([
        p.color(180, 75, 85),  // Pastel mint
        p.color(320, 70, 85),  // Pastel pink
        p.color(45, 75, 85),   // Pastel yellow
        p.color(280, 65, 85),  // Pastel lavender
        p.color(140, 70, 85)   // Pastel seafoam
      ]);
    }
  }
  
  
};

export default crowdSketch;