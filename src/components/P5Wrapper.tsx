import React, { useRef, useState, useEffect, CSSProperties } from 'react';
import p5 from 'p5';

interface P5WrapperProps {
  sketch: (p: p5) => void;
  includeSaveButton?: boolean;
  debug?: boolean;
  initialImageSrc?: string;
}

/** STYLES */
const buttonStyles: CSSProperties = {

}
const containerStyles: CSSProperties = {}
const menuStyles: CSSProperties = {
  display: 'flex', 
  flexDirection: 'row', 
  justifyContent: 'left',
  alignItems: 'flex-end',
}

const P5Wrapper: React.FC<P5WrapperProps> = ({ 
  sketch, 
  includeSaveButton, 
  debug = true, 
  // initialImageSrc
}) => {
  // const [isDebugMode, _setIsDebugMode] = useState(debug);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const sketchRef = useRef<(p: p5) => void | null>(sketch);

  useEffect(() => {
    setIsLoading(true);
    
    if (p5InstanceRef.current) clearSketch()
    setupSketch()

    return () => {
      clearSketch()
    }

  }, [sketch])

  const setupSketch = () => {
    sketchRef.current = sketch;
    
    setTimeout(() => {
      const p5Instance = new p5(sketchRef.current, canvasRef.current || undefined);
      p5InstanceRef.current = p5Instance;
      setIsLoading(false);
    }, 0)
  }

  const clearSketch = () => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }
  }

  /** FUNCTIONS */
  const saveCanvas = () => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.saveCanvas('myCanvas', 'png');
    }
  }

  return (
    <>
      <div style={menuStyles}>
        {isLoading && <div>Loading...</div>}
        {includeSaveButton && <button style={buttonStyles} onClick={saveCanvas}> Save </button>}
      </div>

      <div ref={canvasRef} />
    </>
  );
};

export default P5Wrapper;