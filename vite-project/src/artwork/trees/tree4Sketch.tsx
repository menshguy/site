import p5 from 'p5';
import {Leaf, TrunkLine, Point} from './types.ts';

const mySketch = (p: p5) => {
  let cw: number, ch: number;
  let bottom = 100;
  let drawControls = false;
  
  p.setup = () => {
    cw = 600;
    ch = 600;
    p.createCanvas(cw, ch);
  }
  
  p.draw = () => {
    p.colorMode(p.HSL);
    p.background(38, 59, 87)
    p.noLoop();
  
    let trees = [];
    let numTrees = p.random(3,7)
    let center = {x:cw/2, y:ch-bottom}
    
    for (let i = 0; i < numTrees; i++) {
      let numLines = p.floor(p.random(5,21));
      let startPoint = {x: p.random(center.x-(cw/2 - 100), center.x+(cw/2 - 100)), y: center.y};
      let treeHeight = p.random(100,200);
      let treeWidth = p.random(100,200)
      let tree = new Tree({numLines, startPoint, treeHeight, treeWidth})
      trees.push(tree)
    }
    
    //Draw Trees
    p.stroke(5, 42, 12);
    p.strokeWeight(2);
    p.noFill()
    trees.forEach(tree => {
      tree.drawTree();
      tree.drawLeaves();
    }); 
  
    //Draw Base TrunkLine
    p.stroke(5, 42, 12);
    p.strokeWeight(1);
    drawBaseLine(100, ch-bottom, cw-100)
  }
  
  function drawBaseLine(xStart: number, y: number, xEnd: number) {
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
    lines: TrunkLine[];
    numLines: number;
    startPoint: { x: number, y: number };
    treeHeight: number;
    treeWidth: number;
    leaves: Leaf[];

    constructor({
      numLines, 
      startPoint, 
      treeHeight, 
      treeWidth
    }: {
      numLines: number, 
      startPoint: {x: number, y: number}, 
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
      let leaves = [];
      let radius = p.random(125, 150);
      let numCircles = 900;
      for (let i = 0; i < numCircles; i++) {
        let angle = p.random(-p.PI, p.PI);
        let r = p.sqrt(p.random(0,0.5)) * radius;
        let x = p.cos(angle) * r;
        let y = p.sin(angle) * r;
        let angleToCenter = p.atan2(y, x);
    
        let w = p.random(10,20);
        let h = p.random(10,20);
        let fill_c = p.random([
          p.color(44, 59, 77), 
          p.color(35, 45, 47),
          p.color(19, 66, 66),
          p.color(86, 38, 55)
        ]);
    
        leaves.push({x, y, w, h, start: angleToCenter - p.HALF_PI, stop: angleToCenter + p.HALF_PI, angle, fill_c});
      }
      return leaves;
    }
  
    drawLeaves() {
      let {startPoint, treeHeight} = this;
  
      p.stroke("black");
      p.strokeWeight(1);
      p.fill
  
      // Draw everything within a push-pop block to apply rotation to this block only
      p.push();
      p.translate(startPoint.x, startPoint.y-(bottom/2)-(treeHeight));
      p.rotate(p.radians(-90));
  
      this.leaves.forEach( (leaf: Leaf) => {
        let {x, y, w, h, start, stop} = leaf
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
          controlPoints.forEach((point: Point) => {
            p.point(point.x, point.y)
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
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      p.setup();
      p.clear();
      p.redraw();
    }
  }
};

export default mySketch;