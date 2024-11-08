import React from 'react';
import P5Wrapper from './P5Wrapper';


const mySketch = (p: p5) => {
  // let {
  //   preload, setup, draw, noLoop, background, fill, noStroke, rect, blendMode, image,
  //   createCanvas, p.colorMode, loadImage, p.random, p.color, width, height, HALF_PI, QUARTER_PI,
  //   TWO_PI, sin, cos, atan2, push, pop, translate, rotate, arc, beginShape, vertex,
  //   bezierVertex, endShape, circle, stroke, strokeWeight, noFill, createGraphics,
  //   MULTIPLY, BLEND, mouseX, mouseY,
  //   HSL
  // } = p;

  let cw, ch;
  let bottom = 20;
  let textureImg;
  let drawControls = false;
  let img;
  let trees = [];
  let debug = false;
  let fallColorFills;
  let colors;
  let colorsSunlight;
  let forest;
  let season;

  p.preload = () => {
    // img = loadImage('../textures/paper_smooth.jpg');
    textureImg = p.loadImage(
      './textures/watercolor_1.jpg',
      () => {
        console.log('Image loaded successfully');
      },
      (err) => {
        console.error('Error loading image:', err);
      }
    );
  }

  p.setup = () => {
    p.colorMode(p.HSL);

    // Calc distance from canvas to top of screen
    // let container = document.getElementById("canvas-container");
    // let rect = container.getBoundingClientRect();
    // let distanceFromTop = rect.top;

    // Set width and height to full window
    // cw = windowWidth || 600;
    // ch = (windowHeight - distanceFromTop) || 600;
    cw = 800;
    ch = 800;
    p.createCanvas(cw, ch);
    // canvas.parent(container);
    
    p.colors = {
      winter: [
        'white',
        p.color(200, 10, 50),  // Light Blue
        p.color(210, 20, 60),  // Medium Blue
        p.color(220, 30, 50),  // Dark Blue
        p.color(230, 40, 40),  // Grayish Blue
        p.color(240, 50, 30),  // Steel Blue
        p.color(250, 60, 20),  // Slate Blue
        p.color(260, 70, 20),  // Deep Blue
        p.color(270, 80, 30),  // Navy Blue
        p.color(280, 90, 20),  // Midnight Blue
        p.color(290, 100, 35),  // Blackish Blue
      ],
      fall: [
        p.color(5, 70, 18),   // Red
        p.color(25, 70, 10),  // Orange
        p.color(35, 80, 20),  // Yellow
        p.color(15, 60, 15),  // Brown
        p.color(45, 90, 13),  // Light Yellow
        p.color(5, 70, 18),   // Red
        p.color(25, 70, 30),  // Orange
        p.color(35, 80, 40),  // Yellow
        p.color(15, 60, 30),  // Brown
        p.color(45, 90, 20),  // Light Yellow
        p.color(5, 70, 30),   // Red
      ], 
      spring: [
        'white',
        p.color(25, 70, 10),  // Orange
        p.color(35, 80, 15),  // Yellow
        p.color(15, 60, 20),  // Brown
        p.color(45, 90, 23),  // Light Yellow
        p.color(5, 70, 23),   // Red
        p.color(25, 70, 30),  // Orange
        p.color(35, 80, 29),  // Yellow
        p.color(15, 60, 31),  // Brown
        p.color(45, 90, 31),  // Light Yellow
        p.color(5, 70, 24),   // Red
      ], 
      summer: [
        p.color(82, 90, 45),  // Light Yellow
        p.color(120, 60, 15),  // Dark Green
        p.color(130, 70, 23),  // Medium Green
        p.color(140, 80, 23),  // Light Green
        p.color(110, 50, 11),  // Olive Green
        p.color(150, 90, 35),  // Lime Green
        p.color(125, 65, 24),  // Forest Green
        p.color(135, 75, 22),  // Grass Green
        p.color(145, 85, 18),  // Pale Green
        p.color(115, 55, 12),  // Moss Green
        p.color(155, 95, 37),  // Bright Green
      ]
    }

    p.colorsSunlight ={
      winter: () => p.color(p.random(205,225), 80, 90),
      fall: () => p.color(p.random(15,50), 80, 60),
      spring: () => p.color(p.random(5,60), 75, 70),
      summer: () => p.color(p.random(100,135), 70, 95)
    }

    let w = p.width/10
    let rowWidthIncrementSizes = {
      summer: () => p.random(-w, w), 
      winter: () => p.random(-w, w), 
      spring: () => p.random(-w, w), 
      fall: () => p.random(-w, w)
    }

    let forestHeights = {
      summer: p.random(ch/4, ch-ch/7),
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
    // season = p.random(['spring', 'fall', 'summer'])
    season = 'fall'
    let center = {x:cw/2, y:ch-bottom};
    let forestHeight = forestHeights[season];
    let fills = p.colors[season];
    console.log("season", season)
    /** Trunks:
     *   1. Tree Trunks are just p.random bezier lines
     */
    let numTrunks = p.random(15, 20);
    let numLinesPerTrunk = p.random(4,8);
    let trunkHeight = trunkHeights[season];
    let trunkWidth = p.random(p.width/10,p.width/8)
    /** Leaves:
     *  1. Points are draw p.randomly across each "row"
     *  2. Rows increment up by rowHeight until they reach forestHeight
     *  3. Leaves are then drawn p.randomly around each point, avoiding gaps in the "arcs"
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
      numPointsPerRow = p.random(p.width/100 , p.width/60); // Example values for spring
    } else if (season === 'summer') {
      numPointsPerRow = p.random(p.width/100 , p.width/50); // Example values for fall
    } else if (season === 'winter') {
      numPointsPerRow = p.random(1, 3); // Example values for winter
    }
    
    let numLeavesPerPoint;
    if (season === 'spring' || season === 'fall') {
      numLeavesPerPoint = p.random(1000, 1200); // Example values for spring
    } else if (season === 'summer') {
      numLeavesPerPoint = p.random(800, 100); // Example values for fall
    } else if (season === 'winter') {
      numLeavesPerPoint = p.random(3, 5); // Example values for winter
    }
    let leafWidth = season === "summer" ? p.random(4, 4) : p.random(2, 3);
    let rowHeight = season === "fall" ? 30 : 20; //x points will drawn p.randominly in each row. rows increment up by this amount
    

    /** Create Tree */
    forest = new Forest({
      forestHeight, numTrunks, numLinesPerTrunk, leafWidth, numPointsPerRow, 
      numLeavesPerPoint, rowHeight, center, trunkHeight, trunkWidth, pointsStart,
      pointBoundaryRadius, fills, rowWidthIncrementSizes
    })
  }

  p.draw = () => {
    p.noLoop();

    if (season === "fall") {
      p.background(39, 26, 73) //brown
    } 
    else if (season === "spring") {
      p.background(43, 62, 50) //orange
    }
    else if (season === "winter") {
      p.background(208,18,83) //deep blue
    }
    else if (season === "summer") {
      p.background(56,85,91) //light yellow
    }
    
    //Draw Ground Fill
    let groundFill = season === "winter" ? "white" : forest.fills[4]
    if (season === "winter") {
      p.fill(groundFill)
      p.noStroke()
      p.rect(0, p.height-bottom, p.width, p.height-bottom);
    }
    
    //Draw Ground Squiggly (on top of Ground Fill & trees)
    drawGroundLine(25, ch-bottom, cw-25, groundFill)
    
    //Draw Trees in order
    forest.trunks.forEach(trunk => drawTrunk(trunk, forest.trunkHeight, forest.trunkWidth));
    forest.leaves.forEach(row => row.forEach(l => {
      drawLeaf(l, 0.2)
    }));
    
    //Draw Texture
    p.blendMode(p.MULTIPLY);
    p.image(textureImg, 0, 0, cw, ch);
    p.blendMode(p.BLEND); 

    forest.sunLeaves.forEach(l => {
      drawSunLeaf(l)
    });
  }

  class Forest {
    constructor({
      forestHeight, numTrunks, numLinesPerTrunk, leafWidth, numPointsPerRow, 
      numLeavesPerPoint, rowHeight, center, trunkHeight, trunkWidth, pointsStart,
      pointBoundaryRadius, fills, rowWidthIncrementSizes
    }){
      Object.assign(this, {
        forestHeight, numTrunks, numLinesPerTrunk, leafWidth, numPointsPerRow, 
        numLeavesPerPoint, rowHeight, center, trunkHeight, trunkWidth, pointsStart,
        pointBoundaryRadius, fills, rowWidthIncrementSizes
      });
      this.fills = fills;
      this.midpoint = {x: center.x ,y: center.y - forestHeight/2}
      this.trunks = this.generateTrunks();
      this.points = this.generatePoints();
      this.circles = this.generateCircles();
      let {leaves, sunLeaves} = this.generateLeaves();
      this.leaves = leaves;
      this.sunLeaves = sunLeaves;

      if (debug){
        p.fill("yellow")
        p.circle(this.midpoint.x, height - bottom - forestHeight,20)
        p.fill("pink")
        p.circle(this.midpoint.x, this.midpoint.y,20)
        p.fill("red")
        p.circle(this.center.x, this.center.y,20)
      }
    }

    generateTrunks() {
      let {numTrunks, numLinesPerTrunk, trunkHeight, trunkWidth} = this;
      
      let trunks = []
      for (let j = 0; j < numTrunks; j++) {
        let lines = [];
        let startPoint = {
          x: p.random(p.width/10, p.width - (p.width/10)),
          y: p.height-bottom
        };
        for (let i = 0; i < numLinesPerTrunk; i++) {
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
      
      // Calculate the differences in x and y and calc angle use atan2
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
      let leaves = [];
      let sunLeaves = [];

      // Create leaves that surround and face each point
      points.forEach(row => {
        let num = numLeavesPerPoint;
        row.forEach(({x:px, y:py, boundary:b}) => {
          //Create Leaves and push into row
          let row = []
          for (let i = 0; i < num; i++) {
            //Width and Height of leaves
            let leaf_w = p.random(leafWidth-2,leafWidth+2)
            let leaf_h = p.random(leaf_w,leaf_w+4)
            let fill_c = p.random(fills)
            
            //Angle leaf towards center of its boundary
            let angle = p.random(b.start, b.stop)
            let r = p.random(0, b.radius/2)

            //If angle is pointing towards "sun" (upper left), 
            //push into different array, adjust radius, make leave bigger
            let flagForSunlight = false;
            if (angle > p.HALF_PI + p.QUARTER_PI && angle < p.TWO_PI-p.QUARTER_PI){
              if(p.random([0,0,0,0,0,0,1])) {
                fill_c = p.colorsSunlight[season]();
                r = p.random(b.radius/3, b.radius/2)
                leaf_w += 1
                leaf_h += 1
                flagForSunlight = true
              }
            }
            
            //Calculate polar coordinates
            let isFallenLeaf = py + (p.sin(angle) * r) >= (p.height-bottom) //If py is below the ground, we flag it so we can create fallen leaves later
            let x = px + (p.cos(angle) * r);
            let y = isFallenLeaf //If y is below bottom (ground), set to y to bottom with some variance to draw "fallen leaves"
              ? season === "summer"
                ? ch + 100 // get it off the screen! No fallen leaves in summer
                : p.height-bottom+p.random(0,15) 
              : py + (p.sin(angle) * r);
            angle = isFallenLeaf ? p.PI : angle; //Angle fallen leaves horizonally
            
            //Create Leaf Object
            let leaf = {
              x, y, w:leaf_w, h:leaf_h, 
              angle, start:angle-p.HALF_PI, stop:angle+p.HALF_PI,
              flagForSunlight, fill_c
            }

            //Push Leaf into row
            if (leaf.flagForSunlight) {
              sunLeaves.push(leaf)
            } else {
              row.push(leaf)
            }
            
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
      return {leaves, sunLeaves};
    }

    clear() {
      this.lines = []
      this.leaves = []
    }
  }

  function drawLeaf({x, y, w, h, angle, start, stop, fill_c}, prob) {
    let typeOfLeaf = p.random(0,1) > prob ? "full" : "outline";
    
    if (typeOfLeaf === "full") {
      drawFullLeaf()
    } else {
      drawOutline()
    }
    
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

  function drawSunLeaf({x, y, w, h, angle, start, stop, fill_c}) {
    p.push();
    p.noStroke();
    p.fill(fill_c)
    p.translate(x,y);
    p.rotate(angle);
    p.arc(0, 0, h, w, 0, p.TWO_PI);
    p.pop();
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

      //Draw curved line //
      trunkBuffer.beginShape();
      trunkBuffer.vertex(s.x, s.y)
      trunkBuffer.bezierVertex(
        cps[0].x, cps[0].y,
        cps[1].x, cps[1].y,
        e.x, e.y
      )
      trunkBuffer.endShape();
      
      //Unset Styles
      trunkBuffer.pop()
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

  function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      p.setup();
      p.clear();
      p.redraw();
    }
  }
  
};

const MyComponent: React.FC = () => {
  return (
    <div>
      <h1>Fall Sunlight</h1>
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export default MyComponent;