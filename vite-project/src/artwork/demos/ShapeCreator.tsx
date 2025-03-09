import p5 from 'p5';

type ShapePoint = {
  x: number;
  y: number;
  type: 'vertex' | 'control' | 'bezierVertex';
}
const mySketch = (p: p5) => {
    // State variables
    let currentShape:ShapePoint[] = []; // Stores vertices and bezier control points
    let isDragging = false;
    let draggedPointIndex = -1;
    let isCreatingBezier = false;
    let bezierControlPoints:ShapePoint[] = [];
    let shapes:ShapePoint[][] = []; // Store multiple shapes
    let activeShapeIndex = -1;
    let showInstructions = true; // Track whether to show instructions
    
    p.setup = () => {
      const canvas = p.createCanvas(800, 600);  
      canvas.mousePressed(handleMousePressed);
      canvas.mouseReleased(handleMouseReleased);
      canvas.doubleClicked(handleDoubleClick);
      
      // Create export button
      const exportButton = p.createButton('Console.log Shape Code');
      exportButton.position(0, 0, "relative");
      exportButton.mousePressed(exportShapeCode);
      
      // Create toggle instructions button
      const toggleButton = p.createButton('Toggle Instructions');
      toggleButton.position(10, 0, "relative");
      toggleButton.mousePressed(() => {
        showInstructions = !showInstructions;
      });
      
      p.background(240);
    };
    
    p.draw = () => {
      p.colorMode(p.HSL);
      p.background("antiquewhite");

      // Draw all completed shapes
      for (let i = 0; i < shapes.length; i++) {
        drawShape(shapes[i]);
      }
      
      // Draw current shape being created
      if (currentShape.length > 0) {
        drawCurrentShape();
      }
      
      // Handle dragging control points
      if (isDragging && draggedPointIndex !== -1) {
        if (activeShapeIndex === -1) {
          // Dragging a point in the current shape
          currentShape[draggedPointIndex].x = p.mouseX;
          currentShape[draggedPointIndex].y = p.mouseY;
        } else {
          // Dragging a point in a completed shape
          shapes[activeShapeIndex][draggedPointIndex].x = p.mouseX;
          shapes[activeShapeIndex][draggedPointIndex].y = p.mouseY;
        }
      }
      
      // Draw instructions text to the right of the canvas if enabled
      if (showInstructions) {
        drawInstructions();
      }
    };
    
    const drawInstructions = () => {
      p.push();
      p.fill(208, 100, 95);
      p.noStroke();
      p.rect(590, 50, 200, 130);
      
      p.fill(0);
      p.textSize(16);
      p.textAlign(p.LEFT);
      p.text("To Use this shape:", 600, 70);
      
      p.textSize(12);
      p.text("- Click: add vertex", 600, 100);
      p.text("- Shift+Click: add bezierVertex ", 600, 115);
      p.text("- Double-Click: close the shape", 600, 130);
      p.text("- X: undo last vertex", 600, 145);
      p.text("- C: clears all shapes", 600, 160);
      p.text("- C: clears all shapes", 600, 160);
    
      p.pop();
    };
    
    const handleMousePressed = () => {
      // Check if clicking on an existing control point to drag
      const pointInfo = findNearestControlPoint();
      
      if (pointInfo.found) {
        isDragging = true;
        draggedPointIndex = pointInfo.index;
        activeShapeIndex = pointInfo.shapeIndex;
        return;
      }
      
      // If not dragging and holding shift, create a bezier curve
      if (p.keyIsDown(p.SHIFT)) {
        isCreatingBezier = true;
        bezierControlPoints = [
          { x: p.mouseX, y: p.mouseY, type: 'control' },
          { x: p.mouseX, y: p.mouseY, type: 'control' }
        ];
        return;
      }
      
      // Otherwise add a new vertex
      if (currentShape.length === 0) {
        // Start a new shape
        currentShape.push({ x: p.mouseX, y: p.mouseY, type: 'vertex' });
      } else {
        // Add a new vertex to the current shape
        if (isCreatingBezier) {
          // Add the bezier vertex and its control points
          currentShape.push(
            {...bezierControlPoints[0], x: bezierControlPoints[0].x, y: bezierControlPoints[0].y},
            {...bezierControlPoints[1], x: bezierControlPoints[1].x, y: bezierControlPoints[1].y},
            { x: p.mouseX, y: p.mouseY, type: 'bezierVertex' }
          );
          isCreatingBezier = false;
          bezierControlPoints = [];
        } else {
          currentShape.push({ x: p.mouseX, y: p.mouseY, type: 'vertex' });
        }
      }
    };
    
    const handleMouseReleased = () => {
      isDragging = false;
      draggedPointIndex = -1;
    };
    
    const handleDoubleClick = () => {
      // Close the current shape
      if (currentShape.length > 2) {
        shapes.push([...currentShape]);
        currentShape = [];
        activeShapeIndex = -1;
      }
    };
    
    const findNearestControlPoint = () => {
      const threshold = 15; // Distance threshold for selecting a point
      let minDist = threshold;
      let nearestIndex = -1;
      let nearestShapeIndex = -1;
      
      // Check current shape points
      for (let i = 0; i < currentShape.length; i++) {
        const d = p.dist(p.mouseX, p.mouseY, currentShape[i].x, currentShape[i].y);
        if (d < minDist) {
          minDist = d;
          nearestIndex = i;
          nearestShapeIndex = -1;
        }
      }
      
      // Check completed shapes points
      for (let s = 0; s < shapes.length; s++) {
        for (let i = 0; i < shapes[s].length; i++) {
          const d = p.dist(p.mouseX, p.mouseY, shapes[s][i].x, shapes[s][i].y);
          if (d < minDist) {
            minDist = d;
            nearestIndex = i;
            nearestShapeIndex = s;
          }
        }
      }
      
      return {
        found: nearestIndex !== -1,
        index: nearestIndex,
        shapeIndex: nearestShapeIndex
      };
    };
    
    const drawCurrentShape = () => {
      p.push();
      p.noFill();
      p.stroke(0);
      p.strokeWeight(2);
      
      p.beginShape();
      
      for (let i = 0; i < currentShape.length; i++) {
        const point = currentShape[i];
        
        if (point.type === 'vertex') {
          p.vertex(point.x, point.y);
        } else if (point.type === 'bezierVertex' && i >= 2) {
          const control1 = currentShape[i-2];
          const control2 = currentShape[i-1];
          p.bezierVertex(control1.x, control1.y, control2.x, control2.y, point.x, point.y);
        }
      }
      
      // If creating a bezier, show the preview
      if (isCreatingBezier && currentShape.length > 0) {
        // const lastPoint = currentShape[currentShape.length - 1];
        p.bezierVertex(
          bezierControlPoints[0].x, bezierControlPoints[0].y,
          bezierControlPoints[1].x, bezierControlPoints[1].y,
          p.mouseX, p.mouseY
        );
      }
      
      p.endShape();
      
      // Draw control points
      drawControlPoints(currentShape);
      
      // Draw bezier control points being created
      if (isCreatingBezier) {
        p.push();
        p.stroke(255, 0, 0);
        p.strokeWeight(1);
        
        const lastPoint = currentShape[currentShape.length - 1];
        
        // Draw lines connecting control points
        p.line(lastPoint.x, lastPoint.y, bezierControlPoints[0].x, bezierControlPoints[0].y);
        p.line(bezierControlPoints[0].x, bezierControlPoints[0].y, bezierControlPoints[1].x, bezierControlPoints[1].y);
        p.line(bezierControlPoints[1].x, bezierControlPoints[1].y, p.mouseX, p.mouseY);
        
        // Draw control points
        p.fill(255, 0, 0);
        p.ellipse(bezierControlPoints[0].x, bezierControlPoints[0].y, 8, 8);
        p.ellipse(bezierControlPoints[1].x, bezierControlPoints[1].y, 8, 8);
        p.pop();
      }
      
      p.pop();
    };
    
    const drawShape = (shape: ShapePoint[]) => {
      p.push();
      p.noFill();
      p.stroke(0);
      p.strokeWeight(2);
      
      p.beginShape();
      
      for (let i = 0; i < shape.length; i++) {
        const point = shape[i];
        
        if (point.type === 'vertex') {
          p.vertex(point.x, point.y);
        } else if (point.type === 'bezierVertex' && i >= 2) {
          const control1 = shape[i-2];
          const control2 = shape[i-1];
          p.bezierVertex(control1.x, control1.y, control2.x, control2.y, point.x, point.y);
        }
      }
      
      p.endShape(p.CLOSE);
      
      // Draw control points
      drawControlPoints(shape);
      
      p.pop();
    };
    
    const drawControlPoints = (points: ShapePoint[]) => {
      p.push();
      
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        
        if (point.type === 'vertex' || point.type === 'bezierVertex') {
          // Draw vertex points
          p.fill(0, 0, 255);
          p.noStroke();
          p.ellipse(point.x, point.y, 8, 8);
        } else if (point.type === 'control') {
          // Draw control points
          p.fill(255, 0, 0);
          p.noStroke();
          p.ellipse(point.x, point.y, 8, 8);
          
          // Draw lines to control points
          if (i > 0 && i < points.length - 1) {
            let connectedVertexIndex: number = -1; // Initialize with a default value
            
            // Find the vertex this control point is connected to
            if (i % 3 === 1) {
              // First control point of a bezier, connect to previous vertex
              connectedVertexIndex = i - 1;
            } else if (i % 3 === 2) {
              // Second control point of a bezier, connect to next vertex
              connectedVertexIndex = i + 1;
            }
            
            if (connectedVertexIndex >= 0 && connectedVertexIndex < points.length) {
              p.stroke(255, 0, 0, 150);
              p.strokeWeight(1);
              p.line(point.x, point.y, points[connectedVertexIndex].x, points[connectedVertexIndex].y);
            }
          }
        }
      }
      
      p.pop();
    };
    
    const exportShapeCode = () => {
      let code = '';
      
      // Export the last completed shape or current shape
      const shapeToExport = shapes.length > 0 ? shapes[shapes.length - 1] : currentShape;
      
      if (shapeToExport.length > 0) {
        // Find the first vertex to use as the translation point
        let firstVertex = null;
        for (let i = 0; i < shapeToExport.length; i++) {
          if (shapeToExport[i].type === 'vertex') {
            firstVertex = shapeToExport[i];
            break;
          }
        }
        
        if (firstVertex) {
          // Add translation to the first vertex
          code += `p.push();\n`;
          code += `p.translate(${Math.round(firstVertex.x)}, ${Math.round(firstVertex.y)});\n`;
          code += 'p.beginShape();\n';
          
          // Add first vertex at origin (0,0) since we've translated to it
          code += `p.vertex(0, 0);\n`;
          
          let vertexCount = 0;
          
          // Process the rest of the points, adjusting coordinates relative to the first vertex
          for (let i = 0; i < shapeToExport.length; i++) {
            const point = shapeToExport[i];
            
            // Skip the first vertex since we've already added it at (0,0)
            if (point.type === 'vertex' && point === firstVertex) {
              continue;
            }
            
            if (point.type === 'vertex') {
              vertexCount++;
              // Adjust coordinates relative to the first vertex
              const relX = Math.round(point.x - firstVertex.x);
              const relY = Math.round(point.y - firstVertex.y);
              code += `p.vertex(${relX}, ${relY});\n`;
            } else if (point.type === 'bezierVertex' && i >= 2) {
              const control1 = shapeToExport[i-2];
              const control2 = shapeToExport[i-1];
              
              // Adjust all coordinates relative to the first vertex
              const relC1X = Math.round(control1.x - firstVertex.x);
              const relC1Y = Math.round(control1.y - firstVertex.y);
              const relC2X = Math.round(control2.x - firstVertex.x);
              const relC2Y = Math.round(control2.y - firstVertex.y);
              const relX = Math.round(point.x - firstVertex.x);
              const relY = Math.round(point.y - firstVertex.y);
              
              code += `p.bezierVertex(${relC1X}, ${relC1Y}, ${relC2X}, ${relC2Y}, ${relX}, ${relY});\n`;
            }
          }
          
          code += 'p.endShape(p.CLOSE);\n';
          code += 'p.pop();';
          
          console.log(code);
          
          // Also display a message about how to use the code
          console.log('\nTo use this shape elsewhere:');
          console.log('1. Copy the code above');
          console.log(`2. To position the shape, change the translate values (${Math.round(firstVertex.x)}, ${Math.round(firstVertex.y)})`);
          console.log('3. Set fill/stroke before the push() call');
        } else {
          console.log('Could not find a vertex to use as reference point');
        }
      } else {
        console.log('No shape to export');
      }
    };
    
    // Handle key presses
    p.keyPressed = () => {
      // Clear everything with 'c' key
      if (p.key === 'c') {
        currentShape = [];
        shapes = [];
        activeShapeIndex = -1;
      }
      // Remove last Point
      if (p.key === 'x') {
        currentShape.pop()
        activeShapeIndex = -1;
      }
      // Toggle instructions with 'C' key (uppercase C)
      if (p.key === 'C') {
        showInstructions = !showInstructions;
      }
    };
};

export {mySketch}