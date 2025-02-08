import React from 'react';
import P5Wrapper from '../../components/P5Wrapper.tsx';
import p5 from 'p5';

const mySketch = (p: p5) => {

  let xPosSlider: p5.Element, yPosSlider: p5.Element, zPosSlider: p5.Element;
  let xRotSlider: p5.Element, yRotSlider: p5.Element, zRotSlider: p5.Element;
  let xLightSlider: p5.Element, yLightSlider: p5.Element, zLightSlider: p5.Element;

  let xPos = 300
  let yPos = -100
  let zPos = 200
  
  let xRot = 0
  let yRot = 30
  let zRot = 180
  
  let scale = 8
  
  let xLight = 0
  let yLight = -300
  let zLight = 800
  
  let lightColorR = 200
  let lightColorG = 200
  let lightColorB = 200

  let cw: number = 600; 
  let ch: number = 600;

  let model: p5.Geometry;
  let textureImg: p5.Image;
  // let drawing: p5.Image;
  let y: number = -140;
  
  p.preload = () => {
    // textureImg = p.loadImage('/textures/coldpressed_1.PNG');
    textureImg = p.loadImage('/couch3d//winter_couch_textures/color.jpg');
    // drawing = p.loadImage('/couch3d/couch.png');

    // Empty Couch
    // p.loadModel(
    //   '/couch3d/11_20_2024.obj',
    //   true,
    //   handleModel,
    //   handleError
    // );

    // Dog couch
    p.loadModel(
      '/couch3d/winter_couch.obj',
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

    // Create sliders for position
    xPosSlider = p.createSlider(-500, 500, xPos) as p5.Element;
    yPosSlider = p.createSlider(-500, 500, yPos) as p5.Element;
    zPosSlider = p.createSlider(-500, 500, zPos) as p5.Element;

    // Create sliders for rotation
    xRotSlider = p.createSlider(0, 360, xRot) as p5.Element;
    yRotSlider = p.createSlider(0, 360, yRot) as p5.Element;
    zRotSlider = p.createSlider(0, 360, zRot) as p5.Element;

    // Create sliders for light position
    xLightSlider = p.createSlider(-1000, 1000, xLight) as p5.Element;
    yLightSlider = p.createSlider(-1000, 1000, yLight) as p5.Element;
    zLightSlider = p.createSlider(-1000, 1000, zLight) as p5.Element;
  }
  
  p.draw = () => {
    // p.noLoop();
    p.background("antiquewhite");

    p.orbitControl();

    // Update positions and rotations based on slider values
    xPos = Number(xPosSlider.value());
    yPos = Number(yPosSlider.value());
    zPos = Number(zPosSlider.value());

    xRot = Number(xRotSlider.value());
    yRot = Number(yRotSlider.value());
    zRot = Number(zRotSlider.value());

    xLight = Number(xLightSlider.value());
    yLight = Number(yLightSlider.value());
    zLight = Number(zLightSlider.value());

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
    p.translate(0, 0, 0);
    p.translate(xPos, yPos, zPos);
    p.rotateX(p.radians(xRot));
    p.rotateY(p.radians(yRot));
    p.rotateZ(p.radians(zRot));
    p.scale(scale);
    p.texture(textureImg);
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
    console.log("Model Position:", { xPos, yPos, zPos });
    console.log("Model Rotation:", { xRot, yRot, zRot });
    console.log("Light Position:", { xLight, yLight, zLight });
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
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
  return (
    <div style={{position: "absolute", top: 0}}>
      {/* <h1>3D</h1>
      <p>Click to redraw.</p> */}
      <div style={{position: "relative", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", margin: "0 auto"}}>
        
        {/* <div style={{position: "absolute", top: 0, left: 0}}>
          <P5Wrapper sketch={bgSketch} />
        </div> */}
        
        <div style={{position: "absolute", top: 40, left: 0}}>
          <P5Wrapper sketch={mySketch} />
        </div>
        
      </div>
    </div>
  );
};

export {mySketch};
export default Couch;