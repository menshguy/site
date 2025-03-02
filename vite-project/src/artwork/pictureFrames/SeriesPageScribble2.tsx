import React from 'react';
import p5 from 'p5';
import { useDevice } from '../../context/DeviceContext.tsx';
import { useNav } from '../../context/NavContext.tsx';
import ScribbleFrame2 from './ScribbleFrame2.tsx';

const blankSketch = (
    innerWidth: number, 
    innerHeight: number,
    promptA: string,
    promptB: string
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
        p.text(promptA, cw/2, ch/2)
        p.text(promptB, cw/2, (ch/2)+20)
    }
    
    // p.mousePressed = () => {
    //   // Check if mouse is inside canvas
    //   if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
    //   }
    // }
};


const SeriesPage: React.FC = () => {
    const { isMobile, deviceWidth, deviceHeight } = useDevice();
    const {navHeight} = useNav();
    const userPrompt = isMobile ? 'Refresh page to redraw.' : 'Refresh Page to Resize. Click to Redraw.';
    const padding = isMobile ? 0 : 50;
    let innerWidth, innerHeight, frameTopWidth, frameSideWidth;


    if (isMobile) {
        // Mobile
        frameTopWidth = Math.floor(Math.random() * (100 - 20 + 1)) + 20
        frameSideWidth = frameTopWidth
        innerWidth = deviceWidth - (frameSideWidth * 2)
        innerHeight = deviceHeight - (frameTopWidth * 2) - navHeight
    } else {
        // Desktop
        let widthTotal = deviceWidth - padding * 2;
        const maxFrameWidth = isMobile ? 50 : 200;
        widthTotal -= maxFrameWidth * 2;
        const maxInnerWidth = widthTotal;

        let heightTotal = deviceHeight - padding * 2;
        const maxFrameHeight = isMobile ? 50 : 200;
        heightTotal -= maxFrameHeight * 2;
        const maxInnerHeight = heightTotal;

        innerWidth = Math.floor(Math.random() * (maxInnerWidth - 300 + 1)) + 300;
        innerHeight = Math.floor(Math.random() * (maxInnerHeight - 300 + 1)) + 300;
        frameTopWidth = Math.floor(Math.random() * (maxFrameWidth - 100 + 1)) + 100;
        frameSideWidth = Math.floor(Math.random() * (maxFrameHeight - 100 + 1)) + 100;
    }

    const PromptA = "This is a picture frame.";
    const PromptB = userPrompt;

    return (
        <div style={{padding: padding}}>
        {/* <h1>Royal Picture Frames</h1>
        <p>{userPrompt}</p> */}
        <ScribbleFrame2 
            innerWidth={innerWidth} 
            innerHeight={innerHeight} 
            frameTopWidth={frameTopWidth}
            frameSideWidth={frameSideWidth}
            showPrompt={false}
            innerSketch={blankSketch(innerWidth, innerHeight, PromptA, PromptB)} 
        />
        </div>
    );
};

export default SeriesPage;