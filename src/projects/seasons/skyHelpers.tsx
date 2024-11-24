import p5 from 'p5';

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

export {drawMoon, drawStars}