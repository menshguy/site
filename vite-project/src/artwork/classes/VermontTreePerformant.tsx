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
    points.forEach(({ x, y, r, windPhaseOffset }) => {
      const padding = r ? r.max : 0
      let windSwayX = 0;
      
      if (isAnimated) {
        // Calculate current max intensity (oscillates between 0 and maxWindIntensity)
        const intensityFactor = (this.p.sin(this.windIntensityPhase) + 1) / 2; 
        const currentMaxIntensity = this.maxWindIntensity * intensityFactor;
        
        // Calculate current sway offset (oscillates between -currentMaxIntensity and +currentMaxIntensity)
        windSwayX = this.p.sin(this.windPhase + (windPhaseOffset ?? 0)) * currentMaxIntensity; 
        
        // Make higher points sway slightly more
        const heightFactor = this.p.map(y, this.startPoint.y - this.settings.treeSettings.treeHeight, this.startPoint.y, 1, 0.5);
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
    
    // Ensure we don't exceed the tree height boundary
    let start_y = leavesStartY;
    let end_y = startPoint.y - treeHeight;
    
    // Calculate the tree's visual boundaries
    const treeLeft = startPoint.x - (treeWidth / 2);
    const treeRight = startPoint.x + (treeWidth / 2);
    const treeTop = end_y;
    const treeBottom = start_y;

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

    // Draw Each Leaf to Buffer
    bushelBuffer.push(); // Isolate buffer drawing state
    bushelBuffer.colorMode(p.HSL);
    bushelBuffer.noStroke(); // Default to no stroke
    
    leaves.forEach(leaf => {
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