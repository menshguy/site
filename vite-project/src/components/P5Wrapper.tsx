import React, { useRef, useState, useEffect, CSSProperties } from 'react';
import { useDevice } from '../context/DeviceContext';
import p5 from 'p5';

interface P5WrapperProps {
  sketch: (p: p5) => void;
  includeSaveButton?: boolean;
  // debug?: boolean;
  initialImageSrc?: string;
  disableClickToRedraw?: boolean;
  disableClickToSetup?: boolean;
  disableClickToClear?: boolean;
}

/** STYLES */
const buttonStyles: CSSProperties = {}

const P5Wrapper: React.FC<P5WrapperProps> = ({ 
  sketch, 
  includeSaveButton = false,
  disableClickToClear = false,
  disableClickToSetup = false,
  disableClickToRedraw = false,
  // debug = true, 
  // initialImageSrc
}) => {
  // const [isDebugMode, _setIsDebugMode] = useState(debug);
  const {isMobile} = useDevice();
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    console.log('(P5Wrapper.tsx) useEffect sketch', sketch);
    if (sketch !== undefined) setupSketch(sketch)
    return () => clearSketch()
  }, [sketch]);
  
  /** FUNCTIONS */
  const setupSketch = (sketch: (p: p5) => void) => {
    setIsLoading(true);
    
    // Use requestAnimationFrame to ensure the component can render isLoading updates
    animationFrameIdRef.current = requestAnimationFrame(() => {
      p5InstanceRef.current = new p5(sketch, canvasRef.current || undefined);
      
      // Set mouse methods for mobile and desktop
      if (isMobile) {
        /** @TODO: Implement touch events for Mobile so a tap redraws but a drag does not */
        // p5InstanceRef.current.touchStarted = touchStarted;
        // p5InstanceRef.current.touchEnded = touchEnded;
      } else {
        p5InstanceRef.current.mousePressed = mousePressed;
      }
      
      function mousePressed () {
        const width = p5InstanceRef.current?.width || 0;
        const height = p5InstanceRef.current?.height || 0;
        const mouseX = p5InstanceRef.current?.mouseX || 0;
        const mouseY = p5InstanceRef.current?.mouseY || 0;
        const isWithinSketchBorder = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
        console.log('(P5Wrapper.tsx) mousePressed', p5InstanceRef.current, isWithinSketchBorder, p5InstanceRef.current?.mouseX, p5InstanceRef.current?.mouseY);
        
        if (!disableClickToClear && isWithinSketchBorder) p5InstanceRef.current?.clear();
        if (!disableClickToSetup && isWithinSketchBorder) p5InstanceRef.current?.setup();
        if (!disableClickToRedraw && isWithinSketchBorder) p5InstanceRef.current?.draw();
      }

      setIsLoading(false);
    });
  }

  const clearSketch = () => {
    console.log('(P5Wrapper.tsx) clearSketch', p5InstanceRef.current);
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove(); // Remove the p5 instance
      p5InstanceRef.current = null; // Clear the reference
    }
    
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current); // Cancel the animation frame so we do not get duplicate p5 instances
      animationFrameIdRef.current = null;
    }
  }
  
  const saveCanvas = () => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.saveCanvas('myCanvas', 'png');
    }
  }

  return (
    <>
      {isLoading && <div>Drawing...</div>}
      {includeSaveButton && <button style={buttonStyles} onClick={saveCanvas}> Save </button>}

      <div ref={canvasRef} />
    </>
  );
};

export default P5Wrapper;