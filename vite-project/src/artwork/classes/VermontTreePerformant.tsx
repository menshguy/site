import p5 from 'p5';

export type Season = 'winter' | 'fall' | 'spring' | 'summer';

export type TimeOfDay = 'day' | 'night';

export type Leaf = { 
  x: number, 
  y: number, 
  w: number, 
  h: number, 
  angle: number, 
  start: number, 
  stop: number, 
  fill_c: p5.Color,
  isSunLeaf?: boolean, 
  movementFactor?: number,
  movementDirection?: number
}

export type Point = {
  x: number;
  y: number;
  boundary?: {
    start: number;
    stop: number;
    radius: number;
    angle: number;
  };
};

export type BoundaryPoint = {
  start: number;
  stop: number;
  radius: number;
  angle: number;
};

export type Trunk = { 
  startPoint: { x: number, y: number }, 
  controlPoints: { x: number, y: number }[], 
  endPoint: { x: number, y: number } 
}[]

export type TrunkLine = {
  startPoint: Point, 
  controlPoints: Point[],
  initialControlPoints?: Point[],
  endPoint: Point,
  isDragging?: {i: number} | false
}

export type TreeColorPalette = {
  base: p5.Color;
  highlight: p5.Color;
  shadow: p5.Color;
};

export type VermontTreePerformantSettings = {
  palette: TreeColorPalette;
  treeSettings: {
    treeHeight: number, 
    treeWidth: number, 
    midpoint: {x: number, y: number},
    bulgePoint: {x: number, y: number},
  },
  trunkSettings: {
    includeTrunk?: boolean,
    numTrunkLines: number, 
    trunkHeight: number,
    trunkWidth: number, 
  },
  leafSettings: {
    leavesStartY: number, 
    numPointsPerRow: number, 
    numLeavesPerPoint: number, 
    pointBoundaryRadius: {min: number, max: number},
    rowHeight: number,
    leafWidth: number, 
    leafHeight: number,
  },
  lightSettings: {
    lightAngle: number,
    lightFillPercentage: number,
  },
}

export class VermontTreePerformant {
  p: p5;
  startPoint: {x: number, y: number};
  settings: VermontTreePerformantSettings;

  trunkLines: TrunkLine[];
  points: Point[];
  leafBatchBuffer: p5.Graphics;
  image: p5.Graphics;

  constructor({p5Instance, startPoint, settings}: {p5Instance: p5, startPoint: { x: number, y: number },settings: VermontTreePerformantSettings}){
    this.p = p5Instance;
    this.settings = settings; 
    this.startPoint = startPoint;

    this.trunkLines = this.#generateTrunkLines();
    this.points = this.#generatePoints();
    this.leafBatchBuffer = this.#generateLeafBatchBuffer();
    // this.leaves = this.generateLeafShapes();

    this.image = this.#generateImage();
  }

  draw(buffer: p5.Graphics | p5) {
    buffer.push()
    buffer.image(this.image, 0, 0);
    buffer.pop()
  }

  #generateTrunkLines() {
    let {p, startPoint, settings: {trunkSettings: {numTrunkLines, trunkHeight, trunkWidth}}} = this;

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

  #generatePoints(){
    let {p, startPoint, settings} = this
    let {
      treeSettings: {treeHeight, treeWidth, midpoint, bulgePoint },
      leafSettings: {rowHeight, leavesStartY, numPointsPerRow, pointBoundaryRadius},
    } = settings;
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

        let leafPoints = this.#genLeafCoordinates(
            startPoint,
            treeWidth,
            numPointsPerRow,
            pointBoundaryRadius,
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

      let leafPoints = this.#genLeafCoordinates(
        startPoint,
        treeWidth,
        numPointsPerRow,
        pointBoundaryRadius,
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

    
  }

  // Generate a point within the pointBoundary radius for each numPointsPerRow
  #genLeafCoordinates (
    startPoint: {x: number, y: number},
    treeWidth: number,
    numPointsPerRow: number,
    pointBoundaryRadius: {min: number, max: number},
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
      let x = this.p.random(min_x, max_x);
      let y = this.p.random(min_y, max_y)
      let r = pointBoundaryRadius;
      let boundary = this.#getPointBoundary(this.p, r, x, y, m.x, m.y)
      let leaf = {x, y, boundary};
      leafCoords.push(leaf);
    }
    
    return leafCoords;
  }

  #generateLeafBatchBuffer() {
    const {p, startPoint, settings: {lightSettings, leafSettings, palette}} = this;
    const {leafWidth, leafHeight, numLeavesPerPoint} = leafSettings
    const {lightAngle, lightFillPercentage} = lightSettings
    
    const point = {x: 50, y: 50, boundary: {radius: 50, start: 0, stop: p.TWO_PI}}
    const bushelBuffer: p5.Graphics = p.createGraphics(point.boundary.radius, point.boundary.radius);
    let leaves: Leaf[] = [];

    for (let i = 0; i < numLeavesPerPoint; i++) {
      //Angle leaf towards startP of its boundary
      let angle = p.random(point.boundary.start, point.boundary.stop)
      let r = p.random(0, point.boundary.radius)
      let isSunLeaf = this.#isSunLeaf(p, angle, lightAngle)
      let isFallenLeaf = point.y + (p.sin(angle) * r) >= (startPoint.y) //If py is below the ground, we flag it so we can create fallen leaves later
      let leaf_w, leaf_h, fill_c;
      
      // Leaf size and fill settings
      if (isSunLeaf) {
        leaf_w = leafWidth;
        leaf_h = leafHeight;
        fill_c = r > point.boundary.radius - (point.boundary.radius * lightFillPercentage) ? palette.highlight : palette.base; //this calculates fillPercentage by only filling in leafs far enough from center
      } else {
        //Width and Height of leaves
        leaf_w = leafWidth;
        leaf_h = leafHeight;
        fill_c = palette.base;
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

  /**
   * Generates an image (p5.graphics) of the full tree.
   * @returns p5.Graphics
   */
  #generateImage() {
    const {p, points, settings: {trunkSettings}} = this;
    const {includeTrunk = true} = trunkSettings;
    
    const fullTreeBuffer: p5.Graphics = p.createGraphics(p.width, p.height);

    // Draw Trunk to Buffer
    if (includeTrunk) {
      this.trunkLines.forEach(line => {
        let {startPoint:s, controlPoints:cps, endPoint:e} = line

        fullTreeBuffer.push();
        fullTreeBuffer.noFill();
        fullTreeBuffer.strokeWeight(0.5);
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
    }

    // Draw Leaves to Buffer
    points.forEach(({ x, y, boundary }) => {
      fullTreeBuffer.push();
      fullTreeBuffer.noStroke();
      fullTreeBuffer.translate(x - boundary.radius, y - boundary.radius);
      // fullTreeBuffer.rotate(p.random(p.TWO_PI)); // Can't rotate it because the light direction is backed in
      const leafX = 0 
      const leafY = 0
      fullTreeBuffer.image(this.leafBatchBuffer, leafX, leafY);
      fullTreeBuffer.pop();
    })

    return fullTreeBuffer;

  }
  
  #isSunLeaf (p: p5, leafAngle: number, sunlightAngle: number) {
    let min = sunlightAngle - p.HALF_PI
    let max = sunlightAngle + p.HALF_PI
    return leafAngle > min && leafAngle < max;
  }

  #getPointBoundary(p: p5, max_r: {min: number, max: number}, px: number, py: number, mx: number, my: number) {
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

  clear() {
    this.points = []
    this.trunkLines = []
    this.leafBatchBuffer.clear();
    this.fullTreeBuffer.clear();
  }

}