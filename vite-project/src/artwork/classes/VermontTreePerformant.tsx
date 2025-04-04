import p5 from 'p5';

export type Season = 'winter' | 'fall' | 'spring' | 'summer';

export type TimeOfDay = 'day' | 'night';

export type Leaf = { 
  x: number, 
  y: number, 
  w: number, 
  h: number, 
  angle: number, 
  fill_c: p5.Color,
  isSunLeaf?: boolean, 
  movementFactor?: number,
  movementDirection?: number
}

export type Point = {
  x: number;
  y: number;
  r?: { min: number; max: number;};
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

  windSpeed: number;
  windIntensitySpeed: number;
  maxWindIntensity: number;
  windPhase: number;
  windIntensityPhase: number;

  constructor({p5Instance, startPoint, settings}: {p5Instance: p5, startPoint: { x: number, y: number },settings: VermontTreePerformantSettings}){
    this.p = p5Instance;
    this.settings = settings; 
    this.startPoint = startPoint;
    this.trunkLines = this.#generateTrunkLines();
    this.points = this.#generatePoints();

    this.leafBatchBuffer = this.#generateLeafBatchBuffer();

    this.image = this.#generateInitialImage(this.p.width, this.p.height);

    // Initialize Wind (randomized per tree for variation)
    this.windSpeed = this.p.random(0.05, 0.15);
    this.windIntensitySpeed = this.p.random(0.01, 0.03);
    this.maxWindIntensity = this.p.random(2, 6); // Max pixels to sway
    this.windPhase = this.p.random(this.p.TWO_PI); // Start at random phase
    this.windIntensityPhase = this.p.random(this.p.TWO_PI); // Start at random intensity phase
  }

  getImage() {
    return this.image
  }

  animate() {
    // Update wind phases
    this.windPhase += this.windSpeed;
    this.windIntensityPhase += this.windIntensitySpeed;
    
    // Keep phases from getting excessively large (optional, helps prevent potential floating point issues)
    this.windPhase %= this.p.TWO_PI; 
    this.windIntensityPhase %= this.p.TWO_PI;

    this.image.clear();
    
    this.#generateNextImage(this.image, true); // Pass true to indicate it's an animation frame
  }

  /**
 * Generates an image (p5.graphics) of the full tree.
 * @returns p5.Graphics
 */
  #generateInitialImage(width: number, height: number) {
    const buffer = this.p.createGraphics(width, height);
    this.#drawTreeToBuffer(buffer, false); // Draw initially without wind
    return buffer;
  }
  
  #generateNextImage(buffer: p5.Graphics, isAnimated: boolean = false) {
    buffer.clear();
    this.#drawTreeToBuffer(buffer, isAnimated); // Redraw with current state
  }
  
  #drawTreeToBuffer(buffer: p5.Graphics, isAnimated: boolean = false) {
    const {p, points, settings: {trunkSettings}} = this;
    const {includeTrunk = true} = trunkSettings;
    
    // Draw Trunk to Buffer
    if (includeTrunk) {
      this.trunkLines.forEach(line => {
        let {startPoint:s, controlPoints:cps, endPoint:e} = line

        buffer.push();
        buffer.noFill();
        buffer.strokeWeight(0.5);
        buffer.stroke(p.color(12, 20, 25));

        buffer.beginShape();
        buffer.vertex(s.x, s.y)
        buffer.bezierVertex(
          cps[0].x, cps[0].y,
          cps[1].x, cps[1].y,
          e.x, e.y
        )
        buffer.endShape();
        buffer.pop();
      })
    }

    // Draw Leaves to Buffer
    points.forEach(({ x, y, r }) => {
      const padding = r ? r.max : 0
      let windSwayX = 0;
      
      if (isAnimated) {
        // Calculate current max intensity (oscillates between 0 and maxWindIntensity)
        // (sin returns -1 to 1, map to 0 to 1, then scale)
        const intensityFactor = (this.p.sin(this.windIntensityPhase) + 1) / 2; 
        const currentMaxIntensity = this.maxWindIntensity * intensityFactor;
        
        // Calculate current sway offset (oscillates between -currentMaxIntensity and +currentMaxIntensity)
        windSwayX = this.p.sin(this.windPhase) * currentMaxIntensity;
        
        // Optional: Make higher points sway slightly more
        const heightFactor = this.p.map(y, this.startPoint.y - this.settings.treeSettings.treeHeight, this.startPoint.y, 0.8, 1.2);
        windSwayX *= heightFactor; 
      }
      
      buffer.push();
      buffer.noStroke();
      buffer.translate(x - padding + windSwayX, y - padding); // Apply wind sway to the translation
      const leafX = 0 
      const leafY = 0
      buffer.image(this.leafBatchBuffer, leafX, leafY);
      buffer.pop();
    })

    return buffer;
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
    let {startPoint, settings} = this
    let {
      treeSettings: {treeHeight, treeWidth, bulgePoint },
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
  ) {
    let leafCoords: Point[] = []; // Type the array
    // Clamp min_x and max_x to ensure they are within the treeWidth boundary
    min_x = Math.max(min_x, startPoint.x - (treeWidth / 2));
    max_x = Math.min(max_x, startPoint.x + (treeWidth / 2));
    
    for(let j=0; j < numPointsPerRow; j++){
      let x = this.p.random(min_x, max_x);
      let y = this.p.random(min_y, max_y);
      let r = pointBoundaryRadius;
      let leaf = {x, y, r}; 
      leafCoords.push(leaf);
    }
    
    return leafCoords;
  }

  #generateLeafBatchBuffer() {
    const {p, settings: {lightSettings, leafSettings, palette}} = this;
    const {leafWidth, leafHeight, numLeavesPerPoint, pointBoundaryRadius} = leafSettings; // Get radius settings
    const {lightAngle, lightFillPercentage = 0.3} = lightSettings || {}; // Default light settings if needed
    
    // *** CHANGE: Determine buffer size and center based on max radius ***
    const maxRadius = pointBoundaryRadius.max;
    const bufferSize = maxRadius * 2; // Buffer needs to be diameter x diameter
    const bufferCenter = maxRadius; // Center coordinate within the buffer
    
    const bushelBuffer: p5.Graphics = p.createGraphics(bufferSize, bufferSize);
    let leaves: Leaf[] = []; // Assuming Leaf type is defined

    for (let i = 0; i < numLeavesPerPoint; i++) {
      // *** CHANGE: Scatter leaves within the maxRadius ***
      let angle = p.random(p.TWO_PI);
      let r = p.random(0, maxRadius); // Use maxRadius for scattering range
      
      // isSunLeaf calculation - ensure lightAngle is defined
      let currentLightAngle = lightAngle !== undefined ? lightAngle : p.PI; // Default if undefined
      let isSunLeaf = lightAngle !== undefined ? this.#isSunLeaf(p, angle, currentLightAngle) : true; // Default to true if no light angle

 
      
      let leaf_w, leaf_h, fill_c;
      const baseColor = palette.base || p.color(120, 60, 70); // Default colors
      const highlightColor = palette.highlight || palette.base || p.color(100, 70, 80);
      
      // Leaf size and fill settings
      if (isSunLeaf) {
        leaf_w = leafWidth;
        leaf_h = leafHeight;
        // Highlight leaves further from the center (adjust logic as needed)
        fill_c = r > maxRadius * (1 - lightFillPercentage) ? highlightColor : baseColor; 
      } else {
        leaf_w = leafWidth;
        leaf_h = leafHeight;
        fill_c = baseColor;
      }

      // *** CHANGE: Calculate coordinates relative to buffer center ***
      let x = bufferCenter + (p.cos(angle) * r);
      let y = bufferCenter + (p.sin(angle) * r);

      // Fallen leaf check needs context outside the buffer - remove or adapt if needed
      // let isFallenLeaf = y >= startPoint.y; // This doesn't make sense for a generic buffer
      // angle = isFallenLeaf ? p.HALF_PI : angle; // Remove fallen leaf logic for buffer
      
      // Movement factor might be applied later during animation, not needed in static buffer
      // let movementFactor: number = p.random(0.7, 0.9);
      // let movementDirection: number = p.random(0, p.TWO_PI);
      
      //Create Leaf
      let leaf: Leaf = {
        x, 
        y, 
        w: leaf_w, 
        h: leaf_h, 
        angle: angle, // Store the angle used for potential rotation
        fill_c, 
        isSunLeaf, // Store for potential later use
        // movementFactor,
        // movementDirection
      };

      leaves.push(leaf);
    }

    // Draw Each Leaf to Buffer
    bushelBuffer.push(); // Isolate buffer drawing state
    bushelBuffer.noStroke();
    leaves.forEach(leaf => {
       bushelBuffer.fill(leaf.fill_c);
       bushelBuffer.ellipse(leaf.x, leaf.y, leaf.w, leaf.h); 
    });
    bushelBuffer.pop(); // Restore buffer state

    return bushelBuffer;
  }
  
  #isSunLeaf (p: p5, leafAngle: number, sunlightAngle: number) {
    let min = sunlightAngle - p.HALF_PI
    let max = sunlightAngle + p.HALF_PI
    return leafAngle > min && leafAngle < max;
  }

  // #getPointBoundary(p: p5, max_r: {min: number, max: number}, px: number, py: number, mx: number, my: number) {
  //   let min = max_r.min;
  //   let max = max_r.max;
  //   let radius = p.random(min, max); 
    
  //   // Calculate the differences in x and y and calc angle us atan2
  //   let dx = mx - px;
  //   let dy = my - py;
  //   let angle = p.atan2(dy, dx);
    
  //   // This won't do anything, but if you want to create a gap that faces startP you can take the values in the comments
  //   let start = 0 // angle + QUARTER_PI
  //   let stop = p.TWO_PI // angle - QUARTER_PI
    
  //   return {start, stop, angle, radius};
  // }

  clear() {
    this.points = []
    this.trunkLines = []
    this.leafBatchBuffer.clear();
    this.image.clear();
  }

}