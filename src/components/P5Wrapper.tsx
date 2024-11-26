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
        setIsLoading(true);
        console.log("draw start")
        if (originalDraw) {
          originalDraw.call(p5Instance);
          console.log("draw fin")
          setIsLoading(false);
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
    {isLoading && <div>Loading...</div>}
    {!isLoading && <div ref={canvasRef} />}
    </>
  );
};

export default P5Wrapper;