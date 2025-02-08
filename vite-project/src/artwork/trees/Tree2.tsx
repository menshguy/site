import React from 'react';
import P5Wrapper from '../../components/P5Wrapper';
import p5 from 'p5';

const mySketch = (p: p5) => {
  let cw: number, ch:number;
  let bottom = 100;
  let trees: any[] = [];
  
  p.setup = () => {
    // Sketch Settings
    p.colorMode(p.HSL);
    p.background(25, 35, 97);
    p.noLoop();
  
    cw = 600;
    ch = 600;
    p.createCanvas(cw, ch);
    
    let numTrees = 3
    let center = {x:cw/2, y:ch-bottom}
    
    for (let i = 0; i < numTrees; i++) {
      let numLines = p.floor(p.random(5,21));
      let startPoint = {x: p.random(center.x-(cw/2 - 100), center.x+(cw/2 - 100)), y: center.y};
      let treeHeight = p.random(100,200);
      let treeWidth = p.random(100,200)
      let tree = new Tree({numLines, startPoint, treeHeight, treeWidth})
      trees.push(tree)
    }
  }
  
  p.draw = () => {
    //Draw Trees
    p.stroke(5, 42, 12);
    p.strokeWeight(2);
    p.noFill()
    trees.forEach(tree => tree.draw()); //Draw the Tree(s)
  
    //Draw Snow
    p.noStroke();
    p.fill(217, 43, 98);
    p.rect(0, ch-bottom, cw, bottom)
    
    //Draw Base Line
    p.stroke(5, 42, 12);
    p.strokeWeight(1);
    drawBaseLine(100, ch-bottom, cw-100)
    p.noFill();
  }
  
  function drawBaseLine(xStart: number, y: number, xEnd: number){
    let x = xStart;
    
    while (x < xEnd){
      let tickLength = 0;
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
  
  class Tree {
    numLines: number;
    startPoint: { x: number; y: number }; 
    treeHeight: number;
    treeWidth: number;
    lines: any[];
    leaves: any[]

    constructor({
      numLines, 
      startPoint, 
      treeHeight, 
      treeWidth
    }: {
      numLines: number, 
      startPoint: { x: number; y: number }, 
      treeHeight: number, 
      treeWidth: number
    }){
      this.numLines = numLines 
      this.startPoint = startPoint
      this.treeHeight = treeHeight
      this.treeWidth = treeWidth
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
      return []
    }
  
    draw(){
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
        
      })
    }
  
    clear() {
      this.lines = []
    }
  }
  
  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      trees.forEach(tree => tree.clear());
      p.clear();
      p.setup();
      p.draw();
    }
  }
  
};

const Tree2: React.FC = () => {
  return (
    <div>
      <h1>Winter Trees</h1>
      <p>10/31/24</p>
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export {mySketch}
export default Tree2;