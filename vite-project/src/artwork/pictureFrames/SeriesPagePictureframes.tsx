import React from 'react';
import { useDevice } from '../../context/DeviceContext.tsx';
import { useNav } from '../../context/NavContext.tsx';
import SeriesPage from '../../components/SeriesPage.tsx';
import royalFrameSketch from './royalFrameSketch.tsx';
import scribbleFrame from './scribbleFrameSketch.tsx';
import scribbleFrame2 from './scribbleFrame2Sketch.tsx';

const route = "artwork/pictureframes";

const SeriesPagePictureframes: React.FC = () => {
    const { isMobile, deviceWidth, deviceHeight } = useDevice();
    const {navHeight} = useNav();
    const userPrompt = isMobile ? 'Refresh page to redraw.' : 'Click to redraw. Refresh Page to resize.';
    const padding = isMobile ? 0 : 50;
    let innerWidth, innerHeight, frameTopWidth, frameSideWidth;

    /** Configure Frame */
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

    const royalFrameSketchWithProps = royalFrameSketch(innerWidth, innerHeight, frameTopWidth, frameSideWidth, PromptA, PromptB)
    const scribbleFrameWithProps = scribbleFrame(innerWidth, innerHeight, frameTopWidth, frameSideWidth)
    const scribbleFrame2WithProps = scribbleFrame2(innerWidth, innerHeight, frameTopWidth, frameSideWidth)

    const sketches = [
        {sketch: royalFrameSketchWithProps, subroute: 'royalframe', label: 'Royal Frame'},
        {sketch: scribbleFrameWithProps, subroute: 'scribbleframe', label: 'Scribble Frame'},
        {sketch: scribbleFrame2WithProps, subroute: 'scribbleframe2', label: 'Scribble Frame 2'},
    ];

    return (
      <SeriesPage
        sketches={sketches}
        route={route}
        disable={isMobile}
      />
    );
};

export default SeriesPagePictureframes;