import p5 from 'p5';
import {Leaf, Line} from './types.ts';

class VermontTree {
  private p: p5;
  treeHeight: number; 
  treeWidth: number; 
  numTrunkLines: number; 
  numPointsPerRow: number; 
  numLeavesPerPoint: number; 
  startPoint: { x: number; y: number }; 
  trunkHeight: number; 
  trunkWidth: number; 
  leavesStartY: number; 
  pointBoundaryRadius: { min: number, max: number }; 
  fills: () => p5.Color; 
  fillsSunlight: () => p5.Color; 
  leafWidth: number; 
  leafHeight: number;
  midpoint: {x: number, y: number};
  bulgePoint: {x: number, y: number};
  trunk: any[];
  leaves: Leaf[];
  points: any[];
  rowHeight: number;

  constructor({
    p5Instance,
    treeHeight, 
    treeWidth, 
    numTrunkLines, 
    numPointsPerRow, 
    numLeavesPerPoint, 
    startPoint, 
    trunkHeight, 
    trunkWidth, 
    leavesStartY,
    pointBoundaryRadius, 
    fills,
    fillsSunlight,
    leafWidth, 
    leafHeight,
    rowHeight,
    midpoint,
    bulgePoint
  }: {
    p5Instance: p5,
    treeHeight: number, 
    treeWidth: number, 
    numTrunkLines: number, 
    numPointsPerRow: number, 
    numLeavesPerPoint: number, 
    startPoint: { x: number, y: number }, 
    trunkHeight: number, 
    trunkWidth: number, 
    leavesStartY: number, 
    pointBoundaryRadius: { min: number, max: number }, 
    fills: () => p5.Color,
    fillsSunlight: () => p5.Color, 
    leafWidth: number, 
    leafHeight: number,
    rowHeight: number,
    midpoint: {x: number, y: number};
    bulgePoint: {x: number, y: number};
  }){
    this.p = p5Instance;
    this.treeHeight = treeHeight;  
    this.treeWidth = treeWidth;  
    this.numTrunkLines = numTrunkLines;  
    this.numPointsPerRow = numPointsPerRow;  
    this.numLeavesPerPoint = numLeavesPerPoint;  
    this.startPoint = startPoint;
    this.trunkHeight = trunkHeight;  
    this.trunkWidth = trunkWidth;  
    this.leavesStartY = leavesStartY; 
    this.pointBoundaryRadius = pointBoundaryRadius;  
    this.fills = fills;
    this.fillsSunlight = fillsSunlight;
    this.leafWidth = leafWidth;
    this.leafHeight = leafHeight;
    this.rowHeight = rowHeight;
    this.midpoint = midpoint;
    this.bulgePoint = bulgePoint;

    this.trunk = this.generateTrunk();
    this.points = this.generatePoints();
    this.leaves = this.generateLeaves();
  }

