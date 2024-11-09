import React from 'react';
import P5Wrapper from '../../components/P5Wrapper';

const mySketch = (p: p5) => {
  let buffers, rowhomes, bottom;
  let cw = 600;
  let ch = 600;
  
  p.setup = () => {
    p.createCanvas(cw, ch);
    p.colorMode(p.HSL);
  }
  
  p.draw = () => {
    p.background("antiquewhite");
    p.noLoop();
    bottom = p.height - 100;
  
    drawSquigglyLine(50, bottom, p.width - 100, 0);
  
    let numTrees = p.floor(p.random(5, 12))
    let x = 100;
    for (let i = 0; i < numTrees; i++) {
      let w = null // Not using yet
      let h = p.floor(p.random(100,200))
      let y = bottom - h
      marker_line(x, y, w, h)
      x += p.random(10, p.width/numTrees);
    }
  }
  
  // Function to draw a single squiggly line
  function drawSquigglyLine(x, y, length, angle) {
    let segments = p.floor(length / 5); // Number of small segments in the line
    let amp = 0.75;                  // Amplitude of squiggle
    p.noFill();
    // p.stroke(p.color(30, 28, 57))
    p.stroke(0)
    p.strokeWeight(1);                // Thinner lines for finer ink-like detail
  
    p.beginShape();
    for (let i = 0; i < segments; i++) {
      let offsetX = p.cos(angle) * i * 5 + p.sin(angle) * p.random(-amp, amp);
      let offsetY = p.sin(angle) * i * 5 + p.cos(angle) * p.random(-amp, amp);
  
      let px = x + offsetX;
      let py = y + offsetY;
  
      p.vertex(px, py);
    }
    p.endShape();
  }
  
  function marker_line (x, y, w, h, settings={}) {
    let {fill_c, stroke_c, stroke_w} = settings;
    let numLines = 8;
    
    p.stroke(stroke_c || "black")
    p.strokeWeight(stroke_w || 1)
    // p.fill(fill_c || "white")
    // p.rect(x, y, w, h)
    let lean = p.random(["left", "sraight", "right"])
  
    for (let i = 0; i < numLines; i++) {  // Draw multiple lines to make it look rough
      
      let x2;
      switch (lean) {
        case "left":
          x2 = p.random(-12, -6);
          break;
        case "right":
          x2 = p.random(5, 12);
          break;
        case "straight":
          x2 = p.random(-6, 6);
          break;
      }
      
      p.line(
        x + p.random(-2, 2), 
        y + p.random(-2, 2), 
        x + x2, 
        y + h + p.random(-2, 2)
      );
    }
  }
  
  // -- Events -- //
  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      p.redraw();
    }
  }
};

const Tree1: React.FC = () => {
  return (
    <div>
      <h1>Rough</h1>
      <p>10/31/24</p>
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export default Tree1;