/**
 * VermontSVG
 * 
 * P5Editor Link: https://editor.p5js.org/menshguy/sketches/sLfK9iqFc
 * 
 * P5.js-svg Library: https://github.com/zenozeng/p5.js-svg
 * Initialized: https://stackoverflow.com/questions/75704314/how-to-use-p5-svg-in-a-web-app-with-react-frontend-and-an-express-backend
 * 
 * This Sketch will draw versions of the Vermont Sketch as a plottable SVG.
 * Key Differences:
 * - Colors are simplified
 * - No Gradients or Alpha/Transparency (i.e. no sunrays, no sun/sky gradients)
 * - No Filters (i.e. no blur, no glow, no sunrays)
 * - Each Layer is a single color - this is so it can be easily plotted.
 * - Only Fall & Day are drawn currently
 * - No textures (i.e. no watercolor)
 *  
 * 
 * For future:
 * - P5.js-svg only works with P5.js Versions 1.6. 
 * - Rather than convert TSX files to JS - You can just transpile the TS code to JS and run that in an Editor
 * - Consider a script of some kind? 
 */


/** For use in React/TS */
//-- 1. Add this Import Statement to p5Wrapper.tsx
// import p5svg from 'p5.js-svg'; 
//-- 2. Right before you instantiate a new p5 instance, extend it by passing it through p5svg, like so:
// p5svg(p5)
// p5InstanceRef.current = new p5(sketch, canvasRef.current || undefined);
// console.log("p5InstanceRef.current", p5InstanceRef.current) // should have SVG property on prototype



/* export SVG
DDF 2019
need to have p5.svg.js in project and in index.html
see -https://github.com/zenozeng/p5.js-svg
this will save an SVG file in your download folder
*/
let cw = 1000; 
let ch = 600;
let bottom = 20;
let s;
let b;
let tree;
let season;
let textureImg;
let colors;
let colorsBG;
let bgColor;
let timeOfDay;
let sunAngle;
let sunFillPercentage;
let sunCenter;
let moonConfig;
let starsConfig;
let treesInFront = [];
let treesInMiddle = [];
let treesInBack = [];

mousePressed = () => {
  save("mySVG.svg"); // give file name
  print("saved svg");
}

