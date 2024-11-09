import React from 'react';
import P5Wrapper from '../../components/P5Wrapper';

const mySketch = (p: p5) => {
  let buffers, rowhomes, bottom;
  let cw, ch;
  
  p.setup = () => {
    cw = 600;
    ch = 600;
    p.createCanvas(cw, ch);
  
    p.colorMode(p.HSL);
    bottom = 25;
    rowhomes = [];
    buffers = [];
  
    const h = p.random(ch/3, ch);
    const w = p.random(ch/6, cw);
    const x = (p.width - w) / 2;
    const y = p.height - bottom;
    const fill_c = p.color(23, 100, 54)
    const rowhome = new Rowhome({x, y, w, h, fill_c});
    rowhomes.push(rowhome)
  
    const lh = p.random(ch/3, ch);
    const lw = p.random(ch/6, cw);
    const lx = (x - lw) - 2;
    const ly = p.height - bottom;
    const fill_lc = p.color(23, 100, 94)
    const rowhome_left = new Rowhome({x:lx, y:ly, w:lw, h:lh, fill_c:fill_lc})
    rowhomes.push(rowhome_left)
  
    const rh = p.random(ch/3, ch);
    const rw = p.random(ch/6, cw);
    const rx = (x + w) + 2;
    const ry = p.height - bottom;
    const fill_rc = p.color(23, 100, 94)
    const rowhome_right = new Rowhome({x:rx, y:ry, w:rw, h:rh, fill_c:fill_rc})
    rowhomes.push(rowhome_right)
  
    if (lx > 0) {
      const h = p.random(ch/3, ch);
      const w = p.random(ch/6, cw);
      const x = (lx - w) - 2; 
      const y = p.height - bottom;
      const fill_c = p.color(23, 100, 94)
      const rowhome_left = new Rowhome({x, y, w, h, fill_c})
      rowhomes.push(rowhome_left)
    }
  
    if (rx + rw < p.width) {
      const h = p.random(ch/3, ch);
      const w = p.random(ch/6, cw);
      const x = (rx + w) + 2; 
      const y = p.height - bottom;
      const fill_c = p.color(23, 100, 94)
      const rowhome_right = new Rowhome({x, y, w, h, fill_c})
      rowhomes.push(rowhome_right)
    }
  }
  
  p.draw = () => {
    p.background(183, 52, 88);
    p.noStroke();
    p.noLoop();
    
    buffers.forEach(buffer => { buffer?.clear() })
    rowhomes.forEach(rowhome => rowhome.draw())
    marker_rect(0, p.height-bottom, p.width, bottom, p.color(204, 14, 60))
  }
  
  class Rowhome {
    constructor ({x, y, w, h, fill_c="red", stroke_c="black"}) {
      Object.assign(this, {x, y, w, h, fill_c, stroke_c})
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.fill_c = fill_c;
      this.stroke_c = stroke_c;
      this.configs = [
        {min:0,   max:80,  proportion:p.random([0, p.random(0.05, 0.1)]),    content:['window']},
        {min:100, max:200, proportion:p.random(0.25, 0.35),                content:['window', 'window']},
        {min:100, max:150, proportion:p.random([0, p.random(0.2, 0.25)]),    content:['circle', 'window']},
        {min:0,   max:150, proportion:p.random([0, p.random(0.2, 0.25)]),    content:['circle', 'window']},
        {min:0,   max:150, proportion:p.random([0, p.random(0.2, 0.25)]),    content:['circle', 'window']},
        {min:20,   max:150, proportion:p.random(0.05, 0.25),               content:['circle', 'window']},
      ]
      this.numFloors = this.configs.length;
      this.totalHeight = this.configs.reduce((a, b) => a + b.proportion, 0);
      this.allFloors = this.generateAllFloors();
    }
    
    generateAllFloors() {
      let {x, y, w, h, totalHeight, configs} = this;
      return configs.map((config, i) => {
        let fh = h/totalHeight * config.proportion;
        if (fh > config.max) fh = config.max;
        if (fh < config.min) fh = config.min;
        y -= fh;
        return this.generateFloorSections({x, y, w, h:fh, config})
      })
    }
    
    generateFloorSections({x, y, w, h, config}){
      let {fill_c, numFloors} = this;
      let {content} = config
      let numCols = p.random([2,2,3,3,3,4,4,4,4,5])
      let sectionProportions = getSectionProportions(numCols)
      let sections = getSections(sectionProportions, numCols)
      return sections;
      
      function getSectionProportions(numCols) {
        let sectionProportions = [];
        let remainder = numCols;
        for (let j = 0; j < numCols; j++) {
          let value = j === numCols - 1 ? remainder : p.floor(p.random(0, remainder + 1));
          remainder -= value;
          sectionProportions.push(value);
        }
        return sectionProportions;
      }
      
      function getSections(sectionProportions, numCols) {
        let sx = x;
        return sectionProportions.map(proportion => {
          let sw = (w/numCols) * proportion
          let floorSection = new FloorSection({
            x:sx, y, w:sw, h, content: p.random(content), fill_c
          });
          sx += sw;
          return floorSection;
        })
      }
    }
  
    drawFullHouseForTesting(){
      let {x,y,w,h} = this;
      p.fill("red");
      p.rect(x-5, ch-y-5, w+10, h+10);
      p.noFill();
    }
  
    drawFloors() {
      let {allFloors} = this;
      allFloors.forEach(floor => {
        floor.forEach(floor_section => {
          if(floor_section.w) floor_section.draw();
        })
      });
    }
  
    draw() {
      this.drawFloors();
      if (false) this.drawFullHouseForTesting();
    }
  }
  
  class FloorSection {
    constructor({x, y, w, h, content, fill_c="yellow", stroke_c = "black"}){
      let fill_c_dark = p.color(p.hue(fill_c), p.saturation(fill_c), p.max(0, p.lightness(fill_c) - 10));
      Object.assign(this, {x, y, w, h, content, stroke_c, fill_c, fill_c_dark})
    }
  
    setStyles() {
      let {fill_c, fill_c_dark, stroke_c} = this;
      p.stroke(fill_c_dark)
      p.strokeWeight(1)
      p.fill(fill_c)
    }
  
    unSetStyles() {
      p.noStroke();
      p.noFill()
    }
  
    drawFloorBG() {
      let {x,y,w,h} = this;
      p.rect(x,y,w,h)
    }
  
    drawContent() {
      let {x, y, w, h, fill_c_dark, content, i} = this;
      switch (content) {
        case "door":
          drawDoor(x, y, w, h, fill_c_dark)
          break;
        case "window":
          drawWindow(x, y, w, h, fill_c_dark)
          break;
        case "circle":
          drawWindow(x, y, w, h, fill_c_dark)
          break;
        default:
          console.error("Section content does not exist:", content, i)
          break;
      }
    }
  
    drawTexture() {
      if (this.w <= 0 || this.h <= 0) {
        console.error("Invalid buffer dimensions", this.w, this.h);
        return;
      }
  
      let shadowBuffer = p.createGraphics(this.w, this.h);
      let shadowMaskBuffer = p.createGraphics(this.w, this.h);
      buffers.push(shadowBuffer, shadowMaskBuffer);
  
      drawTextureHatches(0, 0, this.w, this.h, shadowBuffer);
  
      shadowMaskBuffer.fill("black");
      shadowMaskBuffer.rect(0, 0, this.w, this.h);
      shadowMaskBuffer.noFill();
  
      let shadowImage = shadowBuffer.get();
      let shadowMask = shadowMaskBuffer.get();
      
      shadowImage.mask(shadowMask);
      
      p.blendMode(p.BURN);
      p.image(shadowImage, this.x, this.y);
      p.blendMode(p.BLEND);
    }
  
    draw = () => {
      if (this.h !== 0 && this.w !== 0) {
        this.setStyles();
        this.drawFloorBG();
        this.drawContent();
        this.drawTexture();
        this.unSetStyles();
      }
    }
  }
  
  function drawDoor (x, y, w, h, fill_c) {
    let sw = p.random(40, 50);
    let sh = p.random(80, 100);
  
    let centered = x + (w/2) - (sw/2);
    let aligned_left = x + p.random(5, 10);
    let aligned_right = x + w - (sw + p.random(5, 10));
    let sx = p.random([centered, aligned_left, aligned_right]);
    let sy = y + h - sh;
  
    p.fill(fill_c);
    p.noStroke()
    p.rect(sx, sy, sw, sh); 
    p.noFill();
  }
  
  function drawWindow (x, y, w, h, fill_c) {
    let sx = x + 5;
    let sy = y + 5;
    let sw = w - 10;
    let sh = h - 10;
  
    p.fill(fill_c);
    p.rect(sx, sy, sw, sh); 
    p.noFill();
  }
  
  function drawCircle (x, y, w, h, fill_c) {
    let sx = x + 5;
    let sy = y + 5;
    let sw = w - 10;
    let sh = h - 10;
  
    p.fill(fill_c);
    p.rect(sx, sy, sw, sh); 
    p.noFill();
  }
  
  function drawAwning (x, y, w, h, fill_c) {
    p.fill(fill_c)
    p.quad(x, y, x+w, y+10, x-10, y+10, x+w+10, y+10);
    p.noFill()
  }
  
  function marker_rect (x, y, w, h, fill_c = "white", stroke_c = "black") {
    
    p.stroke(stroke_c)
    p.fill(fill_c)
    p.rect(x, y, w, h)
  
    for (let i = 0; i < 3; i++) {
      let xOffset = p.random(-5, 4);
      let yOffset = p.random(-5, 6);
      
      p.line(
        x + p.random(-2, 2), 
        y + p.random(-2, 2), 
        x + w + p.random(-2, 2), 
        y + p.random(-2, 2)
      );
      
      p.line(
        x + w + p.random(-2, 2), 
        y + p.random(-2, 2), 
        x + w + p.random(-2, 2), 
        y + h + p.random(-2, 2)
      );
      
      p.line(
        x + p.random(-2, 2), 
        y + h + p.random(-2, 2), 
        x + w + p.random(-2, 2), 
        y + h + p.random(-2, 2)
      );
      
      p.line(
        x + p.random(-2, 2), 
        y + p.random(-2, 2), 
        x + p.random(-2, 2), 
        y + h + p.random(-2, 2)
      );
    }
  
    p.noStroke()
    p.noFill()
  }
  
  function drawTextureHatches(_x, _y, w, h, buffer) {
    let lineSpacing = 6;
    let length = 20;
    let angle = p.PI / 4;
  
    for (let y = _y; y < h; y += lineSpacing) {
      for (let x = _x; x < w; x += lineSpacing) {
        drawSquigglyLine(x, y, length, angle, buffer);
      }
    }
  }
  
  function drawSquigglyLine(x, y, length, angle, buffer) {
    let segments = p.floor(length / 5);
    let amp = 1;
    buffer.stroke("grey")
    buffer.strokeWeight(0.5);
  
    buffer.beginShape();
    for (let i = 0; i < segments; i++) {
      let offsetX = p.cos(angle) * i * 5 + p.sin(angle) * p.random(-amp, amp);
      let offsetY = p.sin(angle) * i * 5 + p.cos(angle) * p.random(-amp, amp);
  
      let px = x + offsetX;
      let py = y + offsetY;
  
      buffer.vertex(px, py);
    }
    buffer.endShape();
  }
  
  function sumArray(arr) {
    return arr.reduce((a, b) => a + b, 0);
  }
  
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  
  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      p.clear();
      p.setup();
      p.redraw();
    }
  }
};

const Rowhome2: React.FC = () => {
  return (
    <div>
      <h1>Rowhome 2</h1>
      <p>10/31/24</p>
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export default Rowhome2;