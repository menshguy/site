import React from 'react';
import P5Wrapper from '../../components/P5Wrapper';
import p5 from 'p5';
import { Season, Leaf, Point, BoundaryPoint, Trunk } from './types';

const mySketch = (p: p5) => {

  let cw: number, ch: number;
  let bottom = 20;
  let textureImg: p5.Image;
  let debug = false;
  let colors: Record<Season, p5.Color[]>;
  let colorsSunlight: Record<Season, () => p5.Color>;;
  let bgColors: Record<Season, p5.Color>;;
  let forest: Forest;
  let season: Season;

  p.preload = () => {
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
    cw = 600;
    ch = 600;
    p.createCanvas(cw, ch);
    
    colors = {
      winter: [
        p.color(0, 0, 100),
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
        p.color(0, 0, 100),
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

    colorsSunlight = {
      winter: () => p.color(p.random(205,225), 80, 90),
      fall: () => p.color(p.random(15,50), 80, 60),
      spring: () => p.color(p.random(5,60), 75, 70),
      summer: () => p.color(p.random(100,135), 70, 95)
    }

    bgColors = {
      summer: p.color(56, 85, 91), //light yellow
      winter: p.color(208, 18, 83), //deep blue
      spring: p.color(43, 62, 90), //orange
      fall: p.color(39, 26, 73) //brown
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
    season = 'fall';
    let startCoords = {x:cw/2, y:ch-bottom};
    let forestHeight = forestHeights[season];
    let fills = colors[season];
    console.log("season", season)

    // Define Tree Trunks
    let numTrunks = p.random(15, 20);
    let numLinesPerTrunk = p.random(4,8);
    let trunkHeight = trunkHeights[season];
    let trunkWidth = p.random(p.width/10,p.width/8)
    
    // Define Leaf Settings - X points are drawing randomly in rows, X leafs are draw around the points within defined ciruclar boundary.
    let pointBoundaryRadius: { min: number; max: number };
    let numPointsPerRow: number;
    let numLeavesPerPoint: number;
    switch (season) {
      // case 'spring':
      case 'fall':
        pointBoundaryRadius = { min: 100, max: 250 };
        numPointsPerRow = p.random(p.width/100 , p.width/60); // Example values for spring
        numLeavesPerPoint = p.random(1000, 1200); // Example values for spring
        break;
      // case 'summer':
      //   pointBoundaryRadius = { min: 100, max: 220 };
      //   numPointsPerRow = p.random(p.width/100 , p.width/50); // Example values for fall
      //   numLeavesPerPoint = p.random(800, 100); // Example values for fall
      //   break;
      // case 'winter':
      //   pointBoundaryRadius = { min: 150, max: 200 };
      //   numPointsPerRow = p.random(1, 3); // Example values for winter
      //   numLeavesPerPoint = p.random(3, 5); // Example values for winter
      //   break;
    }
    let pointsStart = p.height - bottom - pointBoundaryRadius.min;
    let leafWidth = p.random(2, 3);
    let rowHeight = 30; //x points will drawn p.randominly in each row. rows increment up by this amount

    /** Create Tree */
    forest = new Forest({
      startCoords, 
      forestHeight, 
      numTrunks, 
      numLinesPerTrunk, 
      trunkHeight, 
      trunkWidth, 
      leafWidth, 
      numPointsPerRow, 
      numLeavesPerPoint, 
      rowHeight, 
      pointsStart,
      pointBoundaryRadius, 
      fills
    })
  }

  p.draw = () => {
    p.noLoop();
    p.background(bgColors[season])
    
    //Draw Ground Fill
    let groundFill = colorsSunlight[season]();
    p.fill(groundFill)
    p.noStroke()
    p.rect(0, p.height-bottom, p.width, p.height-bottom);
  
    // Draw Ground Line (on top of Ground Fill & trees)
    drawGroundLine(25, ch-bottom, cw-25, groundFill)
    
    // Draw Trees in order
    forest.trunks.forEach(trunk => drawTrunk(trunk));
    forest.leaves.forEach(leaf => drawLeaf(leaf, 0.2));
    
    // Draw Texture
    p.blendMode(p.MULTIPLY);
    p.image(textureImg, 0, 0, cw, ch);
    p.blendMode(p.BLEND); 

    // Draw SunLeavs last (so the colors are not muted by the texture)
    forest.sunLeaves.forEach(l => {
      drawSunLeaf(l)
    });
  }

  class Forest {
    midpoint: {x: number, y: number};
    trunks: any[];
    points: any[];
    leaves: any[];
    sunLeaves: any[];
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
      forestHeight, numTrunks, numLinesPerTrunk, leafWidth, numPointsPerRow, 
      numLeavesPerPoint, rowHeight, startCoords, trunkHeight, trunkWidth, pointsStart,
      pointBoundaryRadius, fills
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
      let {leaves, sunLeaves} = this.generateLeaves();
      this.leaves = leaves;
      this.sunLeaves = sunLeaves;

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
      let {forestHeight, numPointsPerRow, rowHeight, pointsStart, midpoint:m} = this;
      let points = [];
      let min_x = p.width/10;
      let max_x = p.width - (p.width/10);

      let total_h = p.height - bottom - forestHeight;
      for(let i = pointsStart; i > total_h; i-=rowHeight){

        let min_y = i;
        let max_y = i - rowHeight;
        for(let j=0; j < numPointsPerRow; j++){
          let x = p.random(min_x, max_x);
          let y = p.random(min_y, max_y);
          let boundary = this.generatePointBoundary(x, y, m.x, m.y);
          
          //Push array or points in points array
          points.push({x, y, boundary});
            
          //Draw points
          if (debug) { 
            p.fill("red");
            p.circle(x,y,5);
          }
        }

        //Increment min/max x, while making sure we dont exceed midpoint.
        let w = p.width/10;
        min_x += min_x > p.width/2 ? 0 : p.random(-w, w);
        max_x += max_x < p.width/2 ? 0 : p.random(-w, w);
      }
            
      return points;
    }

    generatePointBoundary(
      px: number, 
      py: number, 
      mx: number, 
      my: number
    ): BoundaryPoint {
      let {pointBoundaryRadius:pbr} = this
      let min = pbr.min;
      let max = pbr.max;
      let radius = p.random(min, max); 
      
      // Calculate the differences in x and y and calc angle use atan2
      let dx = mx - px;
      let dy = my - py;
      let angle = p.atan2(dy, dx);
      
      // This won't do anything, but if you want to create a gap that faces startCoords you can take the values in the comments
      let start = 0 // angle + QUARTER_PI
      let stop = p.TWO_PI // angle - QUARTER_PI
      
      return {start, stop, radius, angle};
    }

    generateLeaves(): { leaves: Leaf[], sunLeaves: Leaf[] } {
      let {leafWidth, numLeavesPerPoint, points, fills} = this;
      let leaves: Leaf[] = [];
      let sunLeaves: Leaf[] = [];
      
      // Create leaves that surround and face each point
      points.forEach(({x:px, y:py, boundary:b}: Point) => {
        let num = numLeavesPerPoint;
          
          //Create Leaves and push into array
          for (let i = 0; i < num; i++) {
            //Width and Height of leaves
            let leaf_w = p.random(leafWidth-2, leafWidth+2)
            let leaf_h = p.random(leaf_w, leaf_w+4)
            let fill_c = p.random(fills)
            
            //Angle leaf towards startCoords of its boundary
            let angle = p.random(b.start, b.stop)
            let r = p.random(0, b.radius/2)

            //If angle is in sunlight (~upper left of boundary), push into sunLeaf array
            let isSunLeaf = false;
            if (angle > p.HALF_PI + p.QUARTER_PI && angle < p.TWO_PI-p.QUARTER_PI){
              if(p.random([0,0,0,0,0,0,1])) {
                fill_c = colorsSunlight[season]();
                r = p.random(b.radius/3, b.radius/2)
                leaf_w += 1
                leaf_h += 1
                isSunLeaf = true
              }
            }
            
            //Calculate cartesian coords from polar coordinates
            let x = px + (p.cos(angle) * r);
            let isFallenLeaf = py + (p.sin(angle) * r) >= (p.height-bottom) //If py is below the ground, we flag it so we can create fallen leaves later
            let y = isFallenLeaf //If y is below bottom (ground), set to y to bottom with some variance to draw "fallen leaves"
              ? season === "summer" ? ch + 100 : p.height-bottom+p.random(0,15) // remove fallen leaves from screen in summer!
              : py + (p.sin(angle) * r);
            angle = isFallenLeaf ? p.PI : angle; //Angle fallen leaves horizonally
            
            //Create Leaf Object
            let leaf = {
              x,
              y,
              w: leaf_w,
              h: leaf_h,
              angle,
              start: angle - p.HALF_PI,
              stop: angle + p.HALF_PI,
              isSunLeaf,
              fill_c
            }

            //Push Leaf into row
            if (leaf.isSunLeaf) {
              sunLeaves.push(leaf)
            } else {
              leaves.push(leaf)
            }
            
            //Debug - Draw leaf point in Blue
            if (debug) {
              p.fill("blue")
              p.circle(x,y,leaf_w)
            }
          }
          //Decrease number of leaves per point until 5 leaf minimum
          num = num > 5 ? num - 10 : 5;
      })
      return {leaves, sunLeaves};
    }

    clear() {
      this.trunks = [];
      this.points = [];
      this.sunLeaves = [];
      this.leaves = [];
    }
  }

  function drawLeaf(leaf: Leaf, prob: number) {
    let {x, y, w, h, angle, start, stop, fill_c} = leaf;
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
      p.arc(0, 0, w, w, start-0.2, stop+0.2); //open faced arc pointing toward boundary startCoords
      p.pop();
    }
  }

  function drawSunLeaf(sunLeaf: Leaf) {
    let {x, y, w, h, angle, start: _start, stop: _stop, fill_c} = sunLeaf;
    p.push();
    p.noStroke();
    p.fill(fill_c)
    p.translate(x,y);
    p.rotate(angle);
    p.arc(0, 0, h, w, 0, p.TWO_PI);
    p.pop();
  }

  function drawTrunk(trunk: Trunk) {
    let trunkBuffer = p.createGraphics(cw, ch);
    trunk.forEach(line => {
      let {startPoint: s, controlPoints: cps, endPoint: e} = line

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

  function drawGroundLine(
    xStart: number,
    yStart: number,
    xEnd: number,
    fill_c: p5.Color
  ) {
    let x = xStart;
    const y = yStart;
    p.stroke(fill_c);
    p.strokeWeight(1);
    fill_c ? p.fill(fill_c) : p.noFill();
  
    while (x < xEnd) {
      const tickBump = p.random(-4, 0);
      const tickType = p.random(["long", "short", "long", "short", "space"]);
      let tickLength = getTickLength(tickType);
  
      if (tickType !== "space") {
        drawTick(x, y, tickLength, tickBump);
      }
  
      x += tickLength;
    }
  
    function getTickLength(type: string): number {
      switch (type) {
        case "long":
          return p.random(10, 25);
        case "short":
          return p.random(3, 10);
        case "space":
          return p.random(5, 25);
        default:
          console.error("no such line type");
          return 0;
      }
    }
  
    function drawTick(x: number, y: number, length: number, bump: number) {
      p.beginShape();
      p.vertex(x, y, 0);
      const cx1 = x + length / 2;
      const cy1 = y + bump;
      const cx2 = x + length;
      const cy2 = y;
      p.bezierVertex(x, y, cx1, cy1, cx2, cy2);
      p.endShape();
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

const FallSunlight: React.FC = () => {
  return (
    <div>
      <h1>Fall Sunlight</h1>
      {/* <p>11/7/24</p> */}
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export default FallSunlight;