setup = () => {
  colorMode(HSL);
  createCanvas(cw, ch, SVG);

  // Clear Trees (this will ensure redrawing works)
  treesInBack = [];
  treesInMiddle = [];
  treesInFront = [];

  /** SEASON */
  season = random([
    // 'spring', 
    'fall', 
    // 'summer'
  ]);

  /** COLORS */
  colors = {
    fall: (s = 1, l = 1) => () => color(random([5,18, 31, 45]), 65*s, 100*l),
  }

  // Sunlight
  sunAngle = radians(random(200, 340));
  sunFillPercentage = random(0.05, 0.1);
  sunCenter = {x: random(random(-100,0), random(cw, cw+100)), y: random(0, ch-bottom)}
  let sunlight = {angle: sunAngle, fillPercentage: sunFillPercentage}

  /** DAY TIME */
  timeOfDay = random(['day']);
  let bgLightness = 0.85;
  let treeLightness = 1;

  /** FRONT TREES */
  let numTreesInFront = 26;
  for (let i = 0; i < numTreesInFront; i++) {

    // Trunk & Tree
    let trunkHeight = random(50, ch-bottom-100);
    let trunkWidth = random(200, 200);
    let treeHeight = random(trunkHeight, trunkHeight); // total height including leaves
    let treeWidth = random(trunkWidth+20, 300); // total width including leaves
    let numTrunkLines = random(4,8); //trunks are made up of X bezier curves

    // Points & Leaves
    let numPointsPerRow = random(10,11); // X points are draw within a boundary radius
    let avg = season === "winter" ? 8 : 40
    let numLeavesPerPoint = random(avg-(avg/2), avg+(avg/2)); // X leaves are draw around each point.
    let pointBoundaryRadius = {min: 50, max: 60};
    let leavesStartY = height - bottom - pointBoundaryRadius.min-10; //where on y axis do leaves start
    let leafWidth = random(2, 3);
    let leafHeight = random(4, 5);
    let rowHeight = treeHeight/10; //x points will drawn randominly in each row. rows increment up by this amount

    // Start / Mid / Bulge
    let startPoint = {x: random(-100, cw+100), y: ch-bottom};
    let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + bottom};
    let bulgePoint = { x: midpoint.x, y: random(midpoint.y, (startPoint.y - midpoint.y/3))};

    /** Create Tree */
    tree = new VermontTree({
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
      fills: colors[season](0.8, 0.5*treeLightness),
      fillsSunlight: colors[season](0.45, 0.85*treeLightness),  
      sunlight,
      leafWidth, 
      leafHeight,
      rowHeight,
      midpoint,
      bulgePoint
    });

    treesInFront.push(tree);
  }

  /** MIDDLE TREES */
  let middleBottom = bottom;
  let numTreesInMiddle = 29;
  for (let i = 0; i < numTreesInMiddle; i++) {

    // Trunk & Tree
    let trunkHeight = random(300, 400);
    let trunkWidth = random(100,150);
    let treeHeight = random(trunkHeight, trunkHeight); // total height including leaves
    let treeWidth = random(trunkWidth+20, 300); // total width including leaves
    let numTrunkLines = random(4,8); //trunks are made up of X bezier curves

    // Points & Leaves
    let numPointsPerRow = random(13, 15); // X points are draw within a boundary radius
    let pointBoundaryRadius = {min: 20, max: 30};
    let avg = season === "winter" ? 5 : 30
    let numLeavesPerPoint = random(avg-(avg/2), avg+(avg/2)); // X leaves are draw around each point.
    let leavesStartY = height - middleBottom - pointBoundaryRadius.min; //where on y axis do leaves start
    let leafWidth = random(2, 3);
    let leafHeight = random(4, 5);
    let rowHeight = treeHeight/10; //x points will drawn randominly in each row. rows increment up by this amount

    // Start / Mid / Bulge
    let startPoint = {x: random(-100, cw+100), y: ch - middleBottom};
    let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + middleBottom};
    let bulgePoint = { x: midpoint.x, y: random(midpoint.y, (startPoint.y - midpoint.y/3))};

    /** Create Tree */
    tree = new VermontTree({
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
      fills: colors[season](0.6, 0.4*treeLightness), 
      fillsSunlight: colors[season](0.65, 0.4*treeLightness), 
      sunlight,
      leafWidth, 
      leafHeight,
      rowHeight,
      midpoint,
      bulgePoint
    });

    treesInMiddle.push(tree);
  }

  /** BACK TREES */
  let backBottom = middleBottom;
  let numTreesInBack = 20;
  for (let i = 0; i < numTreesInBack; i++) {

    // Trunk & Tree
    let trunkHeight = random(600, 700);
    let trunkWidth = random(200,250);
    let treeHeight = random(600, 700); // total height including leaves
    let treeWidth = random(trunkWidth+20, 300); // total width including leaves
    let numTrunkLines = random(4,8); //trunks are made up of X bezier curves

    // Points & Leaves
    let numPointsPerRow = random(30, 35); // X points are draw within a boundary radius
    let pointBoundaryRadius = {min: 50, max: 60};
    let avg = season === "winter" ? 1 : 25
    let numLeavesPerPoint = random(avg-(avg/2), avg+(avg/2)); // X leaves are draw around each point.
    let leavesStartY = height - backBottom - pointBoundaryRadius.min; //where on y axis do leaves start
    let leafWidth = random(4, 5);
    let leafHeight = random(6, 7);
    let rowHeight = treeHeight/15; //x points will drawn randominly in each row. rows increment up by this amount

    // Start / Mid / Bulge
    let startPoint = {x: random(-100, cw+100), y: ch - backBottom};
    let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + backBottom};
    let bulgePoint = { x: midpoint.x, y: random(midpoint.y, (startPoint.y - midpoint.y/3))};

    /** Create Tree */
    tree = new VermontTree({
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
      fills: colors[season](0.4, 0.2*treeLightness), 
      fillsSunlight: colors[season](0.5, 0.3*treeLightness),
      sunlight,
      leafWidth, 
      leafHeight,
      rowHeight,
      midpoint,
      bulgePoint
    });

    treesInBack.push(tree);
  }
}

