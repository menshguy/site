import p5 from 'p5';
import {Leaf, TrunkLine} from '../artwork/trees/types.ts';

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
  sunlight: {angle: number, fillPercentage: number};
  leafWidth: number; 
  leafHeight: number;
  midpoint: {x: number, y: number};
  bulgePoint: {x: number, y: number};
  trunkLines: any[];
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
    sunlight,
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
    leafWidth: number, 
    leafHeight: number,
    rowHeight: number,
    fills: () => p5.Color,
    fillsSunlight: () => p5.Color,
    sunlight?: {angle: number, fillPercentage: number},
    midpoint: {x: number, y: number},
    bulgePoint: {x: number, y: number},
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
    this.leafWidth = leafWidth;
    this.leafHeight = leafHeight;
    this.fills = fills;
    this.fillsSunlight = fillsSunlight;
    this.sunlight = sunlight || {
      angle: p5Instance.PI + p5Instance.QUARTER_PI, 
      fillPercentage: 0.5
    };
    this.rowHeight = rowHeight;
    this.midpoint = midpoint;
    this.bulgePoint = bulgePoint;

    this.trunkLines = this.generateTrunkLines();
    this.points = this.generatePoints();
    this.leaves = this.generateLeafShapes();
  }

  generateTrunkLines() {
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
    let {
      p, treeHeight, treeWidth, rowHeight, numPointsPerRow, leavesStartY, 
      startPoint, bulgePoint, pointBoundaryRadius, midpoint
    } = this;
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
    
    // Lower Half -- expand row width until you reach the bulge
    let lowerRows = numLowerRows;
    let upperRows = numUpperRows;

    for (let i = 0; i < lowerRows; i++) {
        // Calculate the increment for start_y using a quadratic function
        let lowerRowHeightIncrement = (lowerHalfHeight * (i + 1)) / (lowerRows * (lowerRows + 1) / 2);

        let leafPoints = genLeafCoordinates(
            startPoint.x - (rowWidth / 2),
            startPoint.x + (rowWidth / 2),
            start_y,
            start_y - rowHeight,
            midpoint
        );
        points.push(...leafPoints);
        start_y -= lowerRowHeightIncrement; // Increase start_y by the calculated increment
        rowWidth += lowerRowIncrement;
    }
    
    // Upper Half -- reduce row width until you reach the top
    rowWidth = treeWidth
    for (let i = 0; i < upperRows - 1; i++) {
      // Calculate the increment for start_y using a quadratic function
      let upperRowHeightIncrement = (upperHalfHeight * (upperRows - i)) / (upperRows * (upperRows + 1) / 2);

      let leafPoints = genLeafCoordinates(
        startPoint.x - (rowWidth/2),
        startPoint.x + (rowWidth/2),
        start_y, 
        start_y - rowHeight, 
        midpoint
      )
      points.push(...leafPoints)
      start_y -= upperRowHeightIncrement;
      rowWidth -= upperRowIncrement;
    }

    return points;

    // Generate a point within the pointBoundary radius for each numPointsPerRow
    function genLeafCoordinates (
      min_x: number, 
      max_x: number, 
      min_y: number, 
      max_y: number, 
      m:{x: number, y: number}
    ) {
      let leafCoords = []
      // Clamp min_x and max_x to ensure they are within the treeWidth boundary
      min_x = Math.max(min_x, startPoint.x - (treeWidth / 2));
      max_x = Math.min(max_x, startPoint.x + (treeWidth / 2));
      for(let j=0; j < numPointsPerRow; j++){
        let x = p.random(min_x, max_x);
        let y = p.random(min_y, max_y)
        let r = pointBoundaryRadius;
        let boundary = _getPointBoundary(p, r, x, y, m.x, m.y)
        let leaf = {x, y, boundary};
        leafCoords.push(leaf);
      }
      
      return leafCoords;
    }
  }

  generateLeafShapes() {
    let {p, leafWidth, leafHeight, startPoint, numLeavesPerPoint, points, fills, fillsSunlight, sunlight} = this;
    let {angle: sunlightAngle, fillPercentage} = sunlight

    let leaves: Leaf[] = [];
    points.forEach(({ x: px, y: py, boundary: b }) => {
      for (let i = 0; i < numLeavesPerPoint; i++) {
        //Angle leaf towards startP of its boundary
        let angle = p.random(b.start, b.stop)
        let r = p.random(0, b.radius)
        let isSunLeaf = _isSunLeaf(p, angle, sunlightAngle)
        let isFallenLeaf = py + (p.sin(angle) * r) >= (startPoint.y) //If py is below the ground, we flag it so we can create fallen leaves later
        let leaf_w, leaf_h, fill_c;
        
        // Leaf size and fill settings
        if (isSunLeaf) {
          leaf_w = leafWidth;
          leaf_h = leafHeight;
          fill_c = r > b.radius - (b.radius*fillPercentage) ? fillsSunlight() : fills(); //this calculates fillPercentage by only filling in leafs far enough from center
        } else {
          //Width and Height of leaves
          leaf_w = leafWidth;
          leaf_h = leafHeight;
          fill_c = fills();
        }

        //Calculate polar coordinates
        let x = px + (p.cos(angle) * r);
        let y = isFallenLeaf //If y is below bottom (ground), set to y to bottom with some variance to draw "fallen leaves"
          ? startPoint.y + p.random(0, 15) 
          : py + (p.sin(angle) * r);
        angle = isFallenLeaf ? p.HALF_PI : angle; //Angle fallen leaves horizonally
        
        //Set movement factor - will affect the speed of movement in animation (0.1 is slow, 1 is fast)
        let movementFactor: number = p.random(0.7, 0.9);
        let movementDirection: number = p.random(0, p.TWO_PI);
        
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
          movementFactor,
          movementDirection
        }

        // Push Leaf into array
        leaves.push(leaf)
      }
    })
    return leaves;

    function _isSunLeaf (p: p5, leafAngle: number, sunlightAngle: number) {
      let min = sunlightAngle - p.HALF_PI
      let max = sunlightAngle + p.HALF_PI
      return leafAngle > min && leafAngle < max;
    }
  }

  drawLeaf(p: p5, leaf: Leaf) {
    let {x, y, w, h, angle, start: _start, stop: _stop, fill_c} = leaf;
  
    p.push();
    p.noStroke();
    p.fill(fill_c)
    p.translate(x,y);
    p.rotate(angle);
  
    // Main Leaf
    p.ellipse(0, 0, w, h)
    p.pop();
  }
  
  drawTrunk(p: p5, trunkLines: TrunkLine[], customStyles: boolean){
    trunkLines.forEach(line => {
      let {startPoint:s, controlPoints:cps, endPoint:e} = line
  
      //Set Styles
      if (!customStyles) {
        p.push()
        p.stroke('black')
        p.strokeWeight(1);
        p.noFill()
      }
  
      // -- Curve Style -- //
      p.beginShape();
      p.vertex(s.x, s.y)
      p.bezierVertex(
        cps[0].x, cps[0].y,
        cps[1].x, cps[1].y,
        e.x, e.y
      )
      p.endShape();
      if (!customStyles) p.pop(); //Unset Styles
    })
  }

  clear() {
    this.leaves = []
    this.points = []
    this.trunkLines = []
  }
}





