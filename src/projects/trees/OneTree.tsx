import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import {Season} from './types.ts';
import {VermontTree} from '../../helpers/treeHelpers.tsx';
import p5 from 'p5';

const mySketch = (p: p5) => {

  let cw: number = 600; 
  let ch: number = 600;
  let bottom = 20;
  let debug = true;
  let tree: VermontTree;
  let season: Season;
  let textureImg: p5.Image;
  let colors: Record<Season, () => p5.Color>;
  let colorsSunlight: Record<Season, () => p5.Color>;
  let bgColors: Record<Season, p5.Color>;
  let bgColor: p5.Color;
  
  p.preload = () => {
    textureImg = p.loadImage('../textures/watercolor_1.jpg');
  }
  
  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(cw, ch);
    
    colors = {
      winter: (l: number = 1) => p.color(p.random(70,130), p.random(10, 15), p.random(30*l,40*l)),
      fall: (l: number = 1) => p.color(p.random(5,45), p.random(65, 90), p.random(20*l,30*l)),
      spring: (l: number = 1) => p.color(p.random(5,45), p.random(70, 80), p.random(30*l,40*l)),
      summer: (l: number = 1) => p.color(p.random(70,125), p.random(80, 90), p.random(50*l,70*l))
    }
    colorsSunlight = {
      winter: () => p.color(p.random(70,130), p.random(10, 15), p.random(90,95)),
      fall: () => p.color(p.random(15,50), 80, 60),
      spring: () => p.color(p.random(5,60), 75, 70),
      summer: () => p.color(p.random(100,135), 70, 95)
    }
    bgColors = {
      'summer': p.color(56,85,91), //light yellow
      'winter': p.color(208,18,53), //deep blue
      'spring': p.color(43, 62, 90), //orange
      'fall': p.color(39, 26, 73) //brown
    }
  
    /** General Settings */
    season = p.random(['spring', 'fall', 'winter', 'summer']);
    console.log("season", season)
    bgColor = bgColors[season];
    let fills = colors[season];
    let fillsSunlight = colorsSunlight[season];

    let trunkHeight = p.random(10, 25);
    let trunkWidth = p.random(10, 25);
    let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
    let treeWidth = p.random(trunkWidth, trunkWidth+10); // total width including leaves
    let numTrunkLines = p.random(4,8); //trunks are made up of X bezier curves

    // Points & Leaves
    let numPointsPerRow = 3; // X points are draw within a boundary radius
    let avg = 15
    let numLeavesPerPoint = p.random(avg, avg+(avg/2)); // X leaves are draw around each point.
    let pointBoundaryRadius = {min: 8, max: 15};
    let leavesStartY = p.height - bottom - pointBoundaryRadius.min-5; //where on y axis do leaves start
    let leafWidth = p.random(1, 1);
    let leafHeight = p.random(2, 2);
    let rowHeight = treeHeight/3; //x points will drawn p.randominly in each row. rows increment up by this amount

    // Start / Mid / Bulge
    let startPoint = {x: p.random(-100, cw+100), y: ch-bottom};
    let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2)};
    let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - treeHeight/3))};

      
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
      leafWidth, 
      leafHeight,
      rowHeight,
      midpoint,
      bulgePoint
    })

    console.log("tree", tree)
  }
  
  p.draw = () => {
    p.noLoop();
    p.background(bgColor)
    
    //Draw Tree
    tree.drawTrunk(p, tree.trunkLines, false)
    tree.leaves.forEach(leaf => !leaf.isSunLeaf && tree.drawLeaf(p, leaf));
    
    //Draw Texture
    p.blendMode(p.MULTIPLY);
    p.image(textureImg, 0, 0, cw, ch);
    p.blendMode(p.BLEND);
    
    // Draw Sunleaves
    tree.leaves.forEach(leaf => leaf.isSunLeaf && tree.drawLeaf(p, leaf));

    if (debug) {
      //bulge
      p.stroke("red")
      p.strokeWeight(1)
      p.line(0, tree.bulgePoint.y, cw, tree.bulgePoint.y)
      p.stroke("yellow")
      p.point(tree.bulgePoint.x, tree.bulgePoint.y)
      //width
      p.stroke("green")
      p.line(tree.startPoint.x - tree.treeWidth/2, 0, tree.startPoint.x - tree.treeWidth/2, ch)
      p.line(tree.startPoint.x + tree.treeWidth/2, 0, tree.startPoint.x + tree.treeWidth/2, ch)
      //height
      p.stroke("blue")
      p.line(0, ch - tree.treeHeight - bottom, cw, ch - tree.treeHeight - bottom)
      //leaves
      tree.leaves.forEach(leaf => {
        p.strokeWeight(5);
        p.stroke("yellow");
        p.point(leaf.x, leaf.y)
      })
      //points
      tree.points.forEach(treePoint => {
        p.strokeWeight(5);
        p.stroke("red");
        p.point(treePoint.x, treePoint.y)
      })
    }
  }
  
  // p.mousePressed = redraw(p, cw, ch);
  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      p.clear();
      p.setup();
      p.draw();
    }
  };
  
};

const OneTree: React.FC = () => {
  return (
    <div>
      <h1>One Tree Debugger</h1>
      {/* <p>11/14/24</p> */}
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export {mySketch}
export default OneTree;