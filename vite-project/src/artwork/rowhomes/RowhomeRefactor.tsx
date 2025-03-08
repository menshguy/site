import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import p5 from 'p5';
import { rect_wobbly } from '../../helpers/shapes';
// import {VermontTree} from '../../helpers/treeHelpers.tsx';

type Section = {
  x: number,
  y: number,
  w: number,
  h: number,
  fill: {color: p5.Color},
  drawContentFunc?: (x: number, y: number, w: number, h: number) => void
}

const mySketch = (p: p5) => {
  let buffers: p5.Graphics[] = [];
  let rowhomes: Rowhome[] = [];
  let bottom: number;
  let cw: number;
  let ch: number;
  // let drawControls = false;
  // let trees: VermontTree[] = [];
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
    // trees = [];

    // Rowhome(s) - @TODO: These will all become PROPS
    const h = p.random(ch / 3, ch);
    const w = p.random(ch / 6, cw);
    const startX = (cw/2) - (w/2);
    const startY = ch - bottom;
    const baseFill = {color: p.color(23, 30, 30)}
    const rowhome = new Rowhome(startX, startY, w, h, baseFill);
    rowhomes.push(rowhome);
  };

  p.draw = () => {
    p.background("antiquewhite");
    p.noStroke();
    p.noLoop();

    rowhomes.forEach( rowhome => {
      rowhome.stories.forEach(({sections}) => {
        sections?.forEach((section) => {
          rowhome.drawSection(section) // For each story, draw each section and the content within
        })
      })
    })
  };

  class Rowhome {
    startX: number
    startY: number
    w: number
    h: number
    stories: {x: number, y: number, w: number, h: number, sections?:Section[]}[]
    baseFill: {color: p5.Color}

    constructor(startX: number, startY: number, width: number, _height: number, baseFill: {color: p5.Color}) {

      // Start Point
      this.startX = startX;
      this.startY = startY;

      // Dimensions
      this.w = width;
      this.h = _height; // not used, height is dynamic

      // Stories - TODO: Make this a prop and configure it outside
      this.stories = this.generateStories(startX, startY, width, _height)

      // baseFill
      this.baseFill = baseFill;

      // Drawing Styles - TODO: Make the lines and textures a prop.
    }

    generateStories(x:number, y:number, w:number, _h:number) {
      let stories = [];
      // let y = startY;
      // let x = startX;
      // let w = width;
      
      // Basement
      if (p.random([true, false])) {
        let h = 20;
        y -= h;

        const numSections = p.random([1,2,3,4]) // Number of sections
        const content = ["window", "window", "window", "window"].slice(0, numSections) // Take the first X elements up to numSections
        const sections = this.generateSections({x, y, w, h, fill: this.baseFill, content})

        stories.push({x, y, w, h, sections})
      }

      // Main Floor
      if (true) {
        let h = 150;
        y -= h

        // Configure Sections & Content within each section
        const numSections = p.random([1,2,3,4])
        const content = ["door", "window", "window", "window"].slice(0, numSections) 
        const sections = this.generateSections({x, y, w, h, fill: this.baseFill, content})

        stories.push({x, y, w, h, sections})
      }
      
      // Stories
      if (true) {
        let numStories = p.random([1,2,3,4])
        const numSections = p.random([1,2,3,4])
        const content = ["window", "window", "window", "window"].slice(0, numSections)
        const storyFill = this.baseFill
  
        while (numStories > 0) {
          let h = 100;
          y -= h;
          
          const sections = this.generateSections({x, y, w, h, fill: this.baseFill, content})

          stories.push({x, y, w, h, sections})
          numStories--
        }
      }
      
      // Rooftop
      if (p.random([true, false])) {
        let h = 50;
        y -= h
        
        const numSections = p.random([1,2,3,4])
        const content = ["window", "window", "window", "window"].slice(0, numSections)
        const sections = this.generateSections({x, y, w, h, fill: this.baseFill, content})

        stories.push({x, y, w, h, sections})
      }

      return stories
    }

    generateSections({x, y, w, h, fill, content}: {x: number, y: number, w: number, h: number, fill: {color: p5.Color}, content: string[]}) {

      // Content Options
      let drawContentFuncs: Record<string, (x: number, y: number, sw: number, sh: number) => void> = {
        door: this.drawDoor,
        window: this.drawWindow,
        blank: () => {}
      }

      let sectionWidth = w / content.length; // Divide sections evenly
      let sectionStartX = x

      return content.map(shape => {
        let drawContentFunc = drawContentFuncs[shape]
        let section = {x: sectionStartX, y, w: sectionWidth, h, fill, drawContentFunc}
        sectionStartX += sectionWidth;
        return section;
      })
    }

    drawSection({x, y, w, h, fill, drawContentFunc}: {x: number, y: number, w: number, h: number, fill: {color: p5.Color}, drawContentFunc?: (x: number, y: number, w: number, h: number) => void}){
      p.push()
      p.fill(0, 0, 100, 0) // HSL with alpha: hue, saturation, lightness, alpha
      p.stroke("pink")
      rect_wobbly(p, x, y, w, h, 1, 3, fill)
      if (drawContentFunc) drawContentFunc(x, y, w, h)
      p.pop()
    }

    drawDoor(x: number, y: number, sw: number, sh: number){
      // Door Sections
      const doorWidth = (50 > sw) ? sw : 50
      const doorHeight = (100 > sh) ? sh : 100

      // Align Door within the section
      const alignments = {left: x, center: x + (sw/2) - doorWidth, right: sw - doorWidth}
      const alignment = p.random(["left", "center", "right"]) as "left" | "center" | "right"
      const startX = alignments[alignment]
      const startY = y + (sh-doorHeight); // y represents the top of the section, so we have to nav to bottom and then up to the start of the door rect

      // Draw Door
      p.push()
      const fill = {color: p.color("pink")}
      rect_wobbly(p, startX, startY, doorWidth, doorHeight, 1, 3, fill)
      p.pop()
    }

    drawWindow(x: number, y: number, sw: number, sh: number){
      // Window Sections
      const windowWidth = (50 > sw) ? sw : 50
      const windowHeight = (50 > sh) ? sh : 50

      // Draw Window
      p.push()
      const fill = {color: p.color("aliceblue")}
      rect_wobbly(p, x, y, windowWidth, windowHeight, 1, 1, fill)
      p.pop()
    }
  }
};

const Rowhome3: React.FC = () => {
  return (
    <div>
      <h1>Rowhome 3</h1>
      <p>11/1/24</p>
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export {mySketch};
export default Rowhome3;