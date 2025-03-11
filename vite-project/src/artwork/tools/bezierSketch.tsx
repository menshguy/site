import p5 from 'p5'

interface Line {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  controlPoints: { x: number; y: number }[];
  isDragging?: { i: number } | false;
}

const mySketch = (_cw: number = 600, _ch: number = 600) => (p: p5) => {
  let cw: number = _cw; 
  let ch: number = _ch;
  let bottom = 100;
  let lines: Line[] = [];
  
  p.setup = () => {
    p.createCanvas(cw, ch);
    p.colorMode(p.HSL);
    let numLines = 3
    
    for (let i = 0; i < numLines; i++) {
      let lineLength = 400
      let startPoint = {x:cw/2, y:ch-bottom};
      let endPoint = {x:(cw/2) + p.random(-50, 50), y:ch-bottom-lineLength}
      lines.push({
        startPoint,
        endPoint,
        controlPoints: [
          {
            x: startPoint.x, 
            y: startPoint.y-p.random(50,ch-bottom)
          }, {
            x: p.random(cw/2-200, cw/2+200),
            y: endPoint.y+p.random(0, startPoint.y-p.random(50,ch-bottom))
          }
        ]
      })
    }
  }
  
  p.draw = () => {
    p.background("antiquewhite");
   
    //Draw the Lines
    lines.forEach(l => {
      let {startPoint, controlPoints, endPoint} = l
  
      //Style the line
      p.stroke(p.color(15, 28, 47))
      p.strokeWeight(2);
      p.noFill()
      p.beginShape();
      p.vertex(startPoint.x, startPoint.y)
      p.bezierVertex(
        controlPoints[0].x, controlPoints[0].y,
        controlPoints[1].x, controlPoints[1].y,
        endPoint.x, endPoint.y
      )
      p.endShape();
    
      //Draw Anchor Points
      p.stroke("black");
      p.strokeWeight(5);
      p.point(startPoint.x, startPoint.y)
      p.point(endPoint.x, endPoint.y)
      
      //Draw Control Points for Reference
      p.stroke("red");
      p.strokeWeight(5);
      controlPoints.forEach(cp => {
        p.point(cp.x, cp.y)
      })
    
      //Connect Control Points to Anchor Points
      p.stroke("red")
      p.strokeWeight(1);
      p.line(startPoint.x, startPoint.y, controlPoints[0].x, controlPoints[0].y)
      p.line(endPoint.x, endPoint.y, controlPoints[1].x, controlPoints[1].y)
    })
  }
  
  p.mousePressed = () => {
    // Check if mouse is inside canvas
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      lines.forEach(line => {
        let cp = line.controlPoints
        let x1 = cp[0].x
        let y1 = cp[0].y
        let x2 = cp[1].x
        let y2 = cp[1].y
        if (p.dist(p.mouseX, p.mouseY, x1, y1) < 10) {
          line.isDragging = {i: 0};
        }
        if (p.dist(p.mouseX, p.mouseY, x2, y2) < 10) {
          line.isDragging = {i: 1};
        }
      });
    }
  }
  
  p.mouseDragged = () => {
    // Check if mouse is inside canvas
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      lines.forEach(line => {
        let cp = line.controlPoints
        if (line.isDragging) {
          cp[line.isDragging.i].x = p.mouseX;
          cp[line.isDragging.i].y = p.mouseY;
        }
      });
    }
  }
  
  p.mouseReleased = () => {
    // Check if mouse is inside canvas
    if (p.mouseX >= 0 && p.mouseX <= cw && p.mouseY >= 0 && p.mouseY <= ch) {
      lines.forEach(line => {
        line.isDragging = false;
      });
    }
  }
};

export default mySketch;