  generateTrunk() {
    let {p, numTrunkLines, startPoint, trunkHeight, trunkWidth} = this;
    // Use pre-calculated trunk widths
    let lines = [];
    for (let i = 0; i < numTrunkLines; i++) {
      let endPoint = {
        x: p.random(startPoint.x-(trunkWidth/2), startPoint.x+(trunkWidth/2)), 
        y: p.random((startPoint.y-trunkHeight) + (trunkHeight/2), startPoint.y - trunkHeight)
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
      lines.push({ startPoint, endPoint, controlPoints, initialControlPoints: [...controlPoints] })
    }
    return lines;
  }

  generatePoints(){
    let {p, treeHeight, treeWidth, rowHeight, numPointsPerRow, leavesStartY, startPoint, bulgePoint, pointBoundaryRadius, midpoint} = this;
    let points = [];
    let start_y = leavesStartY;
    let end_y = startPoint.y - treeHeight;

    let lowerHalfHeight = start_y - bulgePoint.y;
    let upperHalfHeight = bulgePoint.y - end_y;
    let numLowerRows = lowerHalfHeight / rowHeight;
    let numUpperRows = upperHalfHeight / rowHeight;
    let lowerRowIncrement = treeWidth / numLowerRows;
    let upperRowIncrement = treeWidth / numUpperRows;
    let rowWidth = lowerRowIncrement;
    
    //Lower Half -- expand row width until you reach the bulge
    // while (start_y >= bulgePoint.y) {
    //   let leafPoints = genLeafPoints(
    //     startPoint.x - (rowWidth/2),
    //     startPoint.x + (rowWidth/2),
    //     start_y, 
    //     start_y - rowHeight, 
    //     midpoint
    //   )
    //   points.push(...leafPoints)
    //   start_y -= rowHeight;
    //   rowWidth += lowerRowIncrement; 
    // }
    // Lower Half -- expand row width until you reach the bulge
    // let lowerRowIncrement = treeWidth / numLowerRows;
    let totalRows = numLowerRows;
    let accumulatedHeight = 0;

    for (let i = 0; i < totalRows; i++) {
        // Calculate the increment for start_y using a quadratic function
        let lowerRowHeightIncrement = (lowerHalfHeight * (i + 1)) / (totalRows * (totalRows + 1) / 2);

        let leafPoints = genLeafPoints(
            startPoint.x - (rowWidth / 2),
            startPoint.x + (rowWidth / 2),
            start_y,
            start_y - rowHeight,
            midpoint
        );
        points.push(...leafPoints);
        start_y -= lowerRowHeightIncrement; // Increase start_y by the calculated increment
        rowWidth += lowerRowIncrement;
        accumulatedHeight += lowerRowHeightIncrement;
    }
    // Upper Half -- reduce row width until you reach the top
    while (start_y > end_y) {
      let leafPoints = genLeafPoints(
        startPoint.x - (rowWidth/2),
        startPoint.x + (rowWidth/2),
        start_y, 
        start_y - rowHeight, 
        midpoint
      )
      points.push(...leafPoints)
      start_y -= rowHeight;
      rowWidth -= upperRowIncrement
    }

    return points;

    // Generate a point within the pointBoundary radius for each numPointsPerRow
    function genLeafPoints (
      min_x: number, 
      max_x: number, 
      min_y: number, 
      max_y: number, 
      m:{x: number, y: number}
    ) {
      let leafPoints = []
      // Clamp min_x and max_x to ensure they are within the treeWidth boundary
      min_x = Math.max(min_x, startPoint.x - (treeWidth / 2));
      max_x = Math.min(max_x, startPoint.x + (treeWidth / 2));
      for(let j=0; j < numPointsPerRow; j++){
        let x = p.random(min_x, max_x);
        let y = p.random(min_y, max_y)
        let r = pointBoundaryRadius;
        let boundary = getPointBoundary(p, r, x, y, m.x, m.y)
        let leaf = {x, y, boundary};
        leafPoints.push(leaf);
      }
      
      return leafPoints;
    }
  }

  generateLeaves() {
    let {p, leafWidth, leafHeight, startPoint, numLeavesPerPoint, points, fills, fillsSunlight} = this;
    let leaves: Leaf[] = [];
    let num = numLeavesPerPoint;
    points.forEach(({ x: px, y: py, boundary: b }) => {
      for (let i = 0; i < num; i++) {
        //Angle leaf towards startP of its boundary
        let angle = p.random(b.start, b.stop)
        let r = p.random(0, b.radius)
        let isSunLeaf = (angle > p.HALF_PI + p.QUARTER_PI && angle < p.TWO_PI-p.QUARTER_PI);
        let isFallenLeaf = py + (p.sin(angle) * r) >= (startPoint.y) //If py is below the ground, we flag it so we can create fallen leaves later
        let leaf_w, leaf_h, fill_c;
        
        // Leaf size and fill settings
        if (isSunLeaf) {
          r = p.random(b.radius/2, b.radius);
          leaf_w = leafWidth + 1;
          leaf_h = leafHeight + 1;
          fill_c = fillsSunlight();
        } else {
          //Width and Height of leaves
          leaf_w = leafWidth;
          leaf_h = leafHeight;
          fill_c = fills();
        }

        //Calculate polar coordinates
        let x = px + (p.cos(angle) * r);
        let y = isFallenLeaf //If y is below bottom (ground), set to y to bottom with some variance to draw "fallen leaves"
          ? startPoint.y + p.random(0,15) 
          : py + (p.sin(angle) * r);
        angle = isFallenLeaf ? p.HALF_PI : angle; //Angle fallen leaves horizonally
        
        //Set movement factor - will affect the speed of movement in animation
        let movementFactor: number = p.random(0.1, 1.0);

        //Create Leaf
        let leaf: Leaf = {
          x, 
          y, 
          w: leaf_w, 
          h: leaf_h, 
          angle, 
          start: angle  -p.HALF_PI, 
          stop: angle + p.HALF_PI,
          isSunLeaf,
          fill_c, 
          movementFactor
        }

        // Push Leaf into array
        leaves.push(leaf)
      }
    })
    return leaves;
  }

  clear() {
    this.leaves = []
    this.points = []
    this.trunk = []
  }
}

function drawLeaf(p: p5, leaf: Leaf) {
  let {x, y, w, h, angle, start: _start, stop: _stop, fill_c} = leaf;
  p.push();
  p.noStroke();
  p.fill(fill_c)
  p.translate(x,y);
  p.rotate(angle);

  // Dark shadow
  let d = 1;
  // Darken the fill color
  let darkenedFill = p.color(fill_c);
  darkenedFill = p.color(p.hue(darkenedFill), p.saturation(darkenedFill), p.brightness(darkenedFill) * 0.3); // Reduce brightness by 20%

  // p.fill(darkenedFill);
  // p.ellipse(0, 0, w, h)
  
  // Main Leaf
  p.fill(fill_c)
  p.ellipse(d, d, w, h)

  p.pop();
}

function drawTrunk(p: p5, lines: Line[]){
  let trunkBuffer = p.createGraphics(p.width, p.height);
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
    trunkBuffer.pop(); //Unset Styles
  })

  p.image(trunkBuffer, 0, 0)
}

function drawGroundLine(
  p: p5,
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

function darkenColors(p: p5, colors: p5.Color[], amount: number): p5.Color[] {
  return colors.map(color => {
    let h = p.hue(color);
    let s = p.saturation(color);
    let l = p.lightness(color) - amount; // Decrease lightness to darken
    return p.color(h, s, Math.max(0, l)); // Ensure lightness doesn't go below 0
  });
}

function getPointBoundary(
  p:p5,
  max_r: {min: number, max: number}, 
  px: number, 
  py: number, 
  mx: number, 
  my: number
){
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

export {VermontTree, drawLeaf, drawTrunk, drawGroundLine}