draw = () => {
  clear();
  noLoop();
  // background(bgColor);
  push()
  fill("rgb(210,238,242)")
  noStroke()
  rect(0, 0, cw, ch); // background for svg - can just do white if this is too much
  pop()
  

  /** DRAW GROUND */
  push()
  noStroke()
  fill(9, 20, 20)
  rect(0, ch-bottom, cw, ch)
  pop()
  

  /** DRAW TREES */
  treesInBack.forEach(tree => {
    tree.drawTrunk(tree.trunkLines, false)
    tree.leaves.forEach(leaf => !leaf.isSunLeaf && tree.drawLeaf(leaf));
  })
  treesInMiddle.forEach(tree => {
    tree.drawTrunk(tree.trunkLines, false)
    tree.leaves.forEach(leaf => !leaf.isSunLeaf && tree.drawLeaf(leaf));
  })
  treesInFront.forEach(tree => {
    tree.leaves.forEach(leaf => leaf.isSunLeaf && tree.drawLeaf(leaf));
  })
  treesInFront.forEach(tree => {
    tree.drawTrunk(tree.trunkLines, false)
    tree.leaves.forEach(leaf => !leaf.isSunLeaf && tree.drawLeaf(leaf));
  })

  const groundColor = color("black")
  drawGroundLine(25, ch-bottom, cw-25, groundColor)

}

const drawGradientCircle = (
  x, 
  y, 
  radius, 
  reverse,
  strokeColor
) => {
  let {_hue, sat, lum} = {hue: hue(strokeColor), sat: saturation(strokeColor), lum: lightness(strokeColor)}
  let alphaStart = reverse ? 0 : 1
  let alphaEnd = reverse ? 1 : 0
  for (let r = 0; r < radius; r++) {
    const alpha = map(r, 0, radius, alphaStart, alphaEnd); // Map radius to alpha
    noFill()
    stroke(_hue, sat, lum, alpha);
    circle(x, y, r);
  }
}





