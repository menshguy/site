import p5 from 'p5';

interface RoyalFrameProps {
  innerSketch: (p: p5) => void;
  innerWidth: number;
  innerHeight: number;
  frameTopWidth?: number;
  frameSideWidth?: number;
}

interface Subdivision {
  length: number, 
  depth: number, 
  direction: string, 
  hasTrim: boolean
}

type PatternFunction = (
  p: p5, 
  x: number,
  y: number,
  w: number,
  h: number,
  reverse: boolean,
  strokeColor: p5.Color
) => void;

export type { RoyalFrameProps, Subdivision, PatternFunction };