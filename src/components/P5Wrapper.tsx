import React, { useRef, useState, useEffect, CSSProperties } from 'react';
import p5 from 'p5';

interface P5WrapperProps {
  sketch: (p: p5) => void;
  includeSaveButton?: boolean;
  // debug?: boolean;
  initialImageSrc?: string;
}

/** STYLES */
const buttonStyles: CSSProperties = {}
const containerStyles: CSSProperties = {
  width: '100%',
  height: '100%',
}
const menuStyles: CSSProperties = {
  display: 'flex', 
  flexDirection: 'row', 
  justifyContent: 'left',
  alignItems: 'flex-end',
}

const P5Wrapper: React.FC<P5WrapperProps> = ({ 
  sketch, 
  includeSaveButton, 
  // debug = true, 
  // initialImageSrc
}) => {
  // const [isDebugMode, _setIsDebugMode] = useState(debug);
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
    <div style={containerStyles}>
      <div style={menuStyles}>
        {isLoading && <div>Drawing...</div>}
        {includeSaveButton && <button style={buttonStyles} onClick={saveCanvas}> Save </button>}
      </div>

      <div ref={canvasRef} />
    </div>
  );
};

export default P5Wrapper;