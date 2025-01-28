import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import p5 from 'p5';
import {Leaf, TrunkLine} from './types.ts';


const mySketch = (p: p5) => {
  let cw: number, ch: number;
  let bottom = 20;
  let debug = false;
  let fallColorFills: p5.Color[];
  let textureImg: p5.Image;
  
  p.preload = () => {
    textureImg = p.loadImage('/textures/watercolor_1.jpg');
  }
  
  p.setup = () => {
    p.colorMode(p.HSL);
    cw = 600;
    ch = 600;
    p.createCanvas(cw, ch);
  
    fallColorFills = [
      p.color('white'),
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
    ];
  }
  
  p.draw = () => {
    // background(38, 92, 67)
    // background(180, 70, 90) //light blue
    // background(330, 34, 96) //pink
    p.background(43, 62, 90) //orange
    p.noLoop();
  
    /** General Settings */
    let startCoords = {x: cw/2, y: ch-bottom};
    let forestHeight = p.random(ch/4,ch-ch/3);

    // Trunks:
    let numTrunks = p.random(15, 20);
    let numLinesPerTrunk = p.random(4,8);
    let trunkHeight = p.random(100, forestHeight + 20);
    let trunkWidth = p.random(p.width/12, p.width/10)

    // Leaves:
    let pointBoundaryRadius = {min: 70, max:200};
    let pointsStart = p.height - bottom - pointBoundaryRadius.min;
    let numPointsPerRow = p.random(p.width/100 , p.width/60);
    let numLeavesPerPoint = p.random(1000, 1200); // # of leaves around each leaf point
    let leafWidth = p.random(2, 3);
    let rowHeight = 30; //x points will drawn randominly in each row. rows increment up by this amount
     
    /** Create Tree */
    let forest = new Forest({
      forestHeight, 
      numTrunks, 
      numLinesPerTrunk, 
      leafWidth,
      numPointsPerRow, 
      numLeavesPerPoint, 
      rowHeight, 
      startCoords, 
      trunkHeight, 
      trunkWidth, 
      pointsStart,
      pointBoundaryRadius, 
      fills: fallColorFills
    })

    //Draw Ground Fill
    let groundFill = fallColorFills[3]
    
    //Draw Ground Squiggly (on top of Ground Fill & trees)
    drawGroundLine(25, ch-bottom, cw-25, groundFill)
    
    //Draw Trees in order
    forest.trunks.forEach(trunk => drawTrunk(trunk));
    forest.leaves.forEach(row => row.forEach((leaf: Leaf) => {
      drawLeaf(leaf, 0.2, p.random(fallColorFills))
    }));
    
    //Draw Texture
    p.blendMode(p.MULTIPLY);
    p.image(textureImg, 0, 0, cw, ch);
    p.blendMode(p.BLEND); 
  }
  
  class Forest {
    midpoint: {x: number, y: number};
    trunks: any[];
    points: any[];
    leaves: any[];
    sunLeaves?: any[];
    forestHeight: number;
    numTrunks: number;
    numLinesPerTrunk: number;
    leafWidth: number;
    numPointsPerRow: number;
    numLeavesPerPoint: number;
    rowHeight: number;
    startCoords: {x: number, y: number};
    trunkHeight: number;
    trunkWidth: number;
    pointsStart: number;
    pointBoundaryRadius: {min: number, max: number};
    fills: any[];

    constructor({
      forestHeight, 
      numTrunks, 
      numLinesPerTrunk, 
      leafWidth, 
      numPointsPerRow, 
      numLeavesPerPoint, 
      rowHeight, 
      startCoords, 
      trunkHeight, 
      trunkWidth, 
      pointsStart,
      pointBoundaryRadius, 
      fills, 
    }: {
      forestHeight: number;
      numTrunks: number;
      numLinesPerTrunk: number;
      leafWidth: number;
      numPointsPerRow: number;
      numLeavesPerPoint: number;
      rowHeight: number;
      startCoords: { x: number; y: number };
      trunkHeight: number;
      trunkWidth: number;
      pointsStart: number;
      pointBoundaryRadius: { min: number; max: number };
      fills: p5.Color[];
    }){
      this.forestHeight = forestHeight;
      this.numTrunks = numTrunks; 
      this.numLinesPerTrunk = numLinesPerTrunk;
      this.leafWidth = leafWidth;
      this.numPointsPerRow = numPointsPerRow;
      this.numLeavesPerPoint = numLeavesPerPoint; 
      this.rowHeight = rowHeight;
      this.startCoords = startCoords;
      this.trunkHeight = trunkHeight;
      this.trunkWidth = trunkWidth;
      this.pointsStart = pointsStart;
      this.pointBoundaryRadius = pointBoundaryRadius; 
      this.fills = fills;
      this.midpoint = {x: startCoords.x ,y: startCoords.y - forestHeight/2}
      this.trunks = this.generateTrunks();
      this.points = this.generatePoints();
      this.leaves = this.generateLeaves();
  
      if (debug){
        p.fill("yellow")
        p.circle(this.midpoint.x, p.height - bottom - forestHeight,20)
        p.fill("pink")
        p.circle(this.midpoint.x, this.midpoint.y,20)
        p.fill("red")
        p.circle(this.startCoords.x, this.startCoords.y,20)
      }
    }
  
    generateTrunks() {
      let {numTrunks, numLinesPerTrunk, trunkHeight, trunkWidth} = this;
      
      let trunks = []
      for (let j = 0; j < numTrunks; j++) {
        let lines = [];
        let startPoint = {
          x: p.random(p.width/10, p.width - (p.width/10)),
          y: p.height - bottom
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
      let {forestHeight, numPointsPerRow, rowHeight, pointsStart, midpoint:m} = this;
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
  
        // Find the point with the smallest and largest x value in the row
        // let minPoint = row.reduce((min, p) => p.x < min.x ? p : min, row[0]);
        // if (minPoint) minPoint.isLeftMost = true;
        // let maxPoint = row.reduce((max, p) => p.x > max.x ? p : max, row[0]);
        // if (maxPoint) maxPoint.isRightMost = true;
  
        //Push array or points in points array
        points.push(row)
  
        //Increment min/max x, while making sure we dont exceed midpoint. Otherwise, you will just start an inverted triange shape and end up with an hour glass
        min_x += min_x > p.width/2 ? 0 : p.random(-(p.width/10), (p.width/10)*1.5)
        max_x += max_x < p.width/2 ? 0 : p.random(-(p.width/10), (p.width/10)*1.5)
      }
            
      return points;
    }
    
    generatePointBoundary(px: number, py: number, mx: number, my: number) {
      let {pointBoundaryRadius: pbr} = this;
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
      
      return {start, stop, radius, angle};
    }
  
    generateLeaves() {
      let {leafWidth, numLeavesPerPoint, points} = this;
      let leaves: any[] = [];
  
      // Create leaves that surround and face each point
      points.forEach(row => {
        let num = numLeavesPerPoint;
        row.forEach(({x: px, y: py, boundary: b}: {x: number, y: number, boundary: any}) => {
          //Create Leaves and push into row
          let row = []
          for (let i = 0; i < num; i++) {
            //Width and Height of leaves
            let leaf_w = p.random(leafWidth-2,leafWidth+2)
            let leaf_h = p.random(leaf_w,leaf_w+4)
            
            //Angle leaf towards center of its boundary
            let angle = p.random(b.start, b.stop)
            let r = p.random(0, b.radius/2) 
            
            //Calculate polar coordinates
            let isFallenLeaf = py + (p.sin(angle) * r) >= (p.height-bottom) //If py is below the ground, we flag it so we can create fallen leaves later
            let x = px + (p.cos(angle) * r);
            let y = isFallenLeaf //If y is below bottom (ground), set to y to bottom with some variance to draw "fallen leaves"
              ? p.height - bottom + p.random(0,15) 
              : py + (p.sin(angle) * r);
            angle = isFallenLeaf ? p.PI : angle; //Angle fallen leaves horizonally
              
            //Push Leaf into row
            row.push({x, y, w:leaf_w, h:leaf_h, angle, start:angle - p.HALF_PI, stop:angle + p.HALF_PI })
            
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
      this.leaves = []
    }
  }
  
  function drawLeaf(leaf: Leaf, probability:number, fill_c: p5.Color) {
    let {x, y, w, h, angle, start, stop} = leaf
    let typeOfLeaf = p.random(0,1) > probability ? "full" : "outline";
    
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
  
  function drawTrunk(tree: TrunkLine[]){
    let trunkBuffer = p.createGraphics(cw, ch);
    tree.forEach((line: TrunkLine) => {
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
  
  function drawGroundLine(xStart: number, yStart: number, xEnd: number, fill_c: p5.Color) {
    let x = xStart;
    let y = yStart;
    p.stroke(fill_c);
    p.strokeWeight(1);
    fill_c ? p.fill(fill_c) : p.noFill()
    
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
  
  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      p.setup();
      p.clear();
      p.redraw();
    }
  }
};

const Tree5: React.FC = () => {
  return (
    <div>
      <h1> Tree Sketch </h1>
      <p>11/7/24</p>
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export {mySketch}
export default Tree5;