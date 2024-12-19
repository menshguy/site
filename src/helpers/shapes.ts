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

export {drawGradientRect}