class VermontTree {

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
        x: random(startPoint.x-(trunkWidth/2), startPoint.x+(trunkWidth/2)), 
        y: random((startPoint.y-trunkHeight) + (trunkHeight/2), startPoint.y - trunkHeight)
      }
      let startControlPoint = {
        x: startPoint.x, 
        y: random(startPoint.y, endPoint.y)
      }
      let endControlPoint = {
        x: endPoint.x < startPoint.x ? random(endPoint.x, startPoint.x) : random(startPoint.x, endPoint.x),
        y: random(startControlPoint.y, endPoint.y)
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
      min_x, 
      max_x, 
      min_y, 
      max_y, 
      m
    ) {
      let leafCoords = []
      // Clamp min_x and max_x to ensure they are within the treeWidth boundary
      min_x = Math.max(min_x, startPoint.x - (treeWidth / 2));
      max_x = Math.min(max_x, startPoint.x + (treeWidth / 2));
      for(let j=0; j < numPointsPerRow; j++){
        let x = random(min_x, max_x);
        let y = random(min_y, max_y)
        let r = pointBoundaryRadius;
        let boundary = _getPointBoundary(r, x, y, m.x, m.y)
        let leaf = {x, y, boundary};
        leafCoords.push(leaf);
      }
      
      return leafCoords;
    }
  }

  generateLeafShapes() {
    let {leafWidth, leafHeight, startPoint, numLeavesPerPoint, points, fills, fillsSunlight, sunlight} = this;
    let {angle: sunlightAngle, fillPercentage} = sunlight

    let leaves = [];
    points.forEach(({ x: px, y: py, boundary: b }) => {
      for (let i = 0; i < numLeavesPerPoint; i++) {
        //Angle leaf towards startP of its boundary
        let angle = random(b.start, b.stop)
        let r = random(0, b.radius)
        let isSunLeaf = getIsSunLeaf(angle, sunlightAngle)
        let isFallenLeaf = py + (sin(angle) * r) >= (startPoint.y) //If py is below the ground, we flag it so we can create fallen leaves later
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
        let x = px + (cos(angle) * r);
        let y = isFallenLeaf //If y is below bottom (ground), set to y to bottom with some variance to draw "fallen leaves"
          ? startPoint.y + random(0, 15) 
          : py + (sin(angle) * r);
        angle = isFallenLeaf ? HALF_PI : angle; //Angle fallen leaves horizonally
        
        //Set movement factor - will affect the speed of movement in animation (0.1 is slow, 1 is fast)
        let movementFactor = random(0.7, 0.9);
        let movementDirection = random(0, TWO_PI);
        
        //Create Leaf
        let leaf = {
          x, 
          y, 
          w: leaf_w, 
          h: leaf_h, 
          angle, 
          start: angle  -HALF_PI, 
          stop: angle + HALF_PI,
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

    function getIsSunLeaf (leafAngle, sunlightAngle) {
      let min = sunlightAngle - HALF_PI
      let max = sunlightAngle + HALF_PI
      return leafAngle > min && leafAngle < max;
    }
  }

  drawLeaf(leaf) {
    let {x, y, w, h, angle, start: _start, stop: _stop, fill_c} = leaf;
  
    push();
    noStroke();
    fill(fill_c)
    translate(x,y);
    rotate(angle);
  
    // Main Leaf
    ellipse(0, 0, w, h)
    pop();
  }
  
  drawTrunk(trunkLines, customStyles){
    trunkLines.forEach(line => {
      let {startPoint:s, controlPoints:cps, endPoint:e} = line
  
      //Set Styles
      if (!customStyles) {
        push()
        stroke('black')
        strokeWeight(1);
        noFill()
      }
  
      // -- Curve Style -- //
      beginShape();
      vertex(s.x, s.y)
      bezierVertex(
        cps[0].x, cps[0].y,
        cps[1].x, cps[1].y,
        e.x, e.y
      )
      endShape();
      if (!customStyles) pop(); //Unset Styles
    })
  }

  clear() {
    this.leaves = []
    this.points = []
    this.trunkLines = []
  }
}

function drawGroundLine(
  xStart,
  yStart,
  xEnd,
  fill_c
) {
  let x = xStart;
  const y = yStart;
  stroke(fill_c);
  strokeWeight(1);
  fill_c ? fill(fill_c) : noFill();

  while (x < xEnd) {
    const tickBump = random(-4, 0);
    const tickType = random(["long", "short", "long", "short", "space"]);
    let tickLength = getTickLength(tickType);

    if (tickType !== "space") {
      drawTick(x, y, tickLength, tickBump);
    }

    x += tickLength;
  }

  function getTickLength(type) {
    switch (type) {
      case "long":
        return random(10, 25);
      case "short":
        return random(3, 10);
      case "space":
        return random(5, 25);
      default:
        console.error("no such line type");
        return 0;
    }
  }

  function drawTick(x, y, length, bump) {
    beginShape();
    vertex(x, y, 0);
    const cx1 = x + length / 2;
    const cy1 = y + bump;
    const cx2 = x + length;
    const cy2 = y;
    bezierVertex(x, y, cx1, cy1, cx2, cy2);
    endShape();
  }
}


function _getPointBoundary(
  max_r, 
  px, 
  py, 
  mx, 
  my
){
  let min = max_r.min;
  let max = max_r.max;
  let radius = random(min, max); 
  
  // Calculate the differences in x and y and calc angle us atan2
  let dx = mx - px;
  let dy = my - py;
  let angle = atan2(dy, dx);
  
  // This won't do anything, but if you want to create a gap that faces startP you can take the values in the comments
  let start = 0 // angle + QUARTER_PI
  let stop = TWO_PI // angle - QUARTER_PI
  
  return {start, stop, angle, radius};
}