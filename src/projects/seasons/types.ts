import p5 from 'p5';

export type Season = 'winter' | 'fall' | 'spring' | 'summer';

export type Leaf = { 
  x: number, 
  y: number, 
  w: number, 
  h: number, 
  angle: number, 
  start: number, 
  stop: number, 
  fill_c: p5.Color,
  isSunLeaf?: boolean, 
  movementFactor?: number
}

export type Point = {
  x: number;
  y: number;
  boundary?: {
    start: number;
    stop: number;
    radius: number;
    angle: number;
  };
};

export type BoundaryPoint = {
  start: number;
  stop: number;
  radius: number;
  angle: number;
};

export type Trunk = { 
  startPoint: { x: number, y: number }, 
  controlPoints: { x: number, y: number }[], 
  endPoint: { x: number, y: number } 
}[]


export type Line = {
  startPoint: Point, 
  controlPoints: Point[],
  initialControlPoints?: Point[],
  endPoint: Point
}