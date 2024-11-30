import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import p5 from 'p5';

const mySketch = (
  setters: React.Dispatch<React.SetStateAction<number>>[], 
  getters: () => number[]
) => (p: p5) => {

  let cw: number = window.innerWidth; 
  let ch: number = window.innerHeight;
  let model: p5.Geometry;
  let textureImg: p5.Image;
  let alteredTexture: p5.Graphics;
  
  p.preload = () => {
    textureImg = p.loadImage('me3d/textures/color.jpg');

    let [
      xPos, yPos, zPos, 
      xRot, yRot, zRot, 
      scale, 
      xLight, yLight, zLight, 
      lightColorR, lightColorG, lightColorB
    ] = getters();
    
    p.loadModel(
      '/me3d/6_4_2023.obj',
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
  const [xPos, setXPos] = React.useState(0);
  const [yPos, setYPos] = React.useState(0);
  const [zPos, setZPos] = React.useState(0);
  
  const [xRot, setXRot] = React.useState(0);
  const [yRot, setYRot] = React.useState(0);
  const [zRot, setZRot] = React.useState(0);
  
  const [scale, setScale] = React.useState(1);
  
  const [xLight, setXLight] = React.useState(0);
  const [yLight, setYLight] = React.useState(0);
  const [zLight, setZLight] = React.useState(0);
  
  const [lightColorR, setLightColorR] = React.useState(200);
  const [lightColorG, setLightColorG] = React.useState(200);
  const [lightColorB, setLightColorB] = React.useState(200);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(Number(event.target.value));
  };

  let sketchWrapper = mySketch([setXPos, setYPos, setZPos, setXRot, setYRot, setZRot, setScale, setXLight, setYLight, setZLight, setLightColorR, setLightColorG, setLightColorB], () => [xPos, yPos, zPos, xRot, yRot, zRot, scale, xLight, yLight, zLight, lightColorR, lightColorG, lightColorB]);

  return (
    <div>
      {/* <h1>3D</h1>
      <p>Click to redraw.</p> */}
      <label>
        Model X Position:
        <input type="number" value={xPos} onChange={handleInputChange(setXPos)} />
      </label>
      <label>
        Model Y Position:
        <input type="number" value={yPos} onChange={handleInputChange(setYPos)} />
      </label>
      <label>
        Model Z Position:
        <input type="number" value={zPos} onChange={handleInputChange(setZPos)} />
      </label>

      <label>
        Model X Rotation:
        <input type="number" value={xRot} onChange={handleInputChange(setXRot)} />
      </label>
      <label>
        Model Y Rotation:
        <input type="number" value={yRot} onChange={handleInputChange(setYRot)} />
      </label>
      <label>
        Model Z Rotation:
        <input type="number" value={zRot} onChange={handleInputChange(setZRot)} />
      </label>

      <label>
        Model Scale:
        <input type="number" value={scale} onChange={handleInputChange(setScale)} />
      </label>

      <label>
        Light X Position:
        <input type="number" value={xLight} onChange={handleInputChange(setXLight)} />
      </label>
      <label>
        Light Y Position:
        <input type="number" value={yLight} onChange={handleInputChange(setYLight)} />
      </label>
      <label>
        Light Z Position:
        <input type="number" value={zLight} onChange={handleInputChange(setZLight)} />
      </label>
      
      <label>
        Light R Value:
        <input type="number" value={lightColorR} onChange={handleInputChange(setLightColorR)} />
      </label>
      <label>
        Light G Value:
        <input type="number" value={lightColorG} onChange={handleInputChange(setLightColorG)} />
      </label>
      <label>
        Light B Value:
        <input type="number" value={lightColorB} onChange={handleInputChange(setLightColorB)} />
      </label>

      <P5Wrapper sketch={sketchWrapper} />
    </div>
  );
};

export default ThreeDTest;