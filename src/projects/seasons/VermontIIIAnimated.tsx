import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import {Season, Leaf} from './types.ts';
import {VermontTree, drawGroundLine} from './treeHelpers.tsx';
import {shuffleArray} from '../../helpers/arrays.ts';
import {drawMoon, drawStars, drawReflection, drawCirclesToBuffer, Moon, Stars, TimeOfDay} from './skyHelpers.tsx';
import p5 from 'p5';

/** 
 * BEFORE: 
  setup fin 2.149
  draw  fin 13.882 
*/

const mySketch = (p: p5) => {

  let cw: number = 1000; 
  let ch: number = 600;
  let m: p5.Graphics;
  let d: p5.Graphics;
  let b: p5.Graphics;
  let lakeFill: p5.Color;
  let bottom = 300;
  let tree: VermontTree;
  let sunAngle: number;
  let sunFillPercentage: number;
  let season: Season;
  let textureImg: p5.Image;
  let colors: Record<any, (s:number, l:number) => () => p5.Color>;
  let treesInFront: VermontTree[] = [];
  let treesInBack: VermontTree[] = [];
  let leavesForAnimation: Leaf[] = [];
  let timeOfDay: TimeOfDay;
  let moonConfig: Moon;
  let starsConfig: Stars;
  
  p.preload = () => {
    // textureImg = p.loadImage('../textures/coldpressed_1.PNG');
    textureImg = p.loadImage('../textures/coldpressed_1.PNG');
  }
  
  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(cw, ch);

    /** Colors */
    colors = {
      green: (s: number = 1, l: number = 1) => () => p.color(p.random(74,107), 70*s, 40.3*l),
      yellow: (s: number = 1, l: number = 1) => () => p.color(p.random(42,80), 70*s, 55*l),
      orange: (s: number = 1, l: number = 1) => () => p.color(p.random(27,50), 70*s, 56*l),
      red: (s: number = 1, l: number = 1) => () => p.color(p.random(2,35), 70*s, 57*l),
    }
  
    // Season & Time
    season = 'fall';
    // timeOfDay = p.random(["day", "night"]);
    timeOfDay = "night";
    console.log("season", season, timeOfDay)
    
    // Sunlight
    sunAngle = p.radians(p.random(200, 340));
    sunFillPercentage = p.random(0.1, timeOfDay === 'night' ? 0.4 : 1);
    let sunlight = {angle: sunAngle, fillPercentage: sunFillPercentage}

    // Trunk & Tree
    let trunkHeight = p.random(50, 70);
    let trunkWidth = p.random(40, 60);
    let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
    let treeWidth = p.random(trunkWidth, trunkWidth+5); // total width including leaves
    let numTrunkLines = p.random(3,5); //trunks are made up of X bezier curves

    // Points & Leaves
    let numPointsPerRow = 10; // X points are draw within a boundary radius
    let avg = 50;
    let numLeavesPerPoint = p.random(avg, avg+(avg/2)); // X leaves are draw around each point.
    let pointBoundaryRadius = {min: 20, max: 25};
    let leavesStartY = p.height - bottom - pointBoundaryRadius.max; //where on y axis do leaves start
    let leafWidth = p.random(4, 4);
    let leafHeight = p.random(5, 5);
    let rowHeight = treeHeight/3; //x points will drawn p.randominly in each row. rows increment up by this amount

    /** FRONT TREES */
    let numTreesInFront = 50;
    for (let i = 0; i < numTreesInFront; i++) {
      // Start / Mid / Bulge
      let startX = i * (cw/numTreesInFront) + p.random(-10, 10)
      let startPoint = {x: startX, y: ch-bottom};
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2)};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - treeHeight/3))};
      
      // Colors
      let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
      let fills = timeOfDay === "night" 
        ? colors[fallColor](0.4, .2)
        : colors[fallColor](0.9, .5)
      let fillsSunlight = timeOfDay === "night" 
        ? colors[fallColor](0.1, .5)
        : colors[fallColor](0.8, .95);
        
      /** Create Tree */
      tree = new VermontTree({
        p5Instance: p,
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
      });

      treesInFront.push(tree);
    }

    shuffleArray(treesInFront)

    /** BACKGROUND TREES */
    let numBGTreeColumns = 20;
    for (let i = 0; i < numBGTreeColumns; i++) {

      // Start / Mid / Bulge
      let offset = treeHeight / 2;
      let minStartY = ch-bottom;
      let maxStartY = ch-bottom-(treeHeight*i);
      let numTreesInColumn = (minStartY - maxStartY) / treeHeight
      for (let j = numTreesInColumn; j >= 0; j--) {
        let startX = i * ( (p.width+treeWidth)/numBGTreeColumns ) + p.random(-25, 25) // add an extra treeWidth for some bufferspace
        let startY = minStartY - (numTreesInColumn * j) + offset;
        let startPoint = {x: startX, y: startY};
        let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2)};
        let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - treeHeight/3))};
        
        // Colors
        let fallColor = p.random(['green', 'yellow', 'orange', 'red']);
        let fills = timeOfDay === "night" 
          ? colors[fallColor](0.4, .2)
          : colors[fallColor](0.9, .5)
        let fillsSunlight = timeOfDay === "night" 
          ? colors[fallColor](0.1, .5)
          : colors[fallColor](0.8, .95);
          
        /** Create Tree */
        tree = new VermontTree({
          p5Instance: p,
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
        });

        treesInBack.push(tree);
      }
    }

    /** Moon */
    let moonX = p.map(sunAngle, p.radians(180), p.radians(360), 0, cw);
    let moonY = p.random(0, p.height-bottom);
    let moonR = p.map(moonY, 0, p.height-bottom, 50, 350);
    let moonHue = p.map(moonY, 0, p.height-bottom-moonR, 52, 33)
    let moonFill = p.color(moonHue, 78, 92);
    moonConfig = {x: moonX, y: moonY, r: moonR, fill: moonFill}

    /** Stars */
    let numStars = 650;
    let starFill = p.color(255, 100, 100);
    let minR = 0.25;
    let maxR = 2;
    let minX = 0;
    let maxX = cw;
    let minY = 0;
    let maxY = p.height;
    starsConfig = {numStars, fill: starFill, minR, maxR, minX, maxX, minY, maxY}

    // Draw //
    // Create a buffer for main image to be drawn to.
    m = p.createGraphics(p.width, p.height - (p.height-bottom))

    // Shadow
    m.noStroke()
    m.fill(timeOfDay === "night" ? m.color(30, 30, 12) : m.color(30, 30, 30))
    m.rect(0, p.height-bottom-18, p.width, 18)

    // Draw Trees to buffer ahead of draw
    treesInBack.forEach(tree => {
      m.push();
      m.strokeWeight(1);
      m.noFill()
      m.stroke(timeOfDay === "night" ? m.color(12, 20, 10) : m.color(12, 20, 40));
      tree.drawTrunk(m, tree.trunkLines, true)
      m.pop();

      // Draw non-sun leaves
      tree.leaves.forEach(leaf => {
        let probability = p.random(0, 1)
        if (probability < 0.001) leavesForAnimation.push(leaf);
        if (!leaf.isSunLeaf) tree.drawLeaf(m, leaf)
      });

      // Draw sun leaves on top of non-sun leaves
      tree.leaves.forEach(leaf => {
        let probability = p.random(0, 1)
        if (probability < 0.001) leavesForAnimation.push(leaf);
        if (leaf.isSunLeaf) tree.drawLeaf(m, leaf)
      });
    })

    treesInFront.forEach(tree => {
      m.push();
      m.strokeWeight(1);
      m.noFill()
      m.stroke(timeOfDay === "night" ? m.color(12, 20, 10) : m.color(12, 20, 40));
      tree.drawTrunk(m, tree.trunkLines, true)
      m.pop();

      // Draw non-sun leaves
      tree.leaves.forEach(leaf => {
        let probability = p.random(0, 1)
        if (probability < 0.05) leavesForAnimation.push(leaf);
        if (!leaf.isSunLeaf) tree.drawLeaf(m, leaf)
      });

      // Draw sun leaves on top of non-sun leaves
      tree.leaves.forEach(leaf => {
        let probability = p.random(0, 1)
        if (probability < 0.05) leavesForAnimation.push(leaf);
        if (leaf.isSunLeaf) tree.drawLeaf(m, leaf)
      });
    })

    // Create Buffer for Reflection
    b = drawReflection(p, m, 0, p.height - bottom, p.width, p.height)
    lakeFill = timeOfDay === "night" ? p.color(223, 68, 8) : p.color(215, 40.7, 64.2);
    d = drawCirclesToBuffer(p, b, p.height - bottom, lakeFill)
  }
  
  p.draw = () => {
    // p.noLoop();

    // Sky to canvas
    let skyColor = timeOfDay === "night" ? p.color(223,43,18) : p.color("#68ADF6")
    p.noStroke();
    p.fill(skyColor);
    p.rect(0, 0, p.width, p.height)
    
    // Draw Moon and Stars to buffer
    // if (timeOfDay === "night") {
    //   drawMoon(p, moonConfig); // Draw Moon
    //   drawStars(p, starsConfig); // Draw Stars
    // }

    // Draw tree buffer image
    // p.image(m, 0, 0)

    // Animate Leaves
    leavesForAnimation.forEach(leaf => {
      const animatedLeaf = animateLeaf(leaf)
      drawAnimatedLeaf(p, animatedLeaf)
    })

    // Sky Reflection
    p.noStroke()
    p.fill(skyColor)
    p.rect(0, p.height-bottom, p.width, p.height)

    // Ground Line
    drawGroundLine(p, 25, ch-bottom, cw-25, timeOfDay === "night" ? m.color(12, 20, 10) : m.color(12, 20, 20))
    
    // Draw Reflection
    // p.image(d, 0, 0);

    //Draw Texture
    // p.blendMode(p.MULTIPLY);
    // p.image(textureImg, 0, 0, cw, ch);
    // p.blendMode(p.BLEND);
  }

  function animateLeaf(leaf: Leaf) {
    let time = p.frameCount * 0.2; // representds distance dots move - lower is further
    let randomFactorX = p.random(-0.8, 0.8); // Random factor for x direction
    let randomFactorY = p.random(-0.8, 0.8); // Random factor for y direction

    // Calculate directional movement
    let directionX = Math.cos(leaf.movementDirection || 0);
    let directionY = Math.sin(leaf.movementDirection || 0);

    // Update leaf position with direction
    leaf.y = leaf.y + (Math.cos(time) / (leaf.movementFactor || 1 * 2)) * directionY + randomFactorY;
    leaf.x = leaf.x + (Math.sin(time) * (leaf.movementFactor || 1)) * directionX + randomFactorX;

    return leaf;
  }

  function drawAnimatedLeaf(p: p5, leaf: Leaf) {
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
  
  // p.mousePressed = redraw(p, cw, ch);
  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      treesInBack = [];
      treesInFront = [];
      p?.clear();
      p?.setup();
      p?.draw();
    }
  };
};

const VermontIIIAnimated: React.FC = () => {
  return (
    <div>
      <h1>Vermont III (Animated)</h1>
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} includeSaveButton />
    </div>
  );
};

export default VermontIIIAnimated;