class VermontTreePerformant {
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
  sunlight: {angle: number, fillPercentage: number};
  leafWidth: number; 
  leafHeight: number;
  midpoint: {x: number, y: number};
  bulgePoint: {x: number, y: number};
  trunkLines: any[];
  // leaves: Leaf[];
  leafBuffer: p5.Graphics;
  fullTreeBuffer: p5.Graphics;
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
    sunlight,
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
    leafWidth: number, 
    leafHeight: number,
    rowHeight: number,
    fills: () => p5.Color,
    fillsSunlight: () => p5.Color,
    sunlight?: {angle: number, fillPercentage: number},
    midpoint: {x: number, y: number},
    bulgePoint: {x: number, y: number},
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
    this.leafWidth = leafWidth;
    this.leafHeight = leafHeight;
    this.fills = fills;
    this.fillsSunlight = fillsSunlight;
    this.sunlight = sunlight || {
      angle: p5Instance.PI + p5Instance.QUARTER_PI, 
      fillPercentage: 0.5
    };
    this.rowHeight = rowHeight;
    this.midpoint = midpoint;
    this.bulgePoint = bulgePoint;

    this.trunkLines = this.generateTrunkLines();
    this.points = this.generatePoints();
    this.leafBuffer = this.generateLeafBuffer();
    // this.leaves = this.generateLeafShapes();
    this.fullTreeBuffer = this.generateFullTreeBuffer();
  }

  generateTrunkLines() {
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
    let {
      p, treeHeight, treeWidth, rowHeight, numPointsPerRow, leavesStartY, 
      startPoint, bulgePoint, pointBoundaryRadius, midpoint
    } = this;
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
    
    // Lower Half -- expand row width until you reach the bulge
    let lowerRows = numLowerRows;
    let upperRows = numUpperRows;

    for (let i = 0; i < lowerRows; i++) {
        // Calculate the increment for start_y using a quadratic function
        let lowerRowHeightIncrement = (lowerHalfHeight * (i + 1)) / (lowerRows * (lowerRows + 1) / 2);

        let leafPoints = _genLeafCoordinates(
            startPoint.x - (rowWidth / 2),
            startPoint.x + (rowWidth / 2),
            start_y,
            start_y - rowHeight,
            midpoint
        );
        points.push(...leafPoints);
        start_y -= lowerRowHeightIncrement; // Increase start_y by the calculated increment
        rowWidth += lowerRowIncrement;
    }
    
    // Upper Half -- reduce row width until you reach the top
    rowWidth = treeWidth
    for (let i = 0; i < upperRows - 1; i++) {
      // Calculate the increment for start_y using a quadratic function
      let upperRowHeightIncrement = (upperHalfHeight * (upperRows - i)) / (upperRows * (upperRows + 1) / 2);

      let leafPoints = _genLeafCoordinates(
        startPoint.x - (rowWidth/2),
        startPoint.x + (rowWidth/2),
        start_y, 
        start_y - rowHeight, 
        midpoint
      )
      points.push(...leafPoints)
      start_y -= upperRowHeightIncrement;
      rowWidth -= upperRowIncrement;
    }

    return points;

    // Generate a point within the pointBoundary radius for each numPointsPerRow
    function _genLeafCoordinates (
      min_x: number, 
      max_x: number, 
      min_y: number, 
      max_y: number, 
      m:{x: number, y: number}
    ) {
      let leafCoords = []
      // Clamp min_x and max_x to ensure they are within the treeWidth boundary
      min_x = Math.max(min_x, startPoint.x - (treeWidth / 2));
      max_x = Math.min(max_x, startPoint.x + (treeWidth / 2));
      for(let j=0; j < numPointsPerRow; j++){
        let x = p.random(min_x, max_x);
        let y = p.random(min_y, max_y)
        let r = pointBoundaryRadius;
        let boundary = _getPointBoundary(p, r, x, y, m.x, m.y)
        let leaf = {x, y, boundary};
        leafCoords.push(leaf);
      }
      
      return leafCoords;
    }
  }

  generateLeafBuffer() {
    const {p, leafWidth, leafHeight, startPoint, numLeavesPerPoint, fills, fillsSunlight, sunlight} = this;
    const {angle: sunlightAngle, fillPercentage} = sunlight
    
    const point = {x: 50, y: 50, boundary: {radius: 50, start: 0, stop: p.TWO_PI}}
    const bushelBuffer: p5.Graphics = p.createGraphics(point.boundary.radius, point.boundary.radius);
    let leaves: Leaf[] = [];

    for (let i = 0; i < numLeavesPerPoint; i++) {
      //Angle leaf towards startP of its boundary
      let angle = p.random(point.boundary.start, point.boundary.stop)
      let r = p.random(0, point.boundary.radius)
      let isSunLeaf = this.getIsSunLeaf(p, angle, sunlightAngle)
      let isFallenLeaf = point.y + (p.sin(angle) * r) >= (startPoint.y) //If py is below the ground, we flag it so we can create fallen leaves later
      let leaf_w, leaf_h, fill_c;
      
      // Leaf size and fill settings
      if (isSunLeaf) {
        leaf_w = leafWidth;
        leaf_h = leafHeight;
        fill_c = r > point.boundary.radius - (point.boundary.radius * fillPercentage) ? fillsSunlight() : fills(); //this calculates fillPercentage by only filling in leafs far enough from center
      } else {
        //Width and Height of leaves
        leaf_w = leafWidth;
        leaf_h = leafHeight;
        fill_c = fills();
      }

      //Calculate polar coordinates
      let x = point.x + (p.cos(angle) * r);
      let y = isFallenLeaf ? startPoint.y + p.random(0, 15) : point.y + (p.sin(angle) * r);
      angle = isFallenLeaf ? p.HALF_PI : angle; //Angle fallen leaves horizonally
      
      //Set movement factor - will affect the speed of movement in animation (0.1 is slow, 1 is fast)
      let movementFactor: number = p.random(0.7, 0.9);
      let movementDirection: number = p.random(0, p.TWO_PI);
      
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
        movementFactor,
        movementDirection
      }

      // Push Leaf into array
      leaves.push(leaf)
    }

    // Draw Each Leaf to Buffer
    leaves.forEach(leaf => {
      bushelBuffer.push();
      bushelBuffer.noStroke();
      bushelBuffer.fill(leaf.fill_c)
      bushelBuffer.translate(leaf.x, leaf.y);
      bushelBuffer.rotate(leaf.angle);
    
      // Main Leaf
      bushelBuffer.ellipse(0, 0, leaf.w, leaf.h)
      bushelBuffer.pop();
    })

    return bushelBuffer;
  }

  generateFullTreeBuffer() {
    const {p, points} = this;
    
    const fullTreeBuffer: p5.Graphics = p.createGraphics(p.width, p.height);

    // Draw Trunk to Buffer
    this.trunkLines.forEach(line => {
      let {startPoint:s, controlPoints:cps, endPoint:e} = line

      fullTreeBuffer.push();
      fullTreeBuffer.noFill();
      fullTreeBuffer.strokeWeight(1);
      fullTreeBuffer.stroke(p.color(12, 20, 25));

      fullTreeBuffer.beginShape();
      fullTreeBuffer.vertex(s.x, s.y)
      fullTreeBuffer.bezierVertex(
        cps[0].x, cps[0].y,
        cps[1].x, cps[1].y,
        e.x, e.y
      )
      fullTreeBuffer.endShape();
      fullTreeBuffer.pop();

    })

    // Draw Leaves to Buffer
    points.forEach(({ x, y }) => {
      fullTreeBuffer.push();
      fullTreeBuffer.noStroke();
      fullTreeBuffer.translate(x, y);
      fullTreeBuffer.rotate(p.random(p.TWO_PI));
      fullTreeBuffer.image(this.leafBuffer, 0, 0);
      fullTreeBuffer.pop();
    })

    return fullTreeBuffer;

  }
  
  getIsSunLeaf (p: p5, leafAngle: number, sunlightAngle: number) {
    let min = sunlightAngle - p.HALF_PI
    let max = sunlightAngle + p.HALF_PI
    return leafAngle > min && leafAngle < max;
  }

  clear() {
    this.points = []
    this.trunkLines = []
    this.leafBuffer.clear();
    this.fullTreeBuffer.clear();
  }
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

function _getPointBoundary(
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

export {VermontTree, VermontTreePerformant,drawGroundLine, darkenColors}