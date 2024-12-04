import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import p5 from 'p5';

const mySketch = (
  _setters: React.Dispatch<React.SetStateAction<number>>[], 
  getters: () => number[]
) => (p: p5) => {

  let [
    xPos, yPos, zPos, 
    xRot, yRot, zRot, 
    scale, 
    xLight, yLight, zLight, 
    lightColorR, lightColorG, lightColorB
  ] = getters();

  let cw: number = 600; 
  let ch: number = 600;
  let model: p5.Geometry;
  // let textureImg: p5.Image;
  // let drawing: p5.Image;
  let y: number = -140;
  
  p.preload = () => {
    // textureImg = p.loadImage('../textures/coldpressed_1.PNG');
    // drawing = p.loadImage('/couch3d/couch.png');

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
  }
  
  p.draw = () => {
    // p.noLoop();
    p.background("antiquewhite");

    /**
     * When you wrap lighting functions like ambientLight and directionalLight with push() 
     * and pop(), the lighting settings are applied only within that specific block. 
     * Once pop() is called, the lighting settings are reverted to what they were before the push(). 
     */
    p.pointLight(lightColorR, lightColorG, lightColorB, xLight, yLight, zLight); // y:-200, z: 500
    // p.ambientLight(30);
    // p.directionalLight(lightColorR, lightColorG, lightColorB, xLight, yLight, zLight);

    p.push();
    p.noStroke();
    p.translate(xPos, yPos, zPos);
    p.rotateX(p.radians(xRot));
    p.rotateY(p.radians(yRot));
    p.rotateZ(p.radians(zRot));
    p.scale(scale);
    p.model(model); // Render the 3D model
    p.translate(0, -40, 0);
    p.sphere(12); // Render the 3D model
    p.pop();

    // // Define the size of the plane and holes
    // const planeSize = 400;
    // const holeSize = 120;
    // const gap = 80; // Gap between holes
    // p.push();
    // p.translate(-100, 0, 200); //(left/right, up/down, forward/back toward cam)
    // p.rotateY(p.radians(-30));
    // // Draw the plane with holes
    // p.beginShape();
    // // Outer rectangle (plane)
    // p.vertex(-planeSize / 2, -planeSize / 2);
    // p.vertex(planeSize / 2, -planeSize / 2);
    // p.vertex(planeSize / 2, planeSize / 2);
    // p.vertex(-planeSize / 2, planeSize / 2);
    // // Hole 1
    // p.beginContour();
    // p.vertex(-holeSize / 2 - gap, -holeSize / 2 - gap);
    // p.vertex(-holeSize / 2 - gap, holeSize / 2 - gap);
    // p.vertex(holeSize / 2 - gap, holeSize / 2 - gap);
    // p.vertex(holeSize / 2 - gap, -holeSize / 2 - gap);
    // p.endContour();
    // // Hole 2
    // p.beginContour();
    // p.vertex(-holeSize / 2 + gap, -holeSize / 2 - gap);
    // p.vertex(-holeSize / 2 + gap, holeSize / 2 - gap);
    // p.vertex(holeSize / 2 + gap, holeSize / 2 - gap);
    // p.vertex(holeSize / 2 + gap, -holeSize / 2 - gap);
    // p.endContour();
    // // Hole 3
    // p.beginContour();
    // p.vertex(-holeSize / 2 - gap, -holeSize / 2 + gap);
    // p.vertex(-holeSize / 2 - gap, holeSize / 2 + gap);
    // p.vertex(holeSize / 2 - gap, holeSize / 2 + gap);
    // p.vertex(holeSize / 2 - gap, -holeSize / 2 + gap);
    // p.endContour();
    // // Hole 4
    // p.beginContour();
    // p.vertex(-holeSize / 2 + gap, -holeSize / 2 + gap);
    // p.vertex(-holeSize / 2 + gap, holeSize / 2 + gap);
    // p.vertex(holeSize / 2 + gap, holeSize / 2 + gap);
    // p.vertex(holeSize / 2 + gap, -holeSize / 2 + gap);
    // p.endContour();
    // p.endShape(p.CLOSE);
    // p.pop();

    // if (prevY !== y) {
    if (true) {
      console.log("inner y", y)

      // Load Pixels
      p.loadPixels();

      // Loop Through pixels and only draw pixels below brightnessThreshold
      const density = p.pixelDensity();
      const adjustedWidth = p.width * density;
      const adjustedHeight = p.height * density;
      for (let x = 0; x < adjustedWidth; x++) {
        for (let y = 0; y < adjustedHeight; y++) {
          const index = (x + y * adjustedWidth) * 4;
          const r = p.pixels[index];
          const g = p.pixels[index + 1];
          const b = p.pixels[index + 2];
          // const a = p.pixels[index + 3];
  
          // Calculate brightness using HSB mode
            p.pixels[index] = r;
            p.pixels[index + 1] = g;
            p.pixels[index + 2] = b;
            p.pixels[index + 3] = 255;
        }
      }
      
      p.updatePixels();
    }

  }

  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      console.log("click runs", y)
      y += 1;
    }
  };
};

// const bgSketch = (p: p5) => {
//   p.draw = () => {
//     p.createCanvas(600, 180);
//     p.background("azure");
//     p.translate(p.width / 2, p.height);
//     drawBranch(100);
    
//   }

//   function drawBranch(len: number) {
//     p.line(0, 0, 0, -len);
//     p.translate(0, -len);
//     if (len > 4) {
//       p.push();
//       p.rotate(p.PI / 6);
//       drawBranch(len * 0.67);
//       p.pop();
//       p.push();
//       p.rotate(-p.PI / 6);
//       drawBranch(len * 0.67);
//       p.pop();
//     }
//   }
// }

const Couch: React.FC = () => {

  const [xPos, setXPos] = React.useState(0);
  const [yPos, setYPos] = React.useState(-150); //-250
  const [zPos, setZPos] = React.useState(0);
  
  const [xRot, setXRot] = React.useState(0);
  const [yRot, setYRot] = React.useState(0);
  const [zRot, setZRot] = React.useState(180); //180
  
  const [scale, setScale] = React.useState(8);
  
  const [xLight, setXLight] = React.useState(-400);
  const [yLight, setYLight] = React.useState(-50);
  const [zLight, setZLight] = React.useState(100);
  
  const [lightColorR, setLightColorR] = React.useState(200);
  const [lightColorG, setLightColorG] = React.useState(200);
  const [lightColorB, setLightColorB] = React.useState(200);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(Number(event.target.value));
  };

  let sketchWrapper = mySketch([setXPos, setYPos, setZPos, setXRot, setYRot, setZRot, setScale, setXLight, setYLight, setZLight, setLightColorR, setLightColorG, setLightColorB], () => [xPos, yPos, zPos, xRot, yRot, zRot, scale, xLight, yLight, zLight, lightColorR, lightColorG, lightColorB]);

  return (
    <div style={{position: "absolute", top: 0}}>
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

      <div style={{position: "relative", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", margin: "0 auto"}}>
        
        {/* <div style={{position: "absolute", top: 0, left: 0}}>
          <P5Wrapper sketch={bgSketch} />
        </div> */}
        
        <div style={{position: "absolute", top: 40, left: 0}}>
          <P5Wrapper sketch={sketchWrapper} />
        </div>
        
      </div>
    </div>
  );
};

export {mySketch};
export default Couch;