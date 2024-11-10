import React from 'react';
import P5Wrapper from '../../components/P5Wrapper';


const mySketch = (p: p5) => {
  let cw, ch;
  let bottom = 20;
  let drawControls = false;
  let img;
  let trees = [];
  let debug = false;
  let fallColorFills;
  let forest;
  let season;
  let textureImg;
  let colors;
  
  p.preload = () => {
    // img = loadImage('../textures/paper_smooth.jpg');
    textureImg = p.loadImage('../textures/watercolor_1.jpg');
  }
  
  p.setup = () => {
    p.colorMode(p.HSL);
  
    // Calc distance from canvas to top of screen
    // let container = document.getElementById("canvas-container")
    // let rect = container.getBoundingClientRect();
    // let distanceFromTop = rect.top;
  
    // Set width and height to full window
    // cw = windowWidth || 600;
    // ch = (windowHeight - distanceFromTop) || 600;
    cw = 600;
    ch = 600;
    p.createCanvas(cw, ch);
    // canvas.parent(container);
    
    colors = {
      winter: [
        'white',
        p.color(200, 10, 90),  // Light Blue
        p.color(210, 20, 80),  // Medium Blue
        p.color(220, 30, 70),  // Dark Blue
        p.color(230, 40, 60),  // Grayish Blue
        p.color(240, 50, 50),  // Steel Blue
        p.color(250, 60, 40),  // Slate Blue
        p.color(260, 70, 30),  // Deep Blue
        p.color(270, 80, 20),  // Navy Blue
        p.color(280, 90, 10),  // Midnight Blue
        p.color(290, 100, 5),  // Blackish Blue
      ],
      fall: [
        p.color(5, 70, 28),   // Red
        p.color(25, 70, 20),  // Orange
        p.color(35, 80, 30),  // Yellow
        p.color(15, 60, 25),  // Brown
        p.color(45, 90, 23),  // Light Yellow
        p.color(5, 70, 28),   // Red
        p.color(25, 70, 50),  // Orange
        p.color(35, 80, 60),  // Yellow
        p.color(15, 60, 50),  // Brown
        p.color(45, 90, 50),  // Light Yellow
        p.color(5, 70, 50),   // Red
      ], 
      spring: [
        'white',
        p.color(25, 70, 30),  // Orange
        p.color(35, 80, 40),  // Yellow
        p.color(15, 60, 35),  // Brown
        p.color(45, 90, 33),  // Light Yellow
        p.color(5, 70, 38),   // Red
        p.color(25, 70, 60),  // Orange
        p.color(35, 80, 70),  // Yellow
        p.color(15, 60, 60),  // Brown
        p.color(45, 90, 60),  // Light Yellow
        p.color(5, 70, 60),   // Red
      ], 
      summer: [
        p.color(82, 90, 75),  // Light Yellow
        p.color(120, 60, 40),  // Dark Green
        p.color(130, 70, 50),  // Medium Green
        p.color(140, 80, 60),  // Light Green
        p.color(110, 50, 30),  // Olive Green
        p.color(150, 90, 70),  // Lime Green
        p.color(125, 65, 45),  // Forest Green
        p.color(135, 75, 55),  // Grass Green
        p.color(145, 85, 65),  // Pale Green
        p.color(115, 55, 35),  // Moss Green
        p.color(155, 95, 75),  // Bright Green
      ]
    }
  
    let forestHeights = {
      summer: p.random(ch/2, ch),
      winter: p.random(50, 150),
      fall: p.random(ch/4, ch-ch/7),
      spring: p.random(ch/4, ch-ch/10),
    }
    
    let trunkHeights = {
      summer: p.random(100, forestHeights["summer"]),
      winter: p.random(100, ch/2),
      fall: p.random(forestHeights["fall"] / 2, forestHeights["fall"] + 50),
      spring: p.random(forestHeights["spring"] / 2, forestHeights["spring"] + 50),
    }
    
    /** General Settings */
    season = p.random(['spring', 'fall', 'winter', 'summer'])
    let center = {x:cw/2, y:ch-bottom};
    let forestHeight = forestHeights[season];
    let fills = colors[season];
    console.log("season", season)
    /** Trunks:
     *   1. Tree Trunks are just random bezier lines
     */
    let numTrunks = p.random(15, 20);
    let numLinesPerTrunk = p.random(4,8);
    let trunkHeight = trunkHeights[season];
    let trunkWidth = p.random(p.width/10,p.width/8)
    /** Leaves:
     *  1. Points are draw randomly across each "row"
     *  2. Rows increment up by rowHeight until they reach forestHeight
     *  3. Leaves are then drawn randomly around each point, avoiding gaps in the "arcs"
     *      - The arcs are essentially openface 3/4 circles that face the center of the tree
     *      - The idea behind arcs to avoid too much clutter in the center
    */
    let pointBoundaryRadius;
    if (season === 'spring' || season === 'fall') {
      pointBoundaryRadius = {min: 100, max: 250}; // Example values for spring
    } else if (season === 'summer') {
      pointBoundaryRadius = {min: 100, max: 220}; // Example values for fall
    } else if (season === 'winter') {
      pointBoundaryRadius = {min: 150, max: 200}; // Example values for winter
    }
    
    let pointsStart = p.height - bottom - pointBoundaryRadius.min;
    
    let numPointsPerRow;
    if (season === 'spring' || season === 'fall') {
      numPointsPerRow = p.random(10 , 15); // Example values for spring
    } else if (season === 'summer') {
      numPointsPerRow = p.random(10 , 15); // Example values for fall
    } else if (season === 'winter') {
      numPointsPerRow = p.random(1, 3); // Example values for winter
    }
    
    let numLeavesPerPoint;
    if (season === 'spring' || season === 'fall') {
      numLeavesPerPoint = p.random(100, 100); // Example values for spring
    } else if (season === 'summer') {
      numLeavesPerPoint = p.random(100, 100); // Example values for fall
    } else if (season === 'winter') {
      numLeavesPerPoint = p.random(3, 5); // Example values for winter
    }
    let leafWidth = p.random(5, 5);
    let rowHeight = season === "fall" ? 30 : 20; //x points will drawn randominly in each row. rows increment up by this amount
    
    let w = p.width/10
    let rowWidthIncrementSizes = {
      summer: () => p.random(-100, 100), 
      winter: () => p.random(-w, w), 
      spring: () => p.random(-w, w), 
      fall: () => p.random(-w, w)
    }
  
     // Pre-calculate random values for trunk and leaf properties
     let preCalculatedTrunkWidths = Array.from({ length: numTrunks }, () => p.random(p.width / 10, p.width / 8));
     let preCalculatedLeafWidths = Array.from({ length: numLeavesPerPoint }, () => p.random(leafWidth - 2, leafWidth + 2));
     let preCalculatedLeafHeights = preCalculatedLeafWidths.map(w => p.random(w, w + 4));
  
    /** Create Tree */
    forest = new Forest({
      forestHeight, numTrunks, numLinesPerTrunk, preCalculatedTrunkWidths, numPointsPerRow, 
      numLeavesPerPoint, rowHeight, center, trunkHeight, trunkWidth, pointsStart,
      pointBoundaryRadius, fills, rowWidthIncrementSizes, preCalculatedLeafWidths, preCalculatedLeafHeights
    })
  }
  
  p.draw = () => {
  
    if (season === "fall") {
      p.background(39, 26, 73) //brown
    } 
    else if (season === "spring") {
      p.background(43, 62, 90) //orange
    }
    else if (season === "winter") {
      p.background(208,18,83) //deep blue
    }
    else if (season === "summer") {
      p.background(56,85,91) //light yellow
    }
    
    //Draw Ground Fill
    // let groundFill = season === "winter" ? "white" : forest.fills[4]
    // if (season === "winter") {
    //   fill(groundFill)
    //   p.noStroke()
    //   rect(0, height-bottom, width, height-bottom);
    // }
    // drawGroundLine(25, ch-bottom, cw-25, groundFill)
    
    //Draw Trees in order
    forest.trunks.forEach(trunk => drawTrunk(
      trunk, forest.trunkHeight, forest.trunkWidth
    ));
  
    let time = p.frameCount * 0.2;
    forest.leaves.forEach(row => row.forEach((l, index) => {
      // if (l.y >= height-bottom) l.y = height-bottom;
      // else l.y += 5
      l.x += Math.sin(time) * l.movementFactor; // Oscillate the x position
      drawLeaf(
        l, 
        0.2, 
        forest.preCalculatedLeafWidths[index], 
        forest.preCalculatedLeafHeights[index]
      );
    }));
    
    //Draw Texture
    p.blendMode(p.MULTIPLY);
    p.image(textureImg, 0, 0, cw, ch);
    p.blendMode(p.BLEND); 
  }
  
  class Forest {
    constructor({
      forestHeight, numTrunks, numLinesPerTrunk, preCalculatedTrunkWidths, leafWidth, numPointsPerRow, 
      numLeavesPerPoint, rowHeight, center, trunkHeight, trunkWidth, pointsStart,
      pointBoundaryRadius, fills, rowWidthIncrementSizes, preCalculatedLeafWidths, preCalculatedLeafHeights
    }){
      Object.assign(this, {
        forestHeight, numTrunks, numLinesPerTrunk, leafWidth, numPointsPerRow, 
        numLeavesPerPoint, rowHeight, center, trunkHeight, trunkWidth, pointsStart,
        pointBoundaryRadius, fills, rowWidthIncrementSizes
      });
      this.fills = fills;
      this.preCalculatedTrunkWidths = preCalculatedTrunkWidths;
      this.preCalculatedLeafWidths = preCalculatedLeafWidths;
      this.preCalculatedLeafHeights = preCalculatedLeafHeights;
      this.midpoint = {x: center.x ,y: center.y - forestHeight/2}
      this.trunks = this.generateTrunks();
      this.points = this.generatePoints();
      this.circles = this.generateCircles();
      this.leaves = this.generateLeaves();
  
      if (debug){
        p.fill("yellow")
        p.circle(this.midpoint.x, p.height - bottom - forestHeight,20)
        p.fill("pink")
        p.circle(this.midpoint.x, this.midpoint.y,20)
        p.fill("red")
        p.circle(this.center.x, this.center.y,20)
      }
    }
  
    generateTrunks() {
      let {numTrunks, numLinesPerTrunk, trunkHeight, trunkWidth} = this;
      // Use pre-calculated trunk widths
      let trunks = [];
      for (let j = 0; j < this.numTrunks; j++) {
        let lines = [];
        let startPoint = {
          x: p.random(p.width / 10, p.width - (p.width / 10)),
          y: p.height - bottom
        };
        let trunkWidth = this.preCalculatedTrunkWidths[j];
        for (let i = 0; i < this.numLinesPerTrunk; i++) {
          let endPoint = {
            x: p.random(startPoint.x-(trunkWidth/2), startPoint.x+(trunkWidth/2)), 
            y: p.random((startPoint.y-trunkHeight) + (trunkHeight/2), startPoint.y-bottom-trunkHeight)
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
        trunks.push(lines)
      }
      return trunks;
    }
  
    generatePoints(){
      let {forestHeight, numPointsPerRow, rowHeight, pointsStart, rowWidthIncrementSizes, midpoint:m} = this;
      let points = [];
      let min_x = p.width/10;
      let max_x = p.width - (p.width/10);
  
      let total_h = p.height - bottom - forestHeight;
      for(let i = pointsStart; i > total_h; i-=rowHeight){
        let row = [];
        let min_y = i;
        let max_y = i - rowHeight;
        for(let j=0; j < numPointsPerRow; j++){
          let x = p.random(min_x, max_x);
          let y = p.random(min_y, max_y)
          let boundary = this.generatePointBoundary(x, y, m.x, m.y)
          row.push({x, y, boundary});
            
          //Draw points
          if (debug) { 
            p.fill("red");
            p.circle(x,y,5);
          }
        }
  
        //Push array or points in points array
        points.push(row)
  
        //Increment min/max x, while making sure we dont exceed midpoint. Otherwise, you will just start an inverted triange shape and end up with an hour glass
        min_x += min_x > p.width/2 ? 0 : rowWidthIncrementSizes[season]();
        max_x += max_x < p.width/2 ? 0 : rowWidthIncrementSizes[season]();
      }
            
      return points;
    }
  
    generatePointBoundary(px, py, mx, my){
      let {pointBoundaryRadius:pbr} = this
      let min = pbr.min;
      let max = pbr.max;
      let radius = p.random(min, max); 
      
      // Calculate the differences in x and y and calc angle us atan2
      let dx = mx - px;
      let dy = my - py;
      let angle = p.atan2(dy, dx);
      
      // This won't do anything, but if you want to create a gap that faces center you can take the values in the comments
      let start = 0 // angle + QUARTER_PI
      let stop = p.TWO_PI // angle - QUARTER_PI
      
      return {start, stop, radius};
    }
  
    generateCircles() {
      let {points} = this;
      let circles = [];
      
      // Create leaves that surround and face each point
      points.forEach(row => {
        row.forEach(({x:px, y:py, boundary:b, isLeftMost, isRightMost}) => {
          if (debug) {
            p.fill(p.color(300, 100, 50, 0.5))
            p.stroke("green")
            let d = b.radius * 2;
            p.arc(px, py, d, d, b.start, b.stop )
          }
  
          circles.push({ x:px, y:py, r:b.radius, isLeftMost, isRightMost })
        })
      })
      return circles;
    }
  
    generateLeaves() {
      let {leafWidth, numLeavesPerPoint, points, fills} = this;
      // Use pre-calculated leaf dimensions
      let leaves = [];
      this.points.forEach(row => {
        let num = this.numLeavesPerPoint;
        row.forEach(({ x: px, y: py, boundary: b }, index) => {
          let row = [];
          for (let i = 0; i < num; i++) {
            //Width and Height of leaves
            let leaf_w = this.preCalculatedLeafWidths[i];
            let leaf_h = this.preCalculatedLeafHeights[i];
            let fill_c = p.random(fills)
            
            //Angle leaf towards center of its boundary
            let angle = p.random(b.start, b.stop)
            let r = p.random(0, b.radius/2) 
            
            //Calculate polar coordinates
            let isFallenLeaf = py + (p.sin(angle) * r) >= (p.height-bottom) //If py is below the ground, we flag it so we can create fallen leaves later
            let x = px + (p.cos(angle) * r);
            let y = isFallenLeaf //If y is below bottom (ground), set to y to bottom with some variance to draw "fallen leaves"
              ? season === "summer"
                ? ch + 100 // get it off the screen! No fallen leaves in summer
                : p.height-bottom + p.random(0,15) 
              : py + (p.sin(angle) * r);
            angle = isFallenLeaf ? p.PI : angle; //Angle fallen leaves horizonally
            
            //will affect the speed of movement in animation
            let movementFactor = p.random(0.1, 1.0);
  
            //Push Leaf into row
            row.push({
              x, y, w:leaf_w, h:leaf_h, 
              angle, start:angle  -p.HALF_PI, stop:angle + p.HALF_PI,
              fill_c, movementFactor
            })
            
            //Debug - Draw leaf point in Blue
            if (debug) {
              p.fill("blue")
              p.circle(x,y,leaf_w)
            }
          }
          //Push row
          leaves.push(row)
          //Decrease number of leaves per point until 5 leaf minimum
          num = num > 5 ? num - 10 : 5;
        })
      })
      return leaves;
    }
  
    clear() {
      this.lines = []
      this.leaves = []
    }
  }
  
  function drawLeaf({x, y, w, h, angle, start, stop, fill_c}, probability) {
    let typeOfLeaf = p.random(0,1) > probability ? "full" : "outline";
    
    drawFullLeaf()
    // if (typeOfLeaf === "full") {
    // } else {
    //   drawOutline()
    // }
    
    // Draw the Leaf
    function drawFullLeaf() {
      p.push();
      p.noStroke();
      p.fill(fill_c)
      p.translate(x,y);
      p.rotate(angle);
      p.arc(0, 0, h, w, 0, p.TWO_PI);
      p.pop();
    }
  
    function drawOutline() {
      p.push();
      p.stroke("black");
      p.strokeWeight(1);
      p.noFill();
      p.translate(x,y);
      p.arc(0, 0, w, w, start-0.2, stop+0.2); //open faced arc pointing toward boundary center
      p.pop();
    }
  }
  
  function drawTrunk(tree, trunkHeight, trunkWidth){
    let trunkBuffer = p.createGraphics(cw, ch);
    tree.forEach(line => {
      let {startPoint:s, controlPoints:cps, endPoint:e} = line
  
      //Set Styles
      trunkBuffer.push()
      trunkBuffer.stroke('black')
      trunkBuffer.strokeWeight(1);
      trunkBuffer.noFill()
  
      // -- Curve Style -- //
      trunkBuffer.beginShape();
      trunkBuffer.vertex(s.x, s.y)
      trunkBuffer.bezierVertex(
        cps[0].x, cps[0].y,
        cps[1].x, cps[1].y,
        e.x, e.y
      )
      trunkBuffer.endShape();
  
      // Erase a circle area
      // if (p.random([0,1])) randomErase();
      
      //Unset Styles
      trunkBuffer.pop()
  
      function randomErase(){
        if (!debug) trunkBuffer.fill("red")
        trunkBuffer.noStroke(10)
        if (!debug) trunkBuffer.erase();
        trunkBuffer.circle(
          s.x+p.random(-trunkWidth/2, trunkWidth/2), 
          e.y-trunkHeight/2, 
          50
        );
        if (!debug) trunkBuffer.noErase();
      }
    })
  
    p.image(trunkBuffer, 0, 0)
  }
  
  function drawGroundLine(xStart, yStart, xEnd, fill_c){
    let x = xStart;
    let y = yStart;
    p.stroke(fill_c);
    p.strokeWeight(1);
    fill_c ? p.fill(fill_c) : p.noFill()
    
    while (x < xEnd){
      let tickLength;
      let tickBump = p.random(-4, 0);
      let tickType = p.random(["long", "short", "long", "short", "space"]);
  
      if(tickType === "long"){
        tickLength = p.random(10, 25);
        p.beginShape();
        p.vertex(x, y, 0);
        let x2 = x;
        let y2 = y;
        let cx1 = x + tickLength / 2;
        let cy1 = y + tickBump;
        let cx2 = x + tickLength;
        let cy2 = y;
        p.bezierVertex(x2, y2, cx1, cy1, cx2, cy2);
        p.endShape();
      }
      else if(tickType === "short"){
        tickLength = p.random(3, 10);
        p.beginShape();
        p.vertex(x, y, 0);
        let x2 = x;
        let y2 = y;
        let cx1 = x + tickLength / 2;
        let cy1 = y + tickBump;
        let cx2 = x + tickLength;
        let cy2 = y;
        p.bezierVertex(x2, y2, cx1, cy1, cx2, cy2);
        p.endShape();
      }
      else if(tickType === "space"){
        tickLength = p.random(5,25)
      } 
      else {
        console.error("no such line type")
      }
  
      x += tickLength;
    }
  }
  
  
  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      p.setup();
      p.clear();
      p.redraw();
    }
  }
};

const FallBreeze: React.FC = () => {
  return (
    <div>
      <h1>Fall Breeze</h1>
      <p>11/10/24</p>
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export default FallBreeze;