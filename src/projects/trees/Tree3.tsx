import React from 'react';
import P5Wrapper from '../../components/P5Wrapper';


const mySketch = (p: p5) => {
  let cw, ch;
  let bottom = 100;
  let drawControls = false;
  let trees = []
  
  p.setup = () => {
    cw = 600;
    ch = 600;
    p.createCanvas(cw, ch);
  }
  
  p.draw = () => {
    p.colorMode(p.HSL);
    p.background(38, 89, 58) //warm orange
    // background(202, 50, 95); //cool blue
    // background(38, 59, 87) //warm gray
    p.noLoop();
    
  
    let numTrees = p.random(3,7)
    let center = {x:cw/2, y:ch-bottom}
    
    for (let i = 0; i < numTrees; i++) {
      let numLines = p.floor(p.random(5,21));
      let startPoint = {x: p.random(center.x-(cw/2)-200, center.x+(cw/2 + 200)), y: center.y};
      let treeHeight = p.random(100,200);
      let treeWidth = p.random(100,200)
      let tree = new Tree({numLines, startPoint, treeHeight, treeWidth})
      trees.push(tree)
    }
    
    //Draw Trees
    p.stroke(5, 42, 12);
    p.strokeWeight(1);
    p.noFill()
  
    //Draw the Tree(s)
    trees.forEach(tree => {
      tree.drawTree();
      tree.drawLeaves();
    }); 
  
    //Draw Base Line
    p.stroke(5, 42, 12);
    p.strokeWeight(1.5);
    drawBaseLine(0, ch-bottom, cw)
  }
  
  function drawBaseLine(xStart, y, xEnd){
    let x = xStart;
    
    while (x < xEnd){
      let tickLength;
      let tickBump = p.random(-6, 0);
      let tickType = p.random(["long", "long", "short", "space"]);
  
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
        tickLength = p.random(5,10)
      } 
      else {
        console.error("no such line type")
      }
  
      x += tickLength;
    }
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
  
  p.mousePressed = () => {
    // Check if mouse is inside canvas
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      if (drawControls){
        trees.forEach(tree => {
          let {lines} = tree;
          lines.forEach(line => {
            let p = line.controlPoints
            let x1 = p[0].x
            let y1 = p[0].y
            let x2 = p[1].x
            let y2 = p[1].y
            if (p.dist(p.mouseX, p.mouseY, x1, y1) < 10) {
              line.isDragging = {i: 0};
            }
            if (p.dist(p.mouseX, p.mouseY, x2, y2) < 10) {
              line.isDragging = {i: 1};
            }
          });
        });
      } else {
        trees.forEach(tree => tree.clear());
        p.clear();
        p.setup();
        p.draw();
      }
    }
  }
  
  p.mouseDragged = () => {
    // Check if mouse is inside canvas
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      trees.forEach(tree => {
        let {lines} = tree;
        lines.forEach(line => {
          let p = line.controlPoints
          if (line.isDragging) {
            p[line.isDragging.i].x = p.mouseX;
            p[line.isDragging.i].y = p.mouseY;
          }
        });
      })
    }
  }
  
  p.mouseReleased = () => {
    // Check if mouse is inside canvas
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      trees.forEach(tree => {
        let {lines} = tree;
        lines.forEach(line => {
          line.isDragging = false;
        });
      })
    }
  }
};

const Tree3: React.FC = () => {
  return (
    <div>
      <h1>Tree 3</h1>
      <p>11/1/24</p>
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export default Tree3;