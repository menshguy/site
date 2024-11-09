import React from 'react';
import P5Wrapper from '../../components/P5Wrapper';

const mySketch = (p: p5) => {
  let buffers, rowhomes, bottom;
  let cw, ch;
  let drawControls = false;
  let trees = [];
  let textureImg;
  
  p.preload = () => {
    textureImg = p.loadImage('../textures/watercolor_1.jpg');
  }
  
  p.setup = () => {
    cw = 600;
    ch = 600;
    p.createCanvas(cw, ch);
  
    //General Settings
    p.colorMode(p.HSL);
    bottom = 25;
    rowhomes = [];
    buffers = [];
  
    //Draw Main Rowhome
    const h = p.random(ch/3, ch);
    const w = p.random(ch/6, cw);
    const x = (p.width - w) / 2;
    const y = p.height - bottom;
    const fill_c = p.color(23, 100, 54)
    const rowhome = new Rowhome({x, y, w, h, fill_c});
    rowhomes.push(rowhome)
  
    //Draw a rowhome to the left
    const lh = p.random(ch/3, ch);
    const lw = p.random(ch/6, cw);
    const lx = (x - lw) - 2; //start at the main rowhom x and move over to the left by this rowhomes w
    const ly = p.height - bottom;
    const fill_lc = p.color(23, 100, 94)
    const rowhome_left = new Rowhome({x:lx, y:ly, w:lw, h:lh, fill_c:fill_lc})
    rowhomes.push(rowhome_left)
  
    //Draw a rowhome to the right
    const rh = p.random(ch/3, ch);
    const rw = p.random(ch/6, cw);
    const rx = (x + w) + 2; //start at the main rowhom x and move over to the right by main row home w
    const ry = p.height - bottom;
    const fill_rc = p.color(23, 100, 94)
    const rowhome_right = new Rowhome({x:rx, y:ry, w:rw, h:rh, fill_c:fill_rc})
    rowhomes.push(rowhome_right)
  
    //If there is still space to the left, draw yet another home (TODO: Make more dynamic)
    if (lx > 0) {
      const h = p.random(ch/3, ch);
      const w = p.random(ch/6, cw);
      const x = (lx - w) - 2; 
      const y = p.height - bottom;
      const fill_c = p.color(23, 100, 94)
      const rowhome_left = new Rowhome({x, y, w, h, fill_c})
      rowhomes.push(rowhome_left)
    }
  
    //If there is still space to the right, draw yet another home (TODO: Make more dynamic)
    if (rx + rw < p.width) {
      const h = p.random(ch/3, ch);
      const w = p.random(ch/6, cw);
      const x = (rx + w) + 2; 
      const y = p.height - bottom;
      const fill_c = p.color(23, 100, 94)
      const rowhome_right = new Rowhome({x, y, w, h, fill_c})
      rowhomes.push(rowhome_right)
    }
  
    //Setup Trees
    let numTrees = p.random(1,3)
    let center = {x:cw/2, y:ch-(bottom/2)}
    for (let i = 0; i < numTrees; i++) {
      let numLines = p.floor(p.random(5,21));
      let startPoint = {x: p.random(center.x-(cw/2)-200, center.x+(cw/2 + 200)), y: center.y};
      let treeHeight = p.random(100,200);
      let treeWidth = p.random(100,200)
      let tree = new Tree({numLines, startPoint, treeHeight, treeWidth})
      trees.push(tree)
    }
  }
  
  p.draw = () => {
    p.background(183, 52, 88);
    p.noStroke();
    p.noLoop();
    
    buffers.forEach(buffer => { buffer?.clear() }) // Clear the graphics buffers
    rowhomes.forEach(rowhome => rowhome.draw()) // Draw rowhomes
    marker_rect(0, p.height-bottom, p.width, bottom, p.color(204, 14, 60)) // Draw Sidewalk
  
    //Draw Trees
    p.stroke(5, 42, 12);
    p.strokeWeight(2);
    p.noFill()
  
    //Draw the Tree(s)
    trees.forEach(tree => {
      tree.drawTree();
      tree.drawLeaves();
    }); 
  
    //Draw Texture
    p.blendMode(p.MULTIPLY);
    p.image(textureImg, 0, 0, cw, ch);
    p.blendMode(p.BLEND); 
  }
  
  
  class Tree {
    constructor({numLines, startPoint, treeHeight, treeWidth}){
      Object.assign(this, { numLines, startPoint, treeHeight, treeWidth });
      this.lines = this.generateTree();
      this.leaves = this.generateLeaves();
    }
  
    generateTree() {
      let {startPoint, numLines, treeHeight, treeWidth} = this;
      let lines = [];
  
      for (let i = 0; i < numLines; i++) {
        let endPoint = {
          x: startPoint.x + p.random(-(treeWidth/2), treeWidth/2), 
          y: p.random((startPoint.y-bottom-treeHeight) + (treeHeight/2), startPoint.y-bottom-treeHeight)
        }
        let startControlPoint = {
          x: startPoint.x, 
          y: p.random(startPoint.y, endPoint.y)
        }
        let endControlPoint = {
          x: endPoint.x < startPoint.x ? p.random(endPoint.x, startPoint.x) : p.random(startPoint.x, endPoint.x),
          y: p.random(startControlPoint.y, endPoint.y)
        }
        let controlPoints = [startControlPoint, endControlPoint]
        lines.push({ startPoint, endPoint, controlPoints })
      }
      return lines;
    }
  
    generateLeaves() {
      let leaves = [];
      let radius = p.random(125, 150); // Create the large enclosing circle, but don't draw it
      // Draw small half-circles on the right half only
      let numCircles = 900; // Number of small half-circles
      for (let i = 0; i < numCircles; i++) {
        // Random angle between 0 and PI for the right half
        let angle = p.random(-p.PI, p.PI);
        // Random radius within the main circle's radius
        let r = p.sqrt(p.random(0,0.5)) * radius;
        let x = p.cos(angle) * r;
        let y = p.sin(angle) * r;
        // Calculate the angle of the half-circle to face the center
        let angleToCenter = p.atan2(y, x);
  
        // Draw the half-circle
        
        let w = p.random(10,20)
        let h = p.random(10,20)
        leaves.push({x, y, w, h, start: angleToCenter - p.HALF_PI, stop: angleToCenter + p.HALF_PI})
      }
      return leaves;
    }
  
    drawLeaves() {
      let {startPoint, treeHeight} = this;
  
      p.stroke("black");
      p.strokeWeight(1);
  
      // Draw everything within a push-pop block to apply rotation to this block only
      p.push();
      p.translate(startPoint.x, startPoint.y-(bottom/2)-(treeHeight));
      p.rotate(p.radians(-90));
  
      this.leaves.forEach( ({x, y, w, h, start, stop}) => {
        p.fill(p.random([
          p.color(44, 59, 77), 
          p.color(35, 45, 47),
          p.color(19, 66, 66),
          p.color(86, 38, 55)
        ]))
        p.arc(x, y, w, h, start, stop);
      })
      
      p.pop();
    }
  
    drawTree(){
      //Draw Tree Branches
      this.lines.forEach(l => {
        let {startPoint, controlPoints, endPoint} = l
  
        //Style the line
        p.beginShape();
        p.vertex(startPoint.x, startPoint.y)
        p.bezierVertex(
          controlPoints[0].x, controlPoints[0].y,
          controlPoints[1].x, controlPoints[1].y,
          endPoint.x, endPoint.y
        )
        p.endShape();
        
        if(drawControls){
          //Draw Anchor Points
          p.stroke("black");
          p.strokeWeight(5);
          p.point(startPoint.x, startPoint.y)
          p.point(endPoint.x, endPoint.y)
          
          //Draw Control Points for Reference
          p.stroke("red");
          p.strokeWeight(5);
          controlPoints.forEach(p => {
            p.point(p.x, p.y)
          })
        
          //Connect Control Points to Anchor Points
          p.stroke("red")
          p.strokeWeight(1);
          p.line(startPoint.x, startPoint.y, controlPoints[0].x, controlPoints[0].y)
          p.line(endPoint.x, endPoint.y, controlPoints[1].x, controlPoints[1].y)
        }
      })
    }
  
    clear() {
      this.lines = []
      this.leaves = []
    }
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
      this.totalHeight = this.configs.reduce((a, b) => a + b.proportion, 0); //sum of floor all proportions. Needed to calculate floor heights
      this.allFloors = this.generateAllFloors();
    }
    
    /**
     * Generates all the x,y,w,h and content data for each floor in the home.
     * @returns {Array} returns a nested array for FloorSections, 
     * @example [[x,y,w,h,content,fill_c, stroke_c], ...]
     */
    generateAllFloors() {
      let {x, y, w, h, totalHeight, configs} = this;
      return configs.map((config, i) => {
        //TODO: Fix this so that the total height is never exceeded
        let fh = h/totalHeight * config.proportion; //find each floors height based on asigned proportion
        if (fh > config.max) fh = config.max;
        if (fh < config.min) fh = config.min;
        y -= fh;
        return this.generateFloorSections({x, y, w, h:fh, config})
      })
    }
    
    /**
     * Generates all the x,y,w,h and content data for each FloorSection and returns a nestary array of FloorSections
     * @returns {Array} returns a nested array for FloorSections, [[x,y,w,h,content,fill_c, stroke_c],[x,y,w,h,content], ...]
     * @example [FloorSection, FloorSection, ...]
     */
    generateFloorSections({x, y, w, h, config}){
      let {fill_c, numFloors} = this;
      let {content} = config
      let numCols = p.random([2,2,3,3,3,4,4,4,4,5])
      let sectionProportions = getSectionProportions(numCols)
      let sections = getSections(sectionProportions, numCols)
      return sections;
      
      //create an array populated with the proportion value of each section
      function getSectionProportions(numCols) {
        let sectionProportions = [];
        let remainder = numCols;
        for (let j = 0; j < numCols; j++) {
          // if it's the last index, we assign the remainder to the last index
          let value = j === numCols - 1 ? remainder : p.floor(p.random(0, remainder + 1));
          remainder -= value;
          sectionProportions.push(value);
        }
        return sectionProportions;
      }
      
      //Use the proportion values generated above to calculate the actual width of each section
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
      // this doesnt work at the moment
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
      buffers.push(shadowBuffer, shadowMaskBuffer); // This will let us clear all buffers later
  
      drawTextureHatches(0, 0, this.w, this.h, shadowBuffer);
  
      shadowMaskBuffer.fill("black");
      shadowMaskBuffer.rect(0, 0, this.w, this.h);
      shadowMaskBuffer.noFill();
  
      let shadowImage = shadowBuffer.get(); // Get the current state of the graphics buffers
      let shadowMask = shadowMaskBuffer.get();
      // shadowImage.filter(BLUR, 1)
      
      shadowImage.mask(shadowMask); // Use the mask on the image
      
      p.blendMode(p.BURN);
      p.image(shadowImage, this.x, this.y);
      p.blendMode(p.BLEND); // Reset blend mode to default
    }
  
    draw () {
      if (this.h !== 0 && this.w !== 0) {
        this.setStyles();
        this.drawFloorBG();
        this.drawContent();
        this.drawTexture();
        this.unSetStyles();
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
  
    for (let i = 0; i < 3; i++) {  // Draw multiple lines to make it look rough
      
      // Top line
      p.line(
        x + p.random(-2, 2), 
        y + p.random(-2, 2), 
        x + w + p.random(-2, 2), 
        y + p.random(-2, 2)
      );
      
      // Right line
      p.line(
        x + w + p.random(-2, 2), 
        y + p.random(-2, 2), 
        x + w + p.random(-2, 2), 
        y + h + p.random(-2, 2)
      );
      
      // Bottom line
      p.line(
        x + p.random(-2, 2), 
        y + h + p.random(-2, 2), 
        x + w + p.random(-2, 2), 
        y + h + p.random(-2, 2)
      );
      
      // Left line
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
  
  // -- Events -- //
  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      trees.forEach(tree => tree.clear());
      p.clear();
      p.setup();
      p.draw();
    }
  }
};

const Rowhome3: React.FC = () => {
  return (
    <div>
      <h1>Rowhome 3</h1>
      <p>11/1/24</p>
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export default Rowhome3;