import p5 from 'p5';

export interface TreeConfig {
  numLines: number;
  startPoint: { x: number; y: number };
  treeHeight: number;
  treeWidth: number;
}

export interface RowhomeConfig {
  x: number;
  y: number;
  w: number;
  h: number;
  fill_c: p5.Color;
  stroke_c?: p5.Color;
}

export interface FloorSectionConfig {
  x: number;
  y: number;
  w: number;
  h: number;
  config?: {};
  content: string;
  fill_c: p5.Color;
  stroke_c?: p5.Color;
}