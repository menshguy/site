import React from 'react';
import P5Wrapper from '../../components/P5Wrapper';


const mySketch = (p: p5) => {

  let {color} = p
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
  let bgColor;
  
  p.preload = () => {
    // img = loadImage('../textures/paper_smooth.jpg');
    textureImg = p.loadImage('../textures/watercolor_1.jpg');
  }
  
  p.setup = () => {
    p.colorMode(p.HSL);
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

    let bgColors = {
      summer: p.color(56,85,91), //light yellow
      winter: p.color(208,18,83), //deep blue
      spring: p.color(43, 62, 90), //orange
      fall: p.color(39, 26, 73) //brown
    }
  
    let treeHeights = {
      summer: p.random(ch/2, ch),
      winter: p.random(50, 150),
      fall: p.random(ch/4, ch-ch/7),
      spring: p.random(ch/4, ch-ch/10),
    }
    
    let trunkHeights = {
      summer: p.random(100, treeHeights["summer"]),
      winter: p.random(100, ch/2),
      fall: p.random(treeHeights["fall"] / 2, treeHeights["fall"] + 50),
      spring: p.random(treeHeights["spring"] / 2, treeHeights["spring"] + 50),
    }
    
    /** General Settings */
    season = p.random(['spring', 'fall', 'winter', 'summer'])
    bgColor = bgColors[season];
    console.log("season", season)
    let startP = {x:cw/2, y:ch-bottom};
    let treeHeight = treeHeights[season];
    let fills = colors[season];

    let trunkHeight = trunkHeights[season];
    let trunkWidth = p.random(100,500)
    let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

    let numPointsPerRow = p.random(10 , 15); // X points are draw within a boundary radius
    let pointBoundaryRadius = {min: 100, max: 250}; //
    let avg = season === "winter" ? 5 : 100
    
    let numLeavesPerPoint = p.random(avg, avg); // X leaves are draw around each point.
    let leavesStartY = p.height - bottom - pointBoundaryRadius.min; //where on y axis do leaves start
    let leafWidth = p.random(5, 5);
    let leafHeight = p.random(5, 5);
  
    /** Create Tree */
    forest = new Forest({
      treeHeight, numTrunkLines, numPointsPerRow,
      numLeavesPerPoint, startP, trunkHeight, trunkWidth, leavesStartY,
      pointBoundaryRadius, fills, leafWidth, leafHeight
    })
  }
  
  p.draw = () => {
    p.background(bgColor)
    
    drawTrunk(forest.trunk); //Draw Tree Trunk
  
    let time = p.frameCount * 0.2;
    forest.leaves.forEach(row => row.forEach(l => {
      l.x += Math.sin(time) * l.movementFactor; // Oscillate the x position
      drawLeaf(l);
    }));
    
    //Draw Texture
    p.blendMode(p.MULTIPLY);
    p.image(textureImg, 0, 0, cw, ch);
    p.blendMode(p.BLEND); 
  }
  
  class Forest {
    constructor({
      treeHeight, numTrunks, numTrunkLines, numPointsPerRow, 
      numLeavesPerPoint, startP, trunkHeight, trunkWidth, leavesStartY,
      pointBoundaryRadius, fills, leafWidth, leafHeight
    }){
      Object.assign(this, {
        treeHeight, numTrunks, numTrunkLines, numPointsPerRow, 
        numLeavesPerPoint, startP, trunkHeight, trunkWidth, leavesStartY,
        pointBoundaryRadius, fills
      });
      this.fills = fills;
      this.leafWidth = leafWidth;
      this.leafHeight = leafHeight;
      this.midpoint = {x: startP.x ,y: startP.y - treeHeight/2}
      this.trunk = this.generateTrunk();
      this.points = this.generatePoints();
      this.leaves = this.generateLeaves();
  
      if (debug){
        p.fill("yellow")
        p.circle(this.midpoint.x, p.height - bottom - treeHeight,20)
        p.fill("pink")
        p.circle(this.midpoint.x, this.midpoint.y,20)
        p.fill("red")
        p.circle(this.startP.x, this.startP.y,20)
      }
    }
  
    generateTrunk() {
      let {numTrunkLines, startP, trunkHeight, trunkWidth} = this;
      // Use pre-calculated trunk widths
      let lines = [];
      let startPoint = {
        x: p.random(startP.x - 50, startP.x + 50),
        y: startP.y
      };
      for (let i = 0; i < numTrunkLines; i++) {
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
      return lines;
    }
  
    generatePoints(){
      let {treeHeight, trunkWidth, numPointsPerRow, leavesStartY, startP, pointBoundaryRadius, midpoint:m} = this;
      let points = [];
      let min_x = startP.x - trunkWidth;
      let max_x = startP.x + trunkWidth;
  
      let max_height = p.height - bottom - treeHeight;
      let rowHeight = treeHeight/10;
      for(let i = leavesStartY; i > max_height; i -= rowHeight){
        let row = [];
        let min_y = i;
        let max_y = i - rowHeight;
        for(let j=0; j < numPointsPerRow; j++){
          let x = p.random(min_x, max_x);
          let y = p.random(min_y, max_y)
          let r = pointBoundaryRadius;
          let boundary = generatePointBoundary(r, x, y, m.x, m.y)
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
        min_x += min_x > p.width/2 ? 0 : p.random(-50, 50);
        max_x += max_x < p.width/2 ? 0 : p.random(-50, 50);
      }
            
      return points;

      function generatePointBoundary(max_r, px, py, mx, my){
        let min = max_r.min;
        let max = max_r.max;
        let radius = p.random(min, max); 
        
        // Calculate the differences in x and y and calc angle us atan2
        let dx = mx - px;
        let dy = my - py;
        let angle = p.atan2(dy, dx);
        
        // This won't do anything, but if you want to create a gap that faces startP you can take the values in the comments
        let start = 0 // angle + QUARTER_PI
        let stop = p.TWO_PI // angle - QUARTER_PI
        
        return {start, stop, angle, radius};
      }
    }
  
    generateLeaves() {
      let {leafWidth, leafHeight, numLeavesPerPoint, points, fills} = this;
      // Use pre-calculated leaf dimensions
      let leaves = [];
      this.points.forEach(row => {
        let num = this.numLeavesPerPoint;
        row.forEach(({ x: px, y: py, boundary: b }, index) => {
          let row = [];
          for (let i = 0; i < num; i++) {
            //Width and Height of leaves
            let leaf_w = leafWidth;
            let leaf_h = leafHeight;
            let fill_c = p.random(fills)
            
            //Angle leaf towards startP of its boundary
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
  
  function drawLeaf({x, y, w, h, angle, start, stop, fill_c}) {
    p.push();
    p.noStroke();
    p.fill(fill_c)
    p.translate(x,y);
    p.rotate(angle);
    p.arc(0, 0, h, w, 0, p.TWO_PI);
    p.pop();
  }
  
  function drawTrunk(lines){
    let trunkBuffer = p.createGraphics(cw, ch);
    lines.forEach(line => {
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
      
      //Unset Styles
      trunkBuffer.pop()
  
    })
  
    p.image(trunkBuffer, 0, 0)
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