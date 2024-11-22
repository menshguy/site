import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import p5 from 'p5';

const mySketch = (p: p5) => {

  // let cw: number = window.innerWidth; 
  // let ch: number = window.innerHeight;
  let cw: number = 600; 
  let ch: number = 600;
  let model: p5.Geometry;
  let textureImg: p5.Image;
  let alteredTexture: p5.Graphics;
  let buffer3d: p5.Graphics;
  
  p.preload = () => {
    textureImg = p.loadImage('couch3d/textures/color.jpg');
    
    p.loadModel(
      '/couch3d/11_20_2024.obj',
      true,
      handleModel,
      handleError
    );

    function handleModel(data) {
      model = data;
      console.log(model.gid);
    }
    
    // Print an error message if the file doesn't load.
    function handleError(error) {
      console.error('Oops!', error);
    }
  }
  
  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(cw, ch);
    p.background("antiquewhite");
    // Create a buffer3d canvas
    buffer3d = p.createGraphics(cw, ch, p.WEBGL);
    buffer3d.colorMode(buffer3d.HSL);
    
    // Create Altered Texture - apply modifications to this.
    // alteredTexture = p.createGraphics(textureImg.width, textureImg.height);
    // alteredTexture.image(textureImg,0,0)

    // Camera position
    buffer3d.camera(0, 0, (p.height / 2) / p.tan(p.PI / 6), 0, 0, 0, 0, 1, 0);

    // Create a button to save the canvas
    const saveButton = p.createButton('Save Canvas');
    saveButton.position(10, 10); // Position the button on the canvas
    saveButton.mousePressed(() => {
      p.saveCanvas('myCanvas', 'png'); // Save the canvas as a PNG file
    });
  }
  
  p.draw = () => {
    p.noLoop();
    // Camera Controls
    buffer3d.orbitControl(); // Allows mouse control of the camera
    
    // Translation
    buffer3d.translate(-60, -140, 0); // Try different values to bring the model into view
    buffer3d.rotateX(buffer3d.radians(180)); // Rotate 180 degrees around the y-axis
    buffer3d.rotateY(buffer3d.radians(195)); // Rotate 180 degrees around the y-axis
    buffer3d.rotateZ(0); // Rotate 180 degrees around the z-axis
    buffer3d.scale(6); 
    
    // Lighting
    // p.ambientLight(150);
    buffer3d.directionalLight(255, 255, 255, 0, 0, -1);

    // Model
    buffer3d.noStroke(); // Disable drawing the edges of the model
    // buffer3d.texture(alteredTexture); // Apply the texture to the model
    buffer3d.model(model); // Render the 3D model

    // Get pixel data from buffer3d
    buffer3d.loadPixels();
    p.loadPixels();
    // console.log("b pixels", buffer3d.pixels, buffer3d.pixels.length)
    // console.log("p pixels", p.pixels, buffer3d.pixels.length)
    const density = p.pixelDensity();
    const adjustedWidth = buffer3d.width * density;
    const adjustedHeight = buffer3d.height * density;
    
    const brightnessThreshold = 70; // Set your desired brightness threshold

    for (let x = 0; x < adjustedWidth; x++) {
      for (let y = 0; y < adjustedHeight; y++) {
        const index = (x + y * adjustedWidth) * 4;
        const r = buffer3d.pixels[index];
        const g = buffer3d.pixels[index + 1];
        const b = buffer3d.pixels[index + 2];
        const a = buffer3d.pixels[index + 3];

        // Calculate brightness using HSB mode
        const color = p.color(r, g, b);
        const brightness = p.brightness(color);

        if (brightness > brightnessThreshold) {
          buffer3d.pixels[index] = r;
          buffer3d.pixels[index + 1] = g;
          buffer3d.pixels[index + 2] = b;
          buffer3d.pixels[index + 3] = 255;
        } else {
          // buffer3d.pixels[index] = 0;
          // buffer3d.pixels[index + 1] = 0;
          // buffer3d.pixels[index + 2] = 0;
          buffer3d.pixels[index + 3] = 0;
        }
      }
    }
    
    buffer3d.updatePixels();
    p.image(buffer3d, 0, 0)
  }
  
  // p.mousePressed = () => {
  //   if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
  //     p.clear();
  //     p.setup();
  //     p.draw();
  //   }
  // };
  
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