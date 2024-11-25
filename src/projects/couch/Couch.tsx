import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import p5 from 'p5';

const mySketch = (p: p5) => {

  let cw: number = 600; 
  let ch: number = 600;
  let model: p5.Geometry;
  let y: number = -100;
  let prevY: number = 0;
  
  p.preload = () => {
    
    p.loadModel(
      '/couch3d/11_20_2024.obj',
      true,
      handleModel,
      handleError
    );

    function handleModel(data: p5.Geometry) {
      model = data;
      console.log(model);
    }
    
    // Print an error message if the file doesn't load.
    function handleError(error: unknown) {
      console.error('Oops!', error);
    }
  }
  
  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(cw, ch, p.WEBGL);

    // Camera position
    p.camera(0, 0, (p.height / 2) / p.tan(p.PI / 6), 0, 0, 0, 0, 1, 0);

    // Limit frame rate to 30 FPS
    p.frameRate(30); 

  }
  
  p.draw = () => {
    // p.noLoop();

    // Camera Controls
    p.orbitControl(); // Allows mouse control of the camera
    
    // Translation
    p.translate(-60, -140, 0); // Try different values to bring the model into view
    p.rotateX(p.radians(180)); // Rotate 180 degrees around the y-axis
    p.rotateY(p.radians(195)); // Rotate 180 degrees around the y-axis
    p.rotateZ(0); // Rotate 180 degrees around the z-axis
    p.scale(6); 
    
    // Lighting
    // p.ambientLight(150);
    p.pointLight(50, 50, 50, 0, y, 0);

    // Get pixel data from buffer3d
    if (prevY !== y) {
      p.background("antiquewhite");
      p.noStroke(); // Disable drawing the edges of the model
      console.log("y", y)

      // Model
      p.model(model); // Render the 3D model

      p.loadPixels();
      const density = p.pixelDensity();
      const adjustedWidth = p.width * density;
      const adjustedHeight = p.height * density;
      
      const brightnessThreshold = 70; // Set your desired brightness threshold
  
      for (let x = 0; x < adjustedWidth; x++) {
        for (let y = 0; y < adjustedHeight; y++) {
          const index = (x + y * adjustedWidth) * 4;
          const r = p.pixels[index];
          const g = p.pixels[index + 1];
          const b = p.pixels[index + 2];
          // const a = p.pixels[index + 3];
  
          // Calculate brightness using HSB mode
          const color = p.color(r, g, b);
          const brightness = p.brightness(color);
  
          if (brightness > brightnessThreshold) {
            p.pixels[index] = r;
            p.pixels[index + 1] = g;
            p.pixels[index + 2] = b;
            p.pixels[index + 3] = 255;
          } else {
            // p.pixels[index] = 0;
            // p.pixels[index + 1] = 0;
            // p.pixels[index + 2] = 0;
            p.pixels[index + 3] = 0;
          }
        }
      }
      
      prevY = y;
      p.updatePixels();
    }
  }
  
  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      y += 10
    }
  };
  
};

const ThreeDTest: React.FC = () => {
  return (
    <div>
      <h1>3D</h1>
      <p>Click to redraw.</p>
      <P5Wrapper sketch={mySketch} />
    </div>
  );
};

export default ThreeDTest;