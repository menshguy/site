import p5 from 'p5';

const redraw = (p:p5, cw: number, ch: number) => {
  // @TODO - figure out why I can't pass p.width/p.height, and have ot pass cw,ch
  return () => {
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      // p.clear();
      p.setup();
      p.draw();
    }
  }
}

export {redraw}