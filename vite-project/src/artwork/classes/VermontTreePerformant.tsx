import p5 from 'p5';

export type Season = 'winter' | 'fall' | 'spring' | 'summer';

export type TimeOfDay = 'day' | 'night';

export type Leaf = { 
  x: number, 
  y: number, 
  w: number, 
  h: number, 
  angle: number, 
  fill: p5.Color,
  isSunLeaf?: boolean, 
  movementFactor?: number,
  movementDirection?: number,
  isEdgeLeaf?: boolean,
  hasOutline?: boolean
}

export type Point = {
  x: number;
  y: number;
  r?: { min: number; max: number;};
  windPhaseOffset?: number;
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
  windSettings?: {
    windSpeed?: number,           // How fast the wind phase changes (oscillation speed)
    windIntensitySpeed?: number,  // How fast the wind intensity changes
    maxWindIntensity?: number,    // Maximum pixels trees can sway
    windPhase?: number,           // Starting phase of wind oscillation
    windIntensityPhase?: number,  // Starting phase of wind intensity oscillation
    windVariance?: number,        // How much variance in wind effect between trees (0-1)
  }
}

export class VermontTreePerformant {
  p: p5;
  settings: VermontTreePerformantSettings;
  startPoint: Point;
  points: Point[];
  trunkLines: TrunkLine[];
  image: p5.Graphics;
  leafBushelBuffer: p5.Graphics;
  
  // Wind properties
  windSpeed: number;
  windIntensitySpeed: number;
  maxWindIntensity: number;
  windPhase: number;
  windIntensityPhase: number;
  windVariance: number;
  treeWindOffset: number; // Unique wind offset for this tree
  
  constructor({p5Instance, startPoint, settings}: {p5Instance: p5, startPoint: Point, settings: VermontTreePerformantSettings}){
    this.p = p5Instance;
    this.settings = settings;
    this.startPoint = startPoint;
    
    // Initialize wind properties
    const windSettings = settings.windSettings || {};
    this.windSpeed = windSettings.windSpeed !== undefined ? 
      windSettings.windSpeed : 0.05;
    this.windIntensitySpeed = windSettings.windIntensitySpeed !== undefined ? 
      windSettings.windIntensitySpeed : 0.02;
    this.maxWindIntensity = windSettings.maxWindIntensity !== undefined ? 
      windSettings.maxWindIntensity : 5;
    this.windVariance = windSettings.windVariance !== undefined ? 
      windSettings.windVariance : 0.3; // Default variance of 0.3
    
    // Create a unique wind offset for this tree
    this.treeWindOffset = this.p.random(this.p.TWO_PI);
    
    // Initialize wind phases (either from settings or random)
    this.windPhase = windSettings.windPhase !== undefined ? 
      windSettings.windPhase : this.p.random(this.p.TWO_PI);
    this.windIntensityPhase = windSettings.windIntensityPhase !== undefined ? 
      windSettings.windIntensityPhase : this.p.random(this.p.TWO_PI);
    
    this.trunkLines = this.#generateTrunkLines();
    this.points = this.#generatePoints();

    this.leafBushelBuffer = this.#drawLeafBushelBuffer();

    this.image = this.#generateInitialImage(this.p.width, this.p.height);
  }

  /**
   * Returns the current tree image.
   * @returns p5.Graphics
   */
  getImage() {
    return this.image;
  }

  /**
   * Updates the tree image with the current state of the tree.
   * @returns void
   */
  animate() {
    // Update wind phases - ensure we're using the full cycle for proper left-to-right movement
    this.windPhase += this.windSpeed;
    this.windIntensityPhase += this.windIntensitySpeed;
    
    // Keep phases within reasonable bounds to prevent floating point issues
    if (this.windPhase > this.p.TWO_PI) {
      this.windPhase -= this.p.TWO_PI;
    }
    if (this.windIntensityPhase > this.p.TWO_PI) {
      this.windIntensityPhase -= this.p.TWO_PI;
    }
    
    this.#generateNextImage(this.image, true); // Pass true to indicate it's an animation frame
  }

  #generateInitialImage(width: number, height: number) {
    const buffer = this.p.createGraphics(width, height);
    this.#drawTreeToTreeBuffer(buffer, false); // Draw initially without wind
    return buffer;
  }
  
  #generateNextImage(buffer: p5.Graphics, isAnimated: boolean = false) {
    buffer.clear();
    this.#drawTreeToTreeBuffer(buffer, isAnimated); // Redraw with current state
    return buffer;
  }
  
  #drawTreeToTreeBuffer(buffer: p5.Graphics, isAnimated: boolean = false) {
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
    points.forEach(({ x, y, windPhaseOffset }) => {
      let windSwayX = 0;
      
      if (isAnimated) {
        // Calculate current max intensity (oscillates between 0 and maxWindIntensity)
        const intensityFactor = (this.p.sin(this.windIntensityPhase) + 1) / 2; 
        const currentMaxIntensity = this.maxWindIntensity * intensityFactor;
        
        // Apply tree-specific wind variance
        const treeVarianceFactor = this.p.map(
          this.p.sin(this.windPhase + this.treeWindOffset), 
          -1, 1, 
          1 - this.windVariance, 1 + this.windVariance
        );
        
        // Calculate current sway offset with variance
        const phaseOffset = windPhaseOffset ?? 0;
        windSwayX = this.p.sin(this.windPhase + phaseOffset) * currentMaxIntensity * treeVarianceFactor; 
        
        // Make higher points sway slightly more
        const heightFactor = this.p.map(y, this.startPoint.y - this.settings.treeSettings.treeHeight, this.startPoint.y, 1, 0.5);
        windSwayX *= heightFactor; 
      }
      
      buffer.push();
      buffer.noStroke();
      // Center the leaf bushel buffer on the point coordinates
      const bufferSize = this.leafBushelBuffer.width;
      buffer.translate(x + windSwayX, y); // Apply wind sway to the translation
      buffer.image(this.leafBushelBuffer, -bufferSize/2, -bufferSize/2);
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
    
    // Ensure we don't exceed the tree height boundary
    let start_y = leavesStartY;
    let end_y = startPoint.y - treeHeight;
    
    // Calculate the tree's visual boundaries
    const treeLeft = startPoint.x - (treeWidth / 2);
    const treeRight = startPoint.x + (treeWidth / 2);
    
    let lowerHalfHeight = start_y - bulgePoint.y;
    let upperHalfHeight = bulgePoint.y - end_y;
    let numLowerRows = lowerHalfHeight / rowHeight;
    let numUpperRows = upperHalfHeight / rowHeight;
    
    // Ensure we respect the tree width at each row
    let lowerRowIncrement = treeWidth / numLowerRows;
    let upperRowIncrement = treeWidth / numUpperRows;
    let rowWidth = lowerRowIncrement;
    
    // Lower Half -- expand row width until you reach the bulge
    let lowerRows = numLowerRows;
    let upperRows = numUpperRows;

    for (let i = 0; i < lowerRows; i++) {
        // Calculate the increment for start_y using a quadratic function
        let lowerRowHeightIncrement = (lowerHalfHeight * (i + 1)) / (lowerRows * (lowerRows + 1) / 2);

        // Ensure row width doesn't exceed tree width
        const currentRowWidth = Math.min(rowWidth, treeWidth);
        
        // Calculate row boundaries, ensuring they stay within tree width
        const rowLeft = Math.max(treeLeft, startPoint.x - (currentRowWidth / 2));
        const rowRight = Math.min(treeRight, startPoint.x + (currentRowWidth / 2));
        const rowTop = start_y - lowerRowHeightIncrement;
        const rowBottom = start_y;

        let leafPoints = this.#genLeafCoordinates(
            startPoint,
            treeWidth,
            numPointsPerRow,
            pointBoundaryRadius,
            rowLeft,
            rowRight,
            rowBottom,
            rowTop
        );
        points.push(...leafPoints);
        start_y = rowTop; // Update start_y for next row
        rowWidth += lowerRowIncrement;
    }
    
    // Upper Half -- reduce row width until you reach the top
    rowWidth = treeWidth;
    for (let i = 0; i < upperRows - 1; i++) {
      // Calculate the increment for start_y using a quadratic function
      let upperRowHeightIncrement = (upperHalfHeight * (upperRows - i)) / (upperRows * (upperRows + 1) / 2);

      // Ensure row width doesn't exceed tree width and stays positive
      const currentRowWidth = Math.min(Math.max(0, rowWidth), treeWidth);
      
      // Calculate row boundaries, ensuring they stay within tree width
      const rowLeft = Math.max(treeLeft, startPoint.x - (currentRowWidth / 2));
      const rowRight = Math.min(treeRight, startPoint.x + (currentRowWidth / 2));
      const rowTop = start_y - upperRowHeightIncrement;
      const rowBottom = start_y;

      let leafPoints = this.#genLeafCoordinates(
        startPoint,
        treeWidth,
        numPointsPerRow,
        pointBoundaryRadius,
        rowLeft,
        rowRight,
        rowBottom,
        rowTop
      );

      points.push(...leafPoints);
      start_y = rowTop; // Update start_y for next row
      rowWidth -= upperRowIncrement;
    }

    return points;
  }

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
    
    // Ensure coordinates stay within the tree's boundaries
    min_x = Math.max(min_x, startPoint.x - (treeWidth / 2));
    max_x = Math.min(max_x, startPoint.x + (treeWidth / 2));
    
    for(let j=0; j < numPointsPerRow; j++){
      // Generate random coordinates within the specified boundaries
      let x = this.p.random(min_x, max_x);
      let y = this.p.random(min_y, max_y);
      
      // Ensure the point with its radius doesn't extend beyond the tree boundaries
      x = Math.max(min_x + pointBoundaryRadius.max, Math.min(x, max_x - pointBoundaryRadius.max));
      
      let r = pointBoundaryRadius;
      let windPhaseOffset = this.p.random(-this.p.PI / 4, this.p.PI / 4); // Generate a random offset for each point
      let leaf = {x, y, r, windPhaseOffset};
      leafCoords.push(leaf);
    }
    
    return leafCoords;
  }

  #generateLeavesPerPoint (numLeavesPerPoint: number, leafWidth: number, leafHeight: number, maxRadius: number, bufferCenter: number = 0) {
    const {p} = this;
    const {lightAngle, lightFillPercentage = 0.3} = this.settings.lightSettings || {};
    const {palette} = this.settings;

    let leaves: Leaf[] = [];
    for (let i = 0; i < numLeavesPerPoint; i++) {
      let angle = p.random(p.TWO_PI);
      let r = p.random(0, maxRadius); // Use maxRadius for scattering range
      
      let currentLightAngle = lightAngle !== undefined ? lightAngle : p.PI; // Default if undefined
      let isSunLeaf = lightAngle !== undefined ? this.#isSunLeaf(p, angle, currentLightAngle) : true; // Default to true if no light angle

      const baseColor = palette.base || p.color(120, 60, 70); // Default colors
      const highlightColor = palette.highlight || palette.base || p.color(100, 70, 80);
      
      // *** CHANGE: Calculate coordinates relative to buffer center ***
      let x = bufferCenter + (p.cos(angle) * r);
      let y = bufferCenter + (p.sin(angle) * r);

      // Movement factor might be applied later during animation, not needed in static buffer
      // let movementFactor: number = p.random(0.7, 0.9);
      // let movementDirection: number = p.random(0, p.TWO_PI);
      
      //Create Leaf
      let leaf: Leaf = {
        x, 
        y, 
        w: leafWidth, 
        h: leafHeight, 
        angle: angle, // Store the angle used for potential rotation
        fill: isSunLeaf && r > maxRadius * (1 - lightFillPercentage) ? highlightColor : baseColor, 
        isSunLeaf, // Store for potential later use,
        isEdgeLeaf: r > (maxRadius * 0.1), // Add a property to track if this is an edge leaf (outer 20% of radius)
        hasOutline: r > (maxRadius * 0.2) && p.random() < 0.5 // 50% chance for edge leaves to have outline
        // movementFactor,
        // movementDirection
      };

      leaves.push(leaf);
    }
    return leaves;
  }

  #drawLeafBushelBuffer() {
    const {p, settings: {leafSettings}} = this;
    const {leafWidth, leafHeight, numLeavesPerPoint, pointBoundaryRadius} = leafSettings; // Get radius settings
    
    // *** CHANGE: Determine buffer size and center based on max radius ***
    const maxRadius = pointBoundaryRadius.max;
    const bufferSize = maxRadius * 2; // Buffer needs to be diameter x diameter
    const bufferCenter = bufferSize / 2; // Center coordinate within the buffer
    
    const bushelBuffer: p5.Graphics = p.createGraphics(bufferSize, bufferSize);
    let leaves: Leaf[] = this.#generateLeavesPerPoint(numLeavesPerPoint, leafWidth, leafHeight, maxRadius, bufferCenter);

    // Draw Each Leaf to Buffer
    bushelBuffer.push(); // Isolate buffer drawing state
    bushelBuffer.colorMode(p.HSL);

    this.#drawLeavesToBuffer(bushelBuffer, leaves, bufferCenter);
    const rotatedBushelBuffer = this.#rotateBushelBufferToNewBuffer(bushelBuffer, bufferCenter);
    
    return rotatedBushelBuffer;
  }

  #drawLeavesToBuffer(bushelBuffer: p5.Graphics, leaves: Leaf[], bufferCenter: number) {
    const {p} = this;
    
    leaves.forEach(leaf => {
      bushelBuffer.noStroke(); // Default to no stroke
      bushelBuffer.fill(leaf.fill);
      
      if (leaf.hasOutline) {
        // For leaves with outline, we need to draw the leaf in two parts:
        // 1. The full leaf with no stroke
        bushelBuffer.noStroke();
        bushelBuffer.ellipse(leaf.x, leaf.y, leaf.w, leaf.h);
        
        // 2. The outer half with stroke
        bushelBuffer.push();
        // Translate to leaf center
        bushelBuffer.translate(leaf.x, leaf.y);
        // Rotate to the angle pointing away from center
        const angleToCenter = Math.atan2(leaf.y - bufferCenter, leaf.x - bufferCenter);
        bushelBuffer.rotate(angleToCenter);
        
        // 3. Draw only the outer half with stroke
        bushelBuffer.stroke(p.hue(leaf.fill), p.saturation(leaf.fill), p.lightness(leaf.fill) * 0.5); // Darken Fill Color for Stroke
        bushelBuffer.strokeWeight(0.5);
        bushelBuffer.noFill();
        bushelBuffer.arc(0, 0, leaf.w, leaf.h, -Math.PI/2, Math.PI/2); // Draw an arc for the outer half of the ellipse
        bushelBuffer.pop();
      } else {
        // For leaves without outline, just draw the full ellipse
        bushelBuffer.noStroke();
        bushelBuffer.ellipse(leaf.x, leaf.y, leaf.w, leaf.h);
      }
    });
    
    bushelBuffer.pop(); // Restore buffer state
    return bushelBuffer;
  }

  #rotateBushelBufferToNewBuffer(bushelBuffer: p5.Graphics, bufferCenter: number = 0) {
    const {p} = this;
    // Create a new buffer for the rotated version with the same size
    const rotatedBuffer = p.createGraphics(bushelBuffer.width, bushelBuffer.height);
    const bufferSize = bushelBuffer.width;
    bufferCenter = bufferSize / 2; // Ensure we're using the correct center
    
    // Calculate a random rotation angle - using pastel-friendly subtle rotation
    const rotationAngle = p.random(-p.PI/6, p.PI/6);
    
    // Draw the original buffer onto the new one with rotation
    rotatedBuffer.push();
    // First translate to center of the buffer
    rotatedBuffer.translate(bufferCenter, bufferCenter);
    // Apply the rotation
    rotatedBuffer.rotate(rotationAngle);
    // Draw the original buffer with an offset to center it
    rotatedBuffer.image(bushelBuffer, -bufferCenter, -bufferCenter);
    rotatedBuffer.pop();

    return rotatedBuffer;
  }

  #isSunLeaf (p: p5, leafAngle: number, sunlightAngle: number) {
    let min = sunlightAngle - p.HALF_PI
    let max = sunlightAngle + p.HALF_PI
    return leafAngle > min && leafAngle < max;
  }

  clear() {
    this.points = []
    this.trunkLines = []
    this.leafBushelBuffer.clear();
    this.image.clear();
  }
}