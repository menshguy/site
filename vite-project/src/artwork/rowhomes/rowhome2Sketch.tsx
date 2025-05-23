import p5 from 'p5';
import { RowhomeConstructor, FloorSectionConstructor } from './types.ts';
import {VermontTree} from '../../helpers/treeHelpers.tsx';

const mySketch = (p: p5) => {
  let buffers: p5.Graphics[] = [];
  let rowhomes: Rowhome[] = [];
  let bottom: number;
  let cw: number;
  let ch: number;
  // let drawControls = false;
  let trees: VermontTree[] = [];
  let textureImg: p5.Image;

  p.preload = () => {
    textureImg = p.loadImage('/textures/watercolor_1.jpg');
  };

  p.setup = () => {
    cw = 600;
    ch = 600;
    p.createCanvas(cw, ch);

    // General Settings
    p.colorMode(p.HSL);
    bottom = 25;

    // Clear objects (for redraws)
    rowhomes = [];
    buffers = [];
    trees = [];

    // Colors
    const mainRowhomeFill = p.color(23, 30, 30);
    const otherRowhomeFill = p.color(23, 20, 30);

    // Draw Main Rowhome
    const h = p.random(ch / 3, ch);
    const w = p.random(ch / 6, cw);
    const x = (p.width - w) / 2;
    const y = p.height - bottom;
    const fill_c = mainRowhomeFill;
    const rowhome = new Rowhome({ x, y, w, h, fill_c });
    rowhomes.push(rowhome);

    // Draw a rowhome to the left
    const lh = p.random(ch / 3, ch);
    const lw = p.random(ch / 6, cw);
    const lx = x - lw - 2; // start at the main rowhome x and move over to the left by this rowhome's w
    const ly = p.height - bottom;
    const fill_lc = otherRowhomeFill;
    const rowhome_left = new Rowhome({ x: lx, y: ly, w: lw, h: lh, fill_c: fill_lc });
    rowhomes.push(rowhome_left);

    // Draw a rowhome to the right
    const rh = p.random(ch / 3, ch);
    const rw = p.random(ch / 6, cw);
    const rx = x + w + 2; // start at the main rowhome x and move over to the right by main rowhome w
    const ry = p.height - bottom;
    const fill_rc = otherRowhomeFill;
    const rowhome_right = new Rowhome({ x: rx, y: ry, w: rw, h: rh, fill_c: fill_rc });
    rowhomes.push(rowhome_right);

    // If there is still space to the left, draw yet another home (TODO: Make more dynamic)
    if (lx > 0) {
      const h = p.random(ch / 3, ch);
      const w = p.random(ch / 6, cw);
      const x = lx - w - 2;
      const y = p.height - bottom;
      const fill_c = otherRowhomeFill;
      const rowhome_left = new Rowhome({ x, y, w, h, fill_c });
      rowhomes.push(rowhome_left);
    }

    // If there is still space to the right, draw yet another home (TODO: Make more dynamic)
    if (rx + rw < p.width) {
      const h = p.random(ch / 3, ch);
      const w = p.random(ch / 6, cw);
      const x = rx + w + 2;
      const y = p.height - bottom;
      const fill_c = otherRowhomeFill;
      const rowhome_right = new Rowhome({ x, y, w, h, fill_c });
      rowhomes.push(rowhome_right);
    }

    // Setup Trees
    const numTrees = p.random(1, 3);
    // Sunlight
    let sunAngle = p.radians(p.random(200, 340));
    let sunFillPercentage = p.random(0.45, 0.75);
    let sunlight = {angle: sunAngle, fillPercentage: sunFillPercentage}

    for (let i = 0; i < numTrees; i++) {
      /** Colors */
      let colors = {
        winter: (s: number = 1, l: number = 1) => () => p.color(p.random(70,130), 20*s, 70*l),
        fall: (s: number = 1, l: number = 1) => () => p.color(p.random(5,45), 85*s, 100*l),
        spring: (s: number = 1, l: number = 1) => () => p.color(p.random(5,45), 75*s, 100*l),
        summer: (s: number = 1, l: number = 1) => () => p.color(p.random(70,125), 80*s, 55*l)
      }
      
      // Trunk & Tree
      let trunkHeight = p.random(200, ch-100);
      let trunkWidth = p.random(150, 250);
      let treeHeight = p.random(trunkHeight, trunkHeight); // total height including leaves
      let treeWidth = p.random(trunkWidth, trunkWidth+20); // total width including leaves
      let numTrunkLines = p.random(4,18); //trunks are made up of X bezier curves

      // Points & Leaves
      let numPointsPerRow = p.random(25, 35); // X points are draw within a boundary radius
      let pointBoundaryRadius = {min: 25, max: 40};
      let avg = 50
      let numLeavesPerPoint = p.random(avg-(avg/2), avg+(avg/2)); // X leaves are draw around each point.
      let leavesStartY = p.height - bottom - pointBoundaryRadius.min - p.random(0, treeHeight/4); //where on y axis do leaves start
      let leafHeight = p.random(2, 3);
      let leafWidth = p.random(2, 2);
      let rowHeight = treeHeight/10; //x points will drawn p.randominly in each row. rows increment up by this amount

      // Start / Mid / Bulge
      const center = { x: cw / 2, y: ch - bottom / 2 };
      let startPoint = { x: p.random(center.x - cw / 2 - 200, center.x + cw / 2 + 200), y: center.y };
      let midpoint = {x: startPoint.x ,y: startPoint.y - (treeHeight/2) + bottom};
      let bulgePoint = { x: midpoint.x, y: p.random(midpoint.y, (startPoint.y - midpoint.y/3))};
    
      /** Create Tree */
      let tree = new VermontTree({
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
        fills: colors['fall'](1, 0.35), 
        fillsSunlight: colors['fall'](1, 0.7),
        sunlight, 
        leafWidth, 
        leafHeight,
        rowHeight,
        midpoint,
        bulgePoint
      });

      trees.push(tree);
    }
  };

  p.draw = () => {
    p.background(183, 52, 88);
    p.noStroke();
    p.noLoop();

    buffers.forEach(buffer => buffer?.clear()); // Clear the graphics buffers
    rowhomes.forEach(rowhome => rowhome.draw()); // Draw rowhomes
    marker_rect(0, p.height - bottom, p.width, bottom, p.color(204, 14, 60)); // Draw Sidewalk

    // Draw Trees
    p.stroke(5, 42, 12);
    p.strokeWeight(2);
    p.noFill();

    // Draw the Tree(s)
    trees.forEach(tree => {
      p.push()
      p.strokeWeight(1)
      p.stroke(5, 42, 16)
      tree.drawTrunk(p, tree.trunkLines, true)
      p.pop()
      p.push()
      p.strokeWeight(1)
      p.stroke("black")
      tree.leaves.forEach(leaf => !leaf.isSunLeaf && tree.drawLeaf(p, leaf));
      tree.leaves.forEach(leaf => leaf.isSunLeaf && tree.drawLeaf(p, leaf));
      // tree.leaves.forEach(leaf => !leaf.isSunLeaf && tree.drawLeaf(p, leaf, true));
      // tree.leaves.forEach(leaf => leaf.isSunLeaf && tree.drawLeaf(p, leaf, true));
      p.pop()
    });

    // Draw Texture
    p.blendMode(p.MULTIPLY);
    p.image(textureImg, 0, 0, cw, ch);
    p.blendMode(p.BLEND);
  };

  // class _Rowhome {
  //   constructor(p: p5, x: number, y: number, w: number, h: number, fill_c: p5.Color, stroke_c: p5.Color) {
  //     this.p = p;
  //     this.x = x;
  //     this.y = y;
  //     this.w = w;
  //     this.h = h;
  //     this.currentY = y;
  //     this.currentX = x;
  //     this.fill_c = fill_c;
  //     this.stroke_c = stroke_c;
  //   }

  //   genBasement(){
  //     const { p, x, y, w, h, fill_c, stroke_c } = this;
  //     const include = p.random([true, false]) // Not every rowhome has a basement
  //     const height = p.random(20, 50)

  //     this.h 
  //   }
  //   genMainFloor(){}
  //   genSecondaryFloor(){}
  //   genRoof(){}

  //   drawBasement(){}
  //   drawMainFloor(){}
  //   drawSecondaryFloor(){}
  //   drawRoof(){}

  //   drawDoor(){}
  //   drawWindow(){}
  // }
  
  class Rowhome {
    x: number;
    y: number;
    w: number;
    h: number;
    fill_c: p5.Color;
    stroke_c: p5.Color;
    configs: any[];
    numFloors: number;
    totalHeight: number;
    allFloors: FloorSection[][];

    constructor(
      { x, y, w, h, fill_c, stroke_c = p.color('black') }: 
      RowhomeConstructor
    ) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.fill_c = fill_c;
      this.stroke_c = stroke_c;
      this.configs = [
        // Basement
        { story: 0, min: 0, max: 80, proportion: p.random([0, p.random(0.05, 0.1)]), content: ['window'] },
        // Main Floor
        { story: 1, min: 100, max: 200, proportion: p.random(0.25, 0.35), content: ['door', 'window'] },
        // Second Floor(s)
        { story: 2, min: 100, max: 150, proportion: p.random([0, p.random(0.2, 0.25)]), content: ['circle', 'window'] },
        { story: 3, min: 0, max: 150, proportion: p.random([0, p.random(0.2, 0.25)]), content: ['circle', 'window'] },
        { story: 4, min: 0, max: 150, proportion: p.random([0, p.random(0.2, 0.25)]), content: ['circle', 'window'] },
        // Roof
        { story: 5, min: 20, max: 150, proportion: p.random(0.05, 0.25), content: ['circle', 'window'] },
      ];
      this.numFloors = this.configs.length;
      this.totalHeight = this.configs.reduce((a, b) => a + b.proportion, 0); // sum of floor all proportions. Needed to calculate floor heights
      this.allFloors = this.generateAllFloors();
    }

    /**
     * Generates all the x,y,w,h and content data for each floor in the home.
     * @returns {Array} returns a nested array for FloorSections,
     * @example [[x,y,w,h,content,fill_c, stroke_c], ...]
     */
    generateAllFloors() {
      const { x, y:_y, w, h, totalHeight, configs } = this;
      let y = _y
      return configs.map(config => {
        // @TODO: Fix this so that the total height is never exceeded
        let fh = (h / totalHeight) * config.proportion; // find each floor's height based on assigned proportion
        if (fh > config.max) fh = config.max;
        if (fh < config.min) fh = config.min;
        y -= fh;
        return this.generateFloorSections({ x, y, w, h: fh, config });
      });
    }

    /**
     * Generates all the x,y,w,h and content data for each FloorSection and returns a nested array of FloorSections
     * @returns {Array} returns a nested array for FloorSections, [[x,y,w,h,content,fill_c, stroke_c],[x,y,w,h,content], ...]
     * @example [FloorSection, FloorSection, ...]
     */
    generateFloorSections({ x, y, w, h, config }: any) {
      const { fill_c, stroke_c } = this;
      const { content } = config;
      const numCols = p.random([2, 2, 3, 3, 3, 4, 4, 4, 4, 5]);
      const sectionProportions = getSectionProportions(numCols);
      const sections = getSections(sectionProportions, numCols);
      return sections;

      // create an array populated with the proportion value of each section
      function getSectionProportions(numCols: number) {
        const sectionProportions: number[] = [];
        let remainder = numCols;
        for (let j = 0; j < numCols; j++) {
          // if it's the last index, we assign the remainder to the last index
          const value = j === numCols - 1 ? remainder : p.floor(p.random(0, remainder + 1));
          remainder -= value;
          sectionProportions.push(value);
        }
        return sectionProportions;
      }

      // Use the proportion values generated above to calculate the actual width of each section
      function getSections(sectionProportions: number[], numCols: number) {
        let sx = x;
        return sectionProportions.map(proportion => {
          const sw = (w / numCols) * proportion;
          const floorSection = new FloorSection({
            x: sx,
            y,
            w: sw,
            h,
            content: p.random(content) as unknown as string,
            fill_c,
            stroke_c,
            story: config.story
          });
          sx += sw;
          return floorSection;
        });
      }
    }

    drawFullHouseForTesting() {
      // this doesn't work at the moment
      const { x, y, w, h } = this;
      p.fill('red');
      p.rect(x - 5, ch - y - 5, w + 10, h + 10);
      p.noFill();
    }

    drawFloors() {
      const { allFloors } = this;
      allFloors.forEach(floor => {
        floor.forEach(floor_section => {
          if (floor_section.w) floor_section.draw();
        });
      });
    }

    draw() {
      this.drawFloors();
      // if (false) this.drawFullHouseForTesting();
    }
  }

  class FloorSection {
    x: number;
    y: number;
    w: number;
    h: number;
    content: string;
    fill_c: p5.Color;
    stroke_c: p5.Color;
    fill_c_dark: p5.Color;
    story: number;

    constructor({ 
      x, 
      y, 
      w, 
      h, 
      content, 
      fill_c = p.color('yellow'), 
      stroke_c = p.color('black'),
      story
    }: FloorSectionConstructor) {
      const fill_c_dark = p.color(p.hue(fill_c), p.saturation(fill_c), p.max(0, p.lightness(fill_c) - 10));
      this.x = x; 
      this.y = y; 
      this.w = w; 
      this.h = h; 
      this.content = content; 
      this.stroke_c = stroke_c; 
      this.fill_c = fill_c; 
      this.fill_c_dark = fill_c_dark 
      this.story = story;
    }

    setStyles() {
      const { fill_c, fill_c_dark } = this;
      p.stroke(fill_c_dark);
      p.strokeWeight(1);
      p.fill(fill_c);
    }

    unSetStyles() {
      p.noStroke();
      p.noFill();
    }

    drawFloorBG() {
      const { x, y, w, h } = this;
      p.rect(x, y, w, h);
    }

    drawContent() {
      const { x, y, w, h, fill_c_dark, content, story } = this;
      console.log("drawContent", content, story)
      switch (content) {
        case 'door':
          if (story === 1) drawDoor(x, y, w, h, fill_c_dark);
          break;
        case 'window':
          drawWindow(x, y, w, h, fill_c_dark);
          break;
        case 'circle':
          drawWindow(x, y, w, h, fill_c_dark);
          break;
        default:
          console.error('Section content does not exist:', content);
          break;
      }
    }

    drawTexture() {
      if (this.w <= 0 || this.h <= 0) {
        console.error('Invalid buffer dimensions', this.w, this.h);
        return;
      }

      const shadowBuffer = p.createGraphics(this.w, this.h);
      const shadowMaskBuffer = p.createGraphics(this.w, this.h);
      buffers.push(shadowBuffer, shadowMaskBuffer); // This will let us clear all buffers later

      drawTextureHatches(0, 0, this.w, this.h, shadowBuffer);

      shadowMaskBuffer.fill('black');
      shadowMaskBuffer.rect(0, 0, this.w, this.h);
      shadowMaskBuffer.noFill();

      const shadowImage = shadowBuffer.get(); // Get the current state of the graphics buffers
      const shadowMask = shadowMaskBuffer.get();
      // shadowImage.filter(BLUR, 1)

      shadowImage.mask(shadowMask); // Use the mask on the image

      p.blendMode(p.BURN);
      p.image(shadowImage, this.x, this.y);
      p.blendMode(p.BLEND); // Reset blend mode to default
    }

    draw() {
      if (this.h !== 0 && this.w !== 0) {
        this.setStyles();
        this.drawFloorBG();
        this.drawContent();
        this.drawTexture();
        this.unSetStyles();
      }
    }
  }

  //-- Details --//
  function drawDoor(x: number, y: number, w: number, h: number, _fill_c: p5.Color) {
    // x,y should always be relative to the current section, so
    // const sw = p.random(40, 50);
    // const sh = p.random(80, 100);

    // const centered = x + w / 2 - sw / 2;
    // const aligned_left = x + p.random(5, 10);
    // const aligned_right = x + w - (sw + p.random(5, 10));
    // const sx = p.random([centered, aligned_left, aligned_right]);
    // const sy = y + h - sh;

    // p.fill(fill_c);
    // p.noStroke();
    // p.rect(sx, sy, sw, sh);
    // p.noFill();

    /** ---------------- */
    /** GENERAL SETTINGS */
    /** ---------------- */
    //canvas
    let bottom = y + h
    //door
    let alignment: "left" | "center" | "right" = p.random(["left", "center", "right"])
    let dw = p.random(20, w/4) // door width
    let dh = p.random(dw * 2.5, h) // door height
    //doorframe
    let _pad = p.random(10, 30)
    let dfw = dw + _pad // door frame width
    let dfh = dh + (_pad/2) // door frame height
    //sides
    let sw = p.random(dw/4, dw/2) // This is space reserved on either side of the door
    let sh = dfh // If you want this to go up to top of the doorframe.window, you can check/use doorframeWindows.include
    //doorframe windows
    let ww = dfw //set the window width to the doorframe width. TODO: this can extend a little past irl, often patching the sides
    let wh = p.random(10, 25)
    //helpers
    let _size = {
      w: dfw + (sw*2), 
      h: dfh + wh
    }
    let _start = {
      left: {
        x: x, 
        y: bottom, 
        center: {x: 0 + _size.w/2, y: bottom}
      },
      center: {
        x: x + w/2 - _size.w/2, 
        y: bottom,
        center: {x: w/2, y: bottom}
      },
      right: {
        x: x + w - _size.w, 
        y: bottom,
        center: {x: w - (_size.w/2), y: bottom}
      }
    }[alignment] //Set alignment here
    console.log("_start", _start, alignment)
    
    
    /** DOOR FRAME SETTINGS */
    let doorframe = {
      x: _start.x + sw,
      y: _start.y - dfh,
      w: dfw,
      h: dfh,
    }
    
    /** DOOR FRAME WINDOWS SETTINGS */
    let doorframeWindows = {
      x: doorframe.x,
      y: doorframe.y - wh,
      w: ww,
      h: wh,
      shape: p.random([
        "rect",
        "hemisphere",
        "circle",
        "none"
      ]),
      include: p.random([true, false]),
      divisions: p.random([1,2,3,4])
    }
    
    /** DOOR SETTINGS */
    let door = {
      x: _start.x + sw + ((dfw-dw)/2), 
      y: _start.y - dh, 
      w: dw,
      h: dh,
      sections: {
        rows: p.random([1,2,3,4]),
        cols: p.random([1,2,3,4])
      },
      windows: {
        include: p.random([true, false]),
      }
    }
    
    /** SIDES SETTINGS */
    let side = {
      x: _start.x,
      y: _start.y - sh,
      w: sw, 
      h: sh
    }
    
    
    /*** ---- ---- ---- ***/
    /*** ---- ---- ---- ***/
    /*** ---- DRAW ---- ***/
    /*** ---- ---- ---- ***/
    /*** ---- ---- ---- ***/
    
    /** DRAW DOORFRAME */
    p.push()
    p.stroke(1)
    p.fill(p.random(["rgb(247,247,247)"]))
    // Door Doorframe
    p.rect(
      doorframe.x, 
      doorframe.y, 
      doorframe.w, 
      doorframe.h
    )
    
    /** DRAW DOORFRAME WINDOW */
    if (doorframeWindows.include) {
      switch (doorframeWindows.shape) {
        case ("rect"):
          drawDoorFrameWindowsRect()
          break;
        case ("hemisphere"):
          drawDoorFrameWindowsHemisphere()
          break;
        case ("circle"):
          drawDoorFrameWindowsCircle()
          break;
        default:
          break;
      }
    }
    
    /** DRAW DOOR */
    p.push()
    p.stroke(1)
    p.fill(p.random(["rgb(255,106,106)", "rgb(164,164,231)", "rgb(228,228,228)", "rgb(77,77,77)"]))
    p.rect(
      door.x,
      door.y,
      door.w, 
      door.h
    )
    p.pop()
    
    /** DRAW SIDES */
    p.push()
    p.stroke(1)
    p.noFill()
    // Left
    p.rect(
      side.x,
      side.y,
      side.w,
      side.h
    )
    // Right
    p.rect(
      side.x + _size.w - side.w,
      side.y,
      side.w,
      side.h
    )
    p.pop()
    
    /** DOORFRAME WINDOW FUNCS */
    function drawDoorFrameWindowsRect() {
      // Draw Container Rect
      p.rect(
        doorframeWindows.x, 
        doorframeWindows.y, 
        doorframeWindows.w, 
        doorframeWindows.h
      )
      
      // Draw Window Rects & Dividers
      let _pad = 5 // padding
      let x = doorframeWindows.x + _pad
      let y = doorframeWindows.y - doorframe.h - doorframeWindows.h + _pad
      let w = doorframeWindows.w - (_pad*2)
      let h = doorframeWindows.h - (_pad*2)
      let divisionLength = w / doorframeWindows.divisions
      p.push()
      p.fill("rgb(252,230,163)")
      p.strokeWeight(2)
      p.stroke(p.random(["rgb(224,209,196)", "rgb(88,88,88)"]))
      p.rect(x, y, w, h)
      // Draw Division Lines
      for (let i = 1; i < doorframeWindows.divisions; i++) {
        p.line(x + (i*divisionLength), y, x + (i*divisionLength), y + h)
      }
      p.pop()
    }
    
    function drawDoorFrameWindowsHemisphere() {
      // arc(x, y, w, h, start, stop, [mode], [detail])
      p.arc(
        doorframe.x + (doorframeWindows.w/2), 
        doorframe.y, 
        doorframeWindows.w,
        doorframeWindows.h,
        // doorframeWindows.w + side.w*2, // Uncomment to extend to full width include Sides
        // doorframeWindows.h * 2,
        p.PI, 
        p.TWO_PI
      );
    }
    
    function drawDoorFrameWindowsCircle() {
      //circle(x, y, d)
      let _pad = p.random(5,10)
      let circum = p.random(40, 80)
      p.circle(_start.center.x, _start.y - _size.h - _pad + circum/2, circum);
      console.log("TO DO")
    }
  }

  function drawWindow(x: number, y: number, w: number, h: number, fill_c: p5.Color) {
    const sx = x + 5;
    const sy = y + 5;
    const sw = w - 10;
    const sh = h - 10;

    p.fill(fill_c);
    p.rect(sx, sy, sw, sh);
    p.noFill();
  }

  // -- MARKERS -- //
  function marker_rect(x: number, y: number, w: number, h: number, fill_c: p5.Color = p.color('white'), stroke_c: p5.Color = p.color('black')) {
    p.stroke(stroke_c);
    p.fill(fill_c);
    p.rect(x, y, w, h);

    for (let i = 0; i < 3; i++) {
      // Draw multiple lines to make it look rough

      // Top line
      p.line(x + p.random(-2, 2), y + p.random(-2, 2), x + w + p.random(-2, 2), y + p.random(-2, 2));

      // Right line
      p.line(x + w + p.random(-2, 2), y + p.random(-2, 2), x + w + p.random(-2, 2), y + h + p.random(-2, 2));

      // Bottom line
      p.line(x + p.random(-2, 2), y + h + p.random(-2, 2), x + w + p.random(-2, 2), y + h + p.random(-2, 2));

      // Left line
      p.line(x + p.random(-2, 2), y + p.random(-2, 2), x + p.random(-2, 2), y + h + p.random(-2, 2));
    }

    p.noStroke();
    p.noFill();
  }

  function drawTextureHatches(_x: number, _y: number, w: number, h: number, buffer: p5.Graphics) {
    const lineSpacing = 6; // Spacing between squiggly lines
    const length = 20; // Length of each squiggly line
    const angle = p.PI / 4; // Direction for all lines (45 degrees)

    for (let y = _y; y < h; y += lineSpacing) {
      for (let x = _x; x < w; x += lineSpacing) {
        drawSquigglyLine(x, y, length, angle, buffer);
      }
    }
  }

  // Function to draw a single squiggly line
  function drawSquigglyLine(x: number, y: number, length: number, angle: number, buffer: p5.Graphics) {
    const segments = p.floor(length / 5); // Number of small segments in the line
    const amp = 1; // Amplitude of squiggle
    buffer.stroke('grey');
    buffer.strokeWeight(0.5); // Thinner lines for finer ink-like detail
    // buffer.stroke(0);                        // Black ink for squiggle lines

    buffer.beginShape();
    for (let i = 0; i < segments; i++) {
      const offsetX = p.cos(angle) * i * 5 + p.sin(angle) * p.random(-amp, amp);
      const offsetY = p.sin(angle) * i * 5 + p.cos(angle) * p.random(-amp, amp);

      const px = x + offsetX;
      const py = y + offsetY;

      buffer.vertex(px, py);
    }
    buffer.endShape();
  }
};

export default mySketch;