import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import p5 from 'p5';

const mySketch = (p: p5) => {

  let cw: number = window.innerWidth; 
  let ch: number = window.innerHeight;
  let model: p5.Geometry;
  let textureImg: p5.Image;
  let alteredTexture: p5.Graphics;
  
  p.preload = () => {
    textureImg = p.loadImage('me3d/textures/color.jpg');
    
    p.loadModel(
      '/me3d/6_4_2023.obj',
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
    p.createCanvas(cw, ch, p.WEBGL);
    p.background("antiquewhite");
    
    // Create Altered Texture - apply modifications to this.
    alteredTexture = p.createGraphics(textureImg.width, textureImg.height);
    alteredTexture.image(textureImg,0,0)

    // Camera position
    p.camera(0, 0, (p.height / 2) / p.tan(p.PI / 6) + 200, 0, 0, 0, 0, 1, 0);
  }
  
  p.draw = () => {
    p.background("antiquewhite");

    // Camera Controls
    p.orbitControl(); // Allows mouse control of the camera
    
    // Translation
    p.translate(-60, 30, 0); // Try different values to bring the model into view
    p.rotateY(p.PI + p.radians(20)); // Rotate 180 degrees around the y-axis
    p.rotateZ(p.PI); // Rotate 180 degrees around the z-axis
    p.scale(5); 
    
    // Lighting
    p.ambientLight(150);
    p.directionalLight(255, 255, 255, 0, 0, -1);

    // Model
    p.noStroke(); // Disable drawing the edges of the model
    p.texture(alteredTexture); // Apply the texture to the model
    p.model(model); // Render the 3D model
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