import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import p5 from 'p5';

const mySketch = (p: p5) => {

  let cw: number = 600; 
  let ch: number = 600;
  let model: p5.Geometry;
  let drawing: p5.Image;
  let buffer: p5.Graphics;
  let y: number = -100;
  let prevY: number = 0;
  
  p.preload = () => {
    drawing = p.loadImage('/couch3d/couch.png');

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
    p.createCanvas(cw, ch);
    buffer = p.createGraphics(cw, ch, p.WEBGL);

    // Camera position
    buffer.camera(0, 0, (buffer.height / 2) / buffer.tan(buffer.PI / 6), 0, 0, 0, 0, 1, 0);

    // Limit frame rate to 30 FPS
    buffer.frameRate(30); 

  }
  
  p.draw = () => {
    p.noLoop();

    // Camera Controls
    buffer.orbitControl(); // Allows mouse control of the camera
    
    // Translation
    buffer.translate(-60, -140, 0); // Try different values to bring the model into view
    buffer.rotateX(buffer.radians(180)); // Rotate 180 degrees around the y-axis
    buffer.rotateY(buffer.radians(195)); // Rotate 180 degrees around the y-axis
    buffer.rotateZ(0); // Rotate 180 degrees around the z-axis
    buffer.scale(6); 
    
    // Lighting
    // buffer.ambientLight(150);
    buffer.pointLight(200, 200, 200, 0, y, 0);

    // Get pixel data from b3d
    console.log("inner y", y)
    if (prevY !== y) {
      buffer.background("antiquewhite");
      buffer.noStroke(); // Disable drawing the edges of the model

      // Model
      buffer.model(model); // Render the 3D model

      buffer.loadPixels();
      const density = buffer.pixelDensity();
      const adjustedWidth = buffer.width * density;
      const adjustedHeight = buffer.height * density;
      
  
      for (let x = 0; x < adjustedWidth; x++) {
        for (let y = 0; y < adjustedHeight; y++) {
          const index = (x + y * adjustedWidth) * 4;
          const r = buffer.pixels[index];
          const g = buffer.pixels[index + 1];
          const b = buffer.pixels[index + 2];
          // const a = buffer.pixels[index + 3];
  
          // Calculate brightness using HSB mode
          const color = buffer.color(r, g, b);
          const brightness = buffer.brightness(color);
          const brightnessThreshold = 40; // Set your desired brightness threshold
          if (brightness < brightnessThreshold) {
            buffer.pixels[index] = r;
            buffer.pixels[index + 1] = g;
            buffer.pixels[index + 2] = b;
            buffer.pixels[index + 3] = 255;
          } else {
            // buffer.pixels[index] = 0;
            // buffer.pixels[index + 1] = 0;
            // buffer.pixels[index + 2] = 0;
            buffer.pixels[index + 3] = 0;
          }
        }
      }
      
      prevY = y;
      buffer.updatePixels();
    }

    p.image(buffer, 0, 0, cw, ch)
    p.image(drawing, 0, 0, cw, ch)
  }
  
  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      console.log("click runs", y)
      y += 10;
      p.clear()
      p.redraw()
    }
  };
  
};

const ThreeDTest: React.FC = () => {
  return (
    <div>
      <h1>3D</h1>
      <p>Click to redraw.</p>
      <P5Wrapper includeSaveButton sketch={mySketch} />
    </div>
  );
};

export default ThreeDTest;