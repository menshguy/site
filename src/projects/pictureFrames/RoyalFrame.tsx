import React, { CSSProperties } from 'react';
import P5Wrapper from '../../components/P5Wrapper';
import p5 from 'p5'

interface RoyalFrameProps {
  innerSketch: (p: p5) => void;
  innerWidth: number;
  innerHeight: number;
  frameTopWidth: number;
  frameSideWidth: number;
}

const mySketch = (innerWidth: number, innerHeight: number, frameTopWidth: number, frameSideWidth: number) => (p: p5) => {
  let cw = innerWidth + (frameSideWidth * 2)
  let ch = innerHeight + (frameTopWidth * 2);
  
  p.setup = () => {
    p.createCanvas(cw, ch);
    p.colorMode(p.HSL);
  }
  
  p.draw = () => {
    // p.background("antiquewhite");

    // Top
    p.push(); 
    p.fill("red")
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(cw, 0);
    p.vertex(cw - frameSideWidth, frameTopWidth);
    p.vertex(frameSideWidth, frameTopWidth);
    p.endShape(p.CLOSE);
    p.pop();
    
    // Left
    p.push(); 
    p.fill("blue")
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(0, ch);
    p.vertex(frameSideWidth, ch - frameTopWidth);
    p.vertex(frameTopWidth, frameSideWidth);
    p.endShape(p.CLOSE);
    p.pop();
    
    // Right
    p.push(); 
    p.fill("orange")
    p.beginShape();
    p.vertex(cw, 0);
    p.vertex(ch, cw);
    p.vertex(cw - frameSideWidth, ch - frameTopWidth);
    p.vertex(cw - frameSideWidth, frameTopWidth);
    p.endShape(p.CLOSE);
    p.pop();
    
    // Bottom
    p.push(); 
    p.fill("yellow")
    p.beginShape();
    p.vertex(0, ch);
    p.vertex(cw, ch);
    p.vertex(cw - frameSideWidth, ch-frameTopWidth);
    p.vertex(frameSideWidth, ch-frameTopWidth);
    p.endShape(p.CLOSE);
    p.pop();
  }
  
  p.mousePressed = () => {
    // Check if mouse is inside canvas
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
    }
  }
};

const RoyalFrame: React.FC<RoyalFrameProps> = ({
  innerWidth, 
  innerHeight,
  frameTopWidth,
  frameSideWidth,
  innerSketch
}) => {

  const containerStyles: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }

  const outerWrapperStyles: CSSProperties = {
    width: `${innerWidth}px`,
    height: `${innerHeight}px`,
    position: 'absolute',
    top: `0px`,
    left: `0px`,
  }
  const innerWrapperStyles: CSSProperties = {
    width: `${innerWidth}px`,
    height: `${innerHeight}px`,
    position: 'absolute',
    top: `${0 + frameTopWidth}px`,
    left: `${0 + frameSideWidth}px`,
  }

  return (
    <div style={containerStyles}>
      <div style={innerWrapperStyles}>
        <P5Wrapper sketch={innerSketch} />
      </div>
      <div style={outerWrapperStyles}>
        <P5Wrapper sketch={mySketch(innerWidth, innerHeight, frameTopWidth, frameSideWidth)} />
      </div>
    </div>
  );
};

export {mySketch};
export default RoyalFrame;