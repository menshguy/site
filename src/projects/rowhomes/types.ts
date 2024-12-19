import p5 from 'p5';

export interface TreeConfig {
  numLines: number;
  startPoint: { x: number; y: number };
  treeHeight: number;
  treeWidth: number;
}

export interface RowhomeConstructor {
  x: number;
  y: number;
  w: number;
  h: number;
  fill_c: p5.Color;
  stroke_c?: p5.Color;
}

export interface FloorSectionConstructor {
  x: number;
  y: number;
  w: number;
  h: number;
  // config: { 
  //   min: number; 
  //   max: number; 
  //   proportion: number; 
  // };
  content: string; 
  stroke_c: p5.Color;
  fill_c: p5.Color;
}

export interface FloorSectionGenerator {
  x: number;
  y: number;
  w: number;
  h: number;
  fill_c: p5.Color;
  stroke_c: p5.Color;
  config: { 
    min: number; 
    max: number; 
    proportion: number; 
    content: string[];
  };
}

export interface FloorSectionConstructor2 {
  x: number;
  y: number;
  w: number;
  h: number;
  config: any;
  content: string[] | number[];
  fill_c: p5.Color | string;
}