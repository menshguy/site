// p5-extensions.d.ts
import * as p5 from 'p5';

declare module 'p5' {
  interface p5InstanceExtensions {
    clip: (mask: () => void) => void;
  }
}