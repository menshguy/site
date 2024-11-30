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
  w: number;
  h: number;
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

export { animateDot };