// import React from 'react';
// import P5Wrapper from '../../components/P5Wrapper.tsx';
// import p5 from 'p5';

// const mySketch = (p: p5) => {

//   let cw: number = 600; 
//   let ch: number = 600;
//   let model: p5.Geometry;
//   let drawing: p5.Image;
//   // let textureImg: p5.Image;
//   let buffer: p5.Graphics;
//   let y: number = -140;
//   let prevY: number = 0;
  
//   p.preload = () => {
//     // textureImg = p.loadImage('/textures/coldpressed_1.PNG');
//     drawing = p.loadImage('/couch3d/couch.png');

//     p.loadModel(
//       '/couch3d/11_20_2024.obj',
//       true,
//       handleModel,
//       handleError
//     );

//     function handleModel(data: p5.Geometry) {
//       model = data;
//       console.log(model);
//     }
    
//     // Print an error message if the file doesn't load.
//     function handleError(error: unknown) {
//       console.error('Oops!', error);
//     }
//   }
  
//   p.setup = () => {
//     p.colorMode(p.HSL);
//     p.createCanvas(cw, ch);
//     buffer = p.createGraphics(cw, ch, p.WEBGL);

//     // Camera position
//     buffer.camera(0, 0, (buffer.height / 2) / buffer.tan(buffer.PI / 6), 0, 0, 0, 0, 1, 0);

//     // Limit frame rate to 30 FPS
//     buffer.frameRate(30); 

//     // Translation
//     buffer.translate(-60, -140, 0); // Try different values to bring the model into view
//     buffer.rotateX(buffer.radians(180)); // Rotate 180 degrees around the y-axis
//     buffer.rotateY(buffer.radians(195)); // Rotate 180 degrees around the y-axis
//     buffer.rotateZ(0); // Rotate 180 degrees around the z-axis
//     buffer.scale(6); 
//   }
  
//   p.draw = () => {
//     // p.noLoop();
//     // p.background("antiquewhite");
//     p.fill("azure");
//     p.rect(0, 0, cw, 180);
//     p.fill(33, 97, 90);
//     p.rect(0, 180, cw, ch-180);

//     /** REMEMBER IT 
//      * HAS SOMETHING TO DO WITH THE TRANSLATION!!!!! FUCKCKCKCKCKCKC
//      * HAS SOMETHING TO DO WITH THE TRANSLATION!!!!! FUCKCKCKCKCKCKC
//      * HAS SOMETHING TO DO WITH THE TRANSLATION!!!!! FUCKCKCKCKCKCKC
//      * HAS SOMETHING TO DO WITH THE TRANSLATION!!!!! FUCKCKCKCKCKCKC
//      * HAS SOMETHING TO DO WITH THE TRANSLATION!!!!! FUCKCKCKCKCKCKC
//      */
//     // Translation
//     // buffer.translate(-60, -140, 0); // Try different values to bring the model into view
//     // buffer.rotateX(buffer.radians(180)); // Rotate 180 degrees around the y-axis
//     // buffer.rotateY(buffer.radians(195)); // Rotate 180 degrees around the y-axis
//     // buffer.rotateZ(0); // Rotate 180 degrees around the z-axis
//     // buffer.scale(6); 

//     // Lighting
//     // buffer.ambientLight(150);
//     buffer.push();  
//     // buffer.translate(-60, y, 0);
//     buffer.translate(-60, -140, 0); // Try different values to bring the model into view
//     buffer.rotateX(buffer.radians(180)); // Rotate 180 degrees around the y-axis
//     buffer.rotateY(buffer.radians(195)); // Rotate 180 degrees around the y-axis
//     buffer.rotateZ(0); // Rotate 180 degrees around the z-axis
//     buffer.scale(6); 
//     buffer.pointLight(200, 200, 200, 0, -100, 0);
//     buffer.noStroke(); // Disable drawing the edges of the model
//     buffer.model(model); // Render the 3D model
//     buffer.pop();

//     // Camera Controls
//     // buffer.orbitControl(); // Allows mouse control of the camera

//     // Get pixel data from b3d
//     if (prevY !== y) {
//       console.log("inner y", y)

//       // Model
//       // buffer.noStroke(); // Disable drawing the edges of the model
//       // buffer.model(model); // Render the 3D model

//       // Load Pixels
//       buffer.loadPixels();

//       // Loop Through pixels and only draw pixels below brightnessThreshold
//       const density = buffer.pixelDensity();
//       const adjustedWidth = buffer.width * density;
//       const adjustedHeight = buffer.height * density;
//       for (let x = 0; x < adjustedWidth; x++) {
//         for (let y = 0; y < adjustedHeight; y++) {
//           const index = (x + y * adjustedWidth) * 4;
//           const r = buffer.pixels[index];
//           const g = buffer.pixels[index + 1];
//           const b = buffer.pixels[index + 2];
//           const a = buffer.pixels[index + 3];
  
//           // Calculate brightness using HSB mode
//           const color = buffer.color(r, g, b, a);
//           const brightness = buffer.brightness(color);
//           const brightnessThreshold = 40; // Set your desired brightness threshold
//           if (brightness < brightnessThreshold) {
//             buffer.pixels[index] = r;
//             buffer.pixels[index + 1] = g;
//             buffer.pixels[index + 2] = b;
//             buffer.pixels[index + 3] = 255;
//           } else {
//             buffer.pixels[index] = r;
//             buffer.pixels[index + 1] = g;
//             buffer.pixels[index + 2] = b;
//             buffer.pixels[index + 3] = 0;
//           }
//         }
//       }
      
//       prevY = y;
//       buffer.updatePixels();
//     }

//     // buffer.filter(p.BLUR, 2); // Soften edges with blur
//     p.image(buffer, 0, 0, cw, ch)
//     p.image(drawing, 0, 0, cw, ch)

//     /**
//      *  Draw Texture - ***APPLYING THIS WILL REMOVE ALPHA CHANNELS****
//      * To Bring back, try using a MAP to cut out the alpha channel.
//      */
//     // p.blendMode(p.MULTIPLY);
//     // p.image(textureImg, 0, 0, cw, ch);
//     // p.blendMode(p.BLEND);
//   }
  
//   p.mousePressed = () => {
//     if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
//       console.log("click runs", y)
//       y += 1;
//       p.redraw();
//       buffer.redraw();
//     }
//   };
// };

// // const bgSketch = (p: p5) => {
// //   p.draw = () => {
// //     p.createCanvas(600, 180);
// //     p.background("azure");
// //     p.translate(p.width / 2, p.height);
// //     drawBranch(100);
    
// //   }

// //   function drawBranch(len: number) {
// //     p.line(0, 0, 0, -len);
// //     p.translate(0, -len);
// //     if (len > 4) {
// //       p.push();
// //       p.rotate(p.PI / 6);
// //       drawBranch(len * 0.67);
// //       p.pop();
// //       p.push();
// //       p.rotate(-p.PI / 6);
// //       drawBranch(len * 0.67);
// //       p.pop();
// //     }
// //   }
// // }

// const Couch_old: React.FC = () => {
//   return (
//     <div>
//       <h1>3D</h1>
//       <p>Click to redraw.</p>
//       <div style={{position: "relative", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", margin: "0 auto"}}>
//         {/* <div style={{position: "absolute", top: 0, left: 0}}>
//           <P5Wrapper sketch={bgSketch} />
//         </div> */}
//         <div style={{position: "absolute", top: 0, left: 0}}>
//           <P5Wrapper sketch={mySketch} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export {mySketch};
// export default Couch_old;