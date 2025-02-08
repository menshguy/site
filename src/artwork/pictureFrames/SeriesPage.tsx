import React from 'react';
import p5 from 'p5';
import { useDevice } from '../../context/DeviceContext.tsx';
import RoyalFrame from './RoyalFrame';

const blankSketch = (
    innerWidth: number, 
    innerHeight: number
) => (p: p5) => {
  
    /** CANVAS SETTINGS */
    let cw = innerWidth;
    let ch = innerHeight;
    
    p.preload = () => {
        // font = p.loadFont('https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto-Mono/RobotoMono-Regular.ttf');
    }
  
    p.setup = () => {
      p.createCanvas(cw, ch)
      p.colorMode(p.HSL)
      p.textFont('Courier New')
      p.textSize(12)
      p.textAlign(p.CENTER, p.CENTER)
    }

    p.draw = () => {
        p.noLoop()
        p.background("antiquewhite")
        p.fill(0)
        p.text("This is a picture frame.", cw/2, ch/2)
    }
    
    // p.mousePressed = () => {
    //   // Check if mouse is inside canvas
    //   if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
    //   }
    // }
};


const SeriesPage: React.FC = () => {
    const { isMobile, deviceWidth, deviceHeight } = useDevice();
    const userPrompt = isMobile ? 'Refresh page to redraw' : 'Click to redraw. Refresh Page to resize.';

    const padding = isMobile ? 5 : 50;
    
    let widthTotal = deviceWidth - padding * 2;
    const maxFrameWidth = isMobile ? 50 : 200;
    widthTotal -= maxFrameWidth * 2;
    const maxInnerWidth = widthTotal;
    
    let heightTotal = deviceHeight - padding * 2;
    const maxFrameHeight = isMobile ? 50 : 200;
    heightTotal -= maxFrameHeight * 2;
    const maxInnerHeight = heightTotal;
 

    const innerWidth = Math.floor(Math.random() * (maxInnerWidth - 300 + 1)) + 300;
    const innerHeight = Math.floor(Math.random() * (maxInnerHeight - 300 + 1)) + 300;
    const frameTopWidth = Math.floor(Math.random() * (maxFrameWidth - 100 + 1)) + 100;
    const frameSideWidth = Math.floor(Math.random() * (maxFrameHeight - 100 + 1)) + 100;

    return (
        <div style={{padding: padding}}>
        <h1>Royal Picture Frames</h1>
        <p>{userPrompt}</p>
        <RoyalFrame 
            innerWidth={innerWidth} 
            innerHeight={innerHeight} 
            frameTopWidth={frameTopWidth}
            frameSideWidth={frameSideWidth}
            showPrompt={false}
            innerSketch={blankSketch(innerWidth, innerHeight)} 
        />
        </div>
    );
};

export default SeriesPage;