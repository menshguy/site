import p5 from 'p5';
import { rect_wobbly } from '../../helpers/shapes';
// import {VermontTree} from '../../helpers/treeHelpers.tsx';

type Section = {
  x: number,
  y: number,
  w: number,
  h: number,
  fill: {color: p5.Color},
  stroke: {color: p5.Color, strokeWeight: number},
  drawContentFunc?: (x: number, y: number, w: number, h: number) => void
}

type Story = {
  x: number, 
  y: number, 
  w: number, 
  h: number, 
  contents: string[]
}

const mySketch = (p: p5) => {
  // let buffers: p5.Graphics[] = [];
  let rowhomes: Rowhome[] = [];
  let bottom: number;
  let cw: number;
  let ch: number;
  // let drawControls = false;
  // let trees: VermontTree[] = [];
  // let textureImg: p5.Image;
  
  // p.preload = () => {
  //   textureImg = p.loadImage('/textures/watercolor_1.jpg');
  // };

  p.setup = () => {
    cw = 800;
    ch = 550;
    p.createCanvas(cw, ch);

    // General Settings
    p.colorMode(p.HSL);
    bottom = 25;

    // Clear objects (for redraws)
    rowhomes = [];
    // _buffers = [];
    // trees = [];

    // Rowhome(s) - @TODO: These will all become PROPS
    // const h = p.random(ch / 3, ch);
    const h = p.random(300, ch - bottom);
    const w = p.random(ch / 6, cw);
    const startX = (cw/2) - (w/2);
    const startY = ch - bottom;
    const baseFill = {color: p.color("lightblue")}
    const baseStroke = {color: p.color("black"), strokeWeight: 1};
    const rowhome = new Rowhome(startX, startY, w, h, baseFill, baseStroke);
    rowhomes.push(rowhome);
  };

  p.draw = () => {
    p.background("antiquewhite");
    p.noLoop();

    // Draw each rowhome
    rowhomes.forEach( rowhome => {
      // Draw each section
      rowhome.sections.forEach( sections => {
        sections.forEach(({x, y, w, h, fill, stroke, drawContentFunc}) => {
          rowhome.drawSection({x, y, w, h, fill, stroke, drawContentFunc}) 
        })
      })
    })
  };

  class Rowhome {
    startX: number
    startY: number
    w: number
    h: number
    stories: Story[]
    sections: Section[][]
    baseFill: {color: p5.Color}
    baseStroke: {color: p5.Color, strokeWeight: number}

    constructor(startX: number, startY: number, width: number, height: number, baseFill: {color: p5.Color}, baseStroke: {color: p5.Color, strokeWeight: number}) {

      // baseFill
      this.baseFill = baseFill;
      this.baseStroke = baseStroke;
      
      // Start Point
      this.startX = startX;
      this.startY = startY;

      // Dimensions
      this.w = width;
      this.h = height; // not used, height is dynamic

      // Stories
      this.stories = this.generateStories(startX, startY, width, height)
      
      // Sections
      const fill = this.baseFill
      const stroke = this.baseStroke
      this.sections = this.stories.map(({x, y, w, h, contents}) => this.generateSections({x, y, w, h, contents, fill, stroke}))
    }

    generateStories(x:number, y:number, w:number, h:number) {
      let stories = [];
      // let y = startY;
      // let x = startX;
      // let w = width;
      
      // Basement
      if (p.random([true, false])) {
        let h = 20;
        y -= h;

        const numSections = p.random([1,2,3,4]) // Number of sections
        const contents = ["window", "window", "window", "window"].slice(0, numSections) // Take the first X elements up to numSections

        stories.push({x, y, w, h, contents})
      }

      // Main Floor
      if (true) {
        let h = 150;
        y -= h

        // Configure Sections & Content within each section
        const numSections = p.random([1,2,3,4])
        const contents = ["door", "window", "window", "window"].slice(0, numSections) 

        stories.push({x, y, w, h, contents})
      }
      
      // Stories
      if (true) {
        let numStories = p.random([1,2,3,4])
        const numSections = p.random([1,2,3,4])
        const contents = ["window", "window", "window", "window"].slice(0, numSections)
  
        while (numStories > 0) {
          let h = 100;
          y -= h;
          
          stories.push({x, y, w, h, contents})
          numStories--
        }
      }
      
      // Rooftop
      if (p.random([true, false])) {
        let h = 50;
        y -= h
        
        const numSections = p.random([1,2,3,4])
        const contents = ["window", "window", "window", "window"].slice(0, numSections)

        stories.push({x, y, w, h, contents})
      }

      // Calculate the total height of all stories
      const totalHeight = stories.reduce((acc, story) => acc + story.h, 0);
      
      // Normalize the subdivisions and depth values to sum up to h
      let acc = 0
      const normalizedStories = stories.map(story => {
        const normalizedHeight = story.h / totalHeight * h;
        acc += (story.h - normalizedHeight)
        return { ...story, h: normalizedHeight, y: story.y + acc }
      })
      
      return normalizedStories;
    }

    generateSections({x, y, w, h, fill, stroke, contents}: {x: number, y: number, w: number, h: number, fill: {color: p5.Color}, stroke: {color: p5.Color, strokeWeight: number}, contents: string[]}) {
      // Content Options
      const drawContentFuncs: Record<string, (x: number, y: number, sw: number, sh: number) => void> = {
        door: this.drawDoor,
        window: this.drawWindow,
        blank: () => {}
      }

      // Configure Sections
      const sectionWidth = w / contents.length; // Divide sections evenly for now. TODO: Randomize? Pass as Argument?
      let sectionStartX = x

      return contents.map(content => {
        const drawContentFunc = drawContentFuncs[content]
        const section = {x: sectionStartX, y, w: sectionWidth, h, fill, stroke, drawContentFunc}
        sectionStartX += sectionWidth;
        return section;
      })
    }

    drawSection({x, y, w, h, fill, stroke, drawContentFunc}: {x: number, y: number, w: number, h: number, fill: {color: p5.Color}, stroke: {color: p5.Color, strokeWeight: number}, drawContentFunc?: (x: number, y: number, w: number, h: number) => void}){
      rect_wobbly(p, x, y, w, h, 1, 3, fill, stroke)
      if (drawContentFunc) drawContentFunc(x, y, w, h)
    }

    drawDoor(x: number, y: number, sw: number, sh: number){
      // Door Sections
      const doorWidth = (50 > sw) ? sw : 50
      const doorHeight = (100 > sh) ? sh : 100

      // Align Door within the section
      const padding = 10
      const alignments = {left: x + padding, center: x + (sw/2) - doorWidth, right: x + sw - doorWidth - padding}
      const alignment = p.random(["left", "center", "right"]) as "left" | "center" | "right"
      const startX = alignments[alignment]
      const startY = y + (sh-doorHeight); // y represents the top of the section, so we have to nav to bottom and then up to the start of the door rect

      // Draw Door
      p.push()
      const fill = {color: p.color("pink")}
      const stroke = {color: p.color("black"), strokeWeight: 1}
      rect_wobbly(p, startX, startY, doorWidth, doorHeight, 1, 3, fill, stroke)
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

export default mySketch;