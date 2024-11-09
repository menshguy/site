import React from 'react';
import P5Wrapper from '../../components/P5Wrapper';

const mySketch = (p: p5) => {
  let rowhomes = []
  let bottom;
  let buffers = [] 
  let cw, ch;
  
  function setup() {
    cw = 600;
    ch = 600;
    p.createCanvas(cw, ch);
    
    //General Settings
    p.colorMode(p.HSL);
    bottom = 25;
  
    //Draw Main Rowhome
    const h = p.random(ch/3, ch);
    const w = p.random(ch/6, cw);
    const x = (p.width - w) / 2;
    const y = p.height - bottom;
    let fill_c = p.color(23, 100, 54)
    const rowhome = new Rowhome(x, y, w, h, fill_c);
    rowhomes.push(rowhome)
    // rowhome.draw();
  
    //Draw a rowhome to the left
    const lh = p.random(ch/3, ch);
    const lw = p.random(ch/6, cw);
    const lx = (x - lw) - 2; //start at the main rowhom x and move over to the left by this rowhomes w
    const ly = p.height - bottom;
    let fill_lc = p.color(23, 100, 94)
    const rowhome_left = new Rowhome(lx, ly, lw, lh, fill_lc)
    // rowhome_left.draw();
    rowhomes.push(rowhome_left)
  
    //Draw a rowhome to the right
    const rh = p.random(ch/3, ch);
    const rw = p.random(ch/6, cw);
    const rx = (x + w) + 2; //start at the main rowhom x and move over to the right by main row home w
    const ry = p.height - bottom;
    let fill_rc = p.color(23, 100, 94)
    const rowhome_right = new Rowhome(rx, ry, rw, rh, fill_rc)
    // rowhome_right.draw();
    rowhomes.push(rowhome_right)
  
    //If there is still space to the left, draw yet another home (TODO: Make more dynamic)
    if (lx > 0) {
      const l2h = p.random(ch/3, ch);
      const l2w = p.random(ch/6, cw);
      const l2x = (lx - l2w) - 2; 
      const l2y = p.height - bottom;
      let fill_l2c = p.color(23, 100, 94)
      const rowhome_left = new Rowhome(l2x, l2y, l2w, l2h, fill_l2c)
      // rowhome_left.draw();
      rowhomes.push(rowhome_left)
    }
  
    //If there is still space to the right, draw yet another home (TODO: Make more dynamic)
    if (rx + rw < p.width) {
      const r2h = p.random(ch/3, ch);
      const r2w = p.random(ch/6, cw);
      const r2x = (rx + rw) + 2; 
      const r2y = p.height - bottom;
      let fill_r2c = p.color(23, 100, 94)
      const rowhome_right = new Rowhome(r2x, r2y, r2w, r2h, fill_r2c)
      // rowhome_right.draw();
      rowhomes.push(rowhome_right)
    }
  }
  
  p.draw = () => {
    // p.background("antiquewhite");
    p.background(183, 52, 88);
    p.noStroke();
    p.noLoop();
  
    // Clear the graphics buffers
    buffers.forEach(buffer => { buffer?.clear() })
  
    // Draw rowhomes
    rowhomes.forEach(rowhome => rowhome?.draw())
  
    //Draw Sidewalk
    marker_rect(0, p.height-bottom, p.width, bottom, p.color(204, 14, 60))
  }
  
  class Rowhome {
    constructor (x, y, w, h, fill_c="orange", stroke_c="black") {
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
      this.floors = this.generateFloors();
      this.numFloors = this.configs.length
      
      // -- TESTS/LOGS -- //
      console.log("floors", this.floors)
      // console.log("~~~TESTS~~~")
      // let s = this.floors.reduce((a, b) => a + b.h, 0);
      // console.log(p.floor(this.h) === p.floor(s) ? "PASSED" : "FAILED", ": Height equals sum of floors", this.h, s)
    }
    
    // Returns [Floor, Floor, Floor, ...]
    generateFloors() {
      let {x, y, w, h, configs} = this
      let psum = configs.reduce((a, b) => a + b.proportion, 0); //sum of all proportions
      const floors = configs.map((config, i) => {
        //TODO: Fix this so that the total height is never exceeded
        let floor_h = h/psum * config.proportion //find each floors height based on asigned proportion
        if (floor_h > config.max) floor_h = config.max;
        if (floor_h < config.min) floor_h = config.min;
        y -= floor_h; // move y up so that floor can be drawn from correct x,y coord
        let cols = this.generateCols(x, y, w, floor_h, configs.length, config.content)
        let floor = new Floor(x, y, w, floor_h, cols, i)
        return floor
      })
    
      return floors;
    }
    
    // Returns [Section, Section, Section, etc]
    // Generates an array of Columns, with x,y,w,h & content data needed to draw each section
    generateCols(x, y, w, h, numFloors, content){
      let {fill_c} = this;
      let numCols = p.random([2,2,3,3,3,4,4,4,4,5])
      let colProportions = this.generateColProportions(numFloors, numCols)
      let col_x = x;
      return colProportions.map((col_p, i) => {
        let col_w = w/numCols * col_p[i]
        let col = new Section(col_x, y, col_w, h, p.random(content), fill_c);
        col_x += col_w;
        return col;
      })
    }
  
    // Returns: [[0,0,1,3], [2,1,0,1], [1,1,1,1]]
    // each nested array represents a floor, and each number represents the proportion of the floor taken up by that section/col
    generateColProportions(numFloors, numCols) {
      let remainder = numCols;
      let arr = new Array(numCols).fill(0); //create array with length equal to number of columns
      let r = arr.map(p => { //fill array with random proportion values
        let value = p.floor(p.random(0, remainder + 1))
        remainder -= value;
        return value;
      })
      if (remainder > 0) r[r.length - 1] += remainder //assign any remaining value to last index
      if (p.random([0,1])) shuffleArray(r); //randomly shuffle order
      return new Array(numFloors).fill(r) //return array of arrays 
    }
  
    drawFullHouseForTesting(bool){
      // If things are working correctly, should see a 5px red border
      if(bool){
        p.fill("red");
        p.rect(this.x-5, p.height - this.h-5, this.w+10, this.h+10);
        p.noFill();
      }
    }
  
    draw() {
      this.drawFullHouseForTesting(false)
      this.floors.forEach(floor => floor.draw());
    }
  }
  
  class Floor {
    constructor (x, y, w, h, cols, i) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.cols = cols;
      this.i = i;
      this.fills = [p.color(23, 100, 94), p.color(163, 100, 84), p.color(324, 100, 94), p.color(14, 100, 87), p.color(84, 100, 87), p.color(204, 100, 87), p.color(294, 100, 87)];
    }
  
    setStyles() {
      p.stroke("black");
      p.fill(this.fills[this.i])
    }
  
    unSetStyles() {
      p.noStroke();
      p.noFill();
    }
  
    draw() {
      this.setStyles()
      marker_rect(this.x, this.y, this.w, this.h, p.color(40, 59, 79), this.fills[this.i])
      this.unSetStyles()
        
      this.cols.forEach((col) => {
        if (col.w) col.draw()
      })
    }
  }
  
  class Section {
    constructor(x, y, w, h, content, fill_c="yellow", stroke_c = "black"){
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.content = content;
      this.stroke_c = stroke_c;
      this.fill_c = fill_c;
    }
  
    setStyles() {
      p.stroke(this.stroke_c)
      p.fill(this.fill_c)
    }
  
    unSetStyles() {
      p.noStroke();
      p.noFill()
    }
  
    drawShadows() {
      if (this.w <= 0 || this.h <= 0) {
        console.error("Invalid buffer dimensions", this.w, this.h);
        return;
      }
  
      let shadowBuffer = p.createGraphics(this.w, this.h);
      let shadowMaskBuffer = p.createGraphics(this.w, this.h);
      buffers.push(shadowBuffer, shadowMaskBuffer); // This will let us clear all buffers later
  
      drawShadows(0, 0, this.w, this.h, shadowBuffer);
  
      shadowMaskBuffer.fill("black");
      shadowMaskBuffer.rect(0, 0, this.w, this.h);
      shadowMaskBuffer.noFill();
  
      let shadowImage = shadowBuffer.get(); // Get the current state of the graphics buffers
      let shadowMask = shadowMaskBuffer.get();
      // shadowImage.filter(p.BLUR, 1)
      
      shadowImage.mask(shadowMask); // Use the mask on the image
      
      p.blendMode(p.BURN);
      p.image(shadowImage, this.x, this.y);
      p.blendMode(p.BLEND); // Reset blend mode to default
    }
  
    drawContent() {
      let originalColor = this.fill_c
      let darkenedColor = p.color(
        p.hue(originalColor), 
        p.saturation(originalColor), 
        p.max(0, p.lightness(originalColor) - 10)
      );
  
      switch (this.content) {
        case "door":
          drawDoor(this.x, this.y, this.w, this.h, darkenedColor)
          break;
        case "window":
          drawWindow(this.x, this.y, this.w, this.h, darkenedColor)
          break;
        case "circle":
          drawWindow(this.x, this.y, this.w, this.h, darkenedColor)
          break;
        default:
          console.error("Section content does not exist:", this.content, this.i)
          break;
      }
    }
  
    draw () {
      if (this.h !== 0 && this.w !== 0) {
        this.setStyles();
        marker_rect(this.x, this.y, this.w, this.h, this.fill_c);
        this.unSetStyles();
        this.drawContent();
        this.drawShadows();
      }
    }
  }
  
  //-- Details --//
  function drawDoor (x, y, w, h, fill_c) {
    // x,y should always be relative to the current section, so 
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
  
  // -- MARKERS -- //
  function marker_rect (x, y, w, h, fill_c = "white", stroke_c = "black") {
    p.stroke(stroke_c)
    p.fill(fill_c)
    p.rect(x, y, w, h)
  }
  
  function drawShadows(_x, _y, w, h, buffer) {
    let lineSpacing = 6;  // Spacing between squiggly lines
    let length = 20;       // Length of each squiggly line
    let angle = p.PI / 4;    // Direction for all lines (45 degrees)
  
    for (let y = _y; y < h; y += lineSpacing) {
      for (let x = _x; x < w; x += lineSpacing) {
        drawSquigglyLine(x, y, length, angle, buffer);
      }
    }
  }
  
  // Function to draw a single squiggly line
  function drawSquigglyLine(x, y, length, angle, buffer) {
    let segments = p.floor(length / 5); // Number of small segments in the line
    let amp = 1;                  // Amplitude of squiggle
    buffer.stroke("grey")
    buffer.strokeWeight(0.5);                // Thinner lines for finer ink-like detail
    // buffer.stroke(0);                        // Black ink for squiggle lines
  
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
  
  //-- HELPER FUNCS --//
  function sumArray(arr) {
    return arr.reduce((a, b) => a + b, 0);
  }
  
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
    return arr;
  }
  
  // -- Events -- //
  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      p.clear();
      p.setup();
      p.redraw();
    }
  }
};

const Rowhome1: React.FC = () => {
  return (
    <div>
      <h1>Rowhome 1</h1>
      <p>10/30/24</p>
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export default Rowhome1;