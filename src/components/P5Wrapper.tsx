import React, { useRef, useState, useEffect } from 'react';
import p5 from 'p5';

interface P5WrapperProps {
  sketch: (p: p5) => void;
  includeSaveButton?: boolean;
}

const P5Wrapper: React.FC<P5WrapperProps> = ({ sketch, includeSaveButton }) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let p5Instance: p5 | null = null;

    if (canvasRef.current) {
      p5Instance = new p5(sketch, canvasRef.current);

      // Once the sketch is ready, set loading to false
      const originalDraw = p5Instance.draw;
      p5Instance.draw = () => {
        
        let startTime = new Date()
        console.log("draw start");

        if (originalDraw) {
          originalDraw.call(p5Instance);
          
          let endTime = new Date()
          let duration = (endTime.getTime() - startTime.getTime())/1000;
          console.log("draw fin", duration)
          
          setIsLoading(false);
        }
      };
      
      // Once the sketch is ready, set loading to false
      const originalSetup = p5Instance.setup;
      p5Instance.setup = () => {
        
        setIsLoading(true);
        
        let startTime = new Date()
        console.log("setup start");
        
        if (originalSetup) {
          originalSetup.call(p5Instance);
          
          let endTime = new Date()
          let duration = (endTime.getTime() - startTime.getTime())/1000;
          console.log("setup fin", duration)
        }
      };

      // Create a button to save the canvas
      if (includeSaveButton && p5Instance) {
        const saveButton = p5Instance.createButton('Save Canvas');
        saveButton.position(10, 10); // Position the button on the canvas
        saveButton.mousePressed(() => {
          p5Instance?.saveCanvas('myCanvas', 'png'); // Save the canvas as a PNG file
        });
      }
    }

    return () => {
      if (p5Instance) {
        p5Instance.remove();
      }
    };
  }, [sketch]);

  return (
    <>
    <div ref={canvasRef} />
    </>
  );
};

export default P5Wrapper;