import p5 from "p5";

const drawGradientRect = (
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

const drawGradientCircle = (
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

export {drawGradientRect, drawGradientCircle}