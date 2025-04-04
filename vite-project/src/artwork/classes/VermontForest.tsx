import p5 from 'p5';
import {TreeColorPalette, VermontTreePerformant} from './VermontTreePerformant';

export type VermontForestShapes = 'convex' | 'concave' | 'flat' | 'upHill' | 'downHill';

export type VermontForestSettings = {
  forestStartX: number;
  forestStartY: number;
  forestHeight: number;
  forestWidth: number;
  forestShape: VermontForestShapes;
  forestPalette: TreeColorPalette[];
  forestNumberOfColumns: number; // This will divide the given width into this many columns. Higher Numbers will produce more trees,
  forestTreeSettings: {
      trunkSpace: number, // Space to expose bottom of trunks, between bottom of tree and where leaves start
      minHeight: number, 
      maxHeight: number, 
      minWidth: number, 
      maxWidth: number, 
  },
  forestTrunkSettings: {
      numTrunkLines: number, 
      trunkHeight: number,
      trunkWidth: number, 
  },
  forestLeafSettings: {
      rows: number
      numPointsPerRow: number; 
      numLeavesPerPoint: number; 
      minBoundaryRadius: number;
      maxBoundaryRadius: number;
      leafWidth: number; 
      leafHeight: number;
      rowHeight: number; // Height between rows of leaves
  },
  forestLightSettings?: {
    lightAngle: number, // Radians (i.e p.radians(200))
    lightFillPercentage: number, // portion of leaves that will highlight color, facing sun
  },
  forestWindSettings?: {
    windSpeed?: number;           // How fast the wind phase changes (oscillation speed)
    windIntensitySpeed?: number;  // How fast the wind intensity changes
    maxWindIntensity?: number;    // Maximum pixels trees can sway
    windPhase?: number;           // Starting phase of wind oscillation
    windIntensityPhase?: number;  // Starting phase of wind intensity oscillation
  }
}

export class VermontForest {
  private p: p5;
  settings: VermontForestSettings;
  trees: VermontTreePerformant[];
  image: p5.Graphics;
  
  constructor({p5Instance, settings}: {p5Instance: p5; settings: VermontForestSettings}) {
    this.p = p5Instance;
    this.settings = settings;
    this.trees = this.#generateForestTrees();
    this.image = this.#generateInitialImage(this.p.width, this.p.height);
  }

  getImage(){
    return this.image;
  }

  getTrees() {
    return this.trees;
  }

  animate() {
    this.#generateNextImage(this.image, true);
  }

  #generateInitialImage(width: number, height: number) {
    const buffer = this.p.createGraphics(width, height);
    this.#drawForestToBuffer(buffer, false);
    return buffer;
  }
  
  #generateNextImage(buffer: p5.Graphics, isAnimated: boolean) {
    buffer.clear();
    this.#drawForestToBuffer(buffer, isAnimated);
  }

  #drawForestToBuffer(buffer: p5.Graphics, isAnimated: boolean){
    this.trees.forEach((tree: VermontTreePerformant) => {
      if (isAnimated) tree.animate(); // This will update the tree.image to the next frame
      const treeImage = tree.getImage();
      buffer.image(treeImage, 0, 0);
    })
    return buffer;
  }

  #generateForestTrees() {
    const {p, settings} = this;
    const {forestNumberOfColumns, forestStartX, forestStartY, forestWidth, forestShape, forestPalette, forestTreeSettings, forestLeafSettings, forestTrunkSettings, forestLightSettings, forestWindSettings} = settings;
    const {trunkSpace, minHeight, maxHeight, minWidth, maxWidth} = forestTreeSettings;
    const {numTrunkLines, trunkHeight, trunkWidth: _trunkWidth} = forestTrunkSettings;
    const {leafWidth, leafHeight, minBoundaryRadius, maxBoundaryRadius, numLeavesPerPoint, numPointsPerRow, rowHeight} = forestLeafSettings;
    const {lightAngle, lightFillPercentage} = forestLightSettings || {lightAngle: 0, lightFillPercentage: 0};
    const {windSpeed, windIntensitySpeed, maxWindIntensity, windPhase, windIntensityPhase} = forestWindSettings || {};

    // Calculate column width based on forestWidth and number of columns
    const columnWidth = forestWidth / forestNumberOfColumns;

    let forestTrees = []
    for (let i = 0; i < forestNumberOfColumns; i++) {
      
      const {incrementY, numTreesInColumn} = this.#getForestShape(forestShape, i)
      for (let j = Math.floor(numTreesInColumn); j >= 0; j--) {
        // Tree Settings
        const isFirstTreeInColumn = j === 0;
        const includeTrunk = isFirstTreeInColumn;
        const treeHeight = p.random(minHeight, maxHeight); // total height including leaves
        const trunkWidth = _trunkWidth;
        const treeWidth = p.random(minWidth, maxWidth); 
        // Use rowHeight from settings for consistent row spacing
        const calculatedRowHeight = rowHeight || treeHeight/3; 
        // Position trees within the forestWidth
        const startX = forestStartX + (i * columnWidth) + p.random(-15, 15); // Distribute trees evenly across forestWidth
        const startY = forestStartY - (incrementY * j)
        const startPoint = {x: startX, y: startY};
        const midpoint = {x: startPoint.x, y: startPoint.y - (treeHeight/2)};
        const bulgePoint = { x: midpoint.x, y: startPoint.y - (treeHeight/3)};
        const pointBoundaryRadius = {min: minBoundaryRadius, max: maxBoundaryRadius}
        
        // Colors
        const palette = forestPalette[p.floor(p.random(forestPalette.length))];
          
        /** Create Tree */
        const tree = new VermontTreePerformant({
          p5Instance: p,
          startPoint, 
          settings: {
            palette,
            treeSettings: {
              treeHeight, 
              treeWidth, 
              midpoint,
              bulgePoint
            },
            trunkSettings: {
              includeTrunk,
              trunkHeight, 
              trunkWidth, 
              numTrunkLines, 
            },
            leafSettings: {
              leafWidth, 
              leafHeight,
              rowHeight: calculatedRowHeight,
              leavesStartY: startY - trunkSpace,
              numLeavesPerPoint, 
              numPointsPerRow, 
              pointBoundaryRadius,
            },
            lightSettings: {
              lightAngle,
              lightFillPercentage,
            },
            windSettings: {
              windSpeed,
              windIntensitySpeed,
              maxWindIntensity,
              windPhase,
              windIntensityPhase,
            }
          }
        });

        forestTrees.push(tree);
      }
    }

    return forestTrees;
  }

  #getForestShape(shape: VermontForestShapes, columnIndex: number) {
    const {settings} = this;
    const {forestHeight, forestWidth, forestNumberOfColumns, forestTreeSettings} = settings;

    const minTreeHeight = forestTreeSettings.minHeight;
    const centerIndex = (forestNumberOfColumns - 1) / 2; // indenify center index for shapes that bulge like convave or convex
    const incrementY = minTreeHeight; // spaceing between trees. This will allow the trees to overlap
    
    let columnStartY = 0;
    let numTreesInColumn = 0;

    if (shape === 'convex') {
      let columnHeight: number;
      const maxDistFromCenter = centerIndex; // Max distance is from edge to center

      if (maxDistFromCenter <= 0) { // Handles 1 or 2 columns
        columnHeight = forestHeight; 
      } else {
        const distanceFromCenter = Math.abs(columnIndex - centerIndex);
        // Normalize distance: 0 at center, 1 at edges
        const t = distanceFromCenter / maxDistFromCenter; 
        // Apply quadratic easing (ease-in)
        const easedT = t * t; 
        // Height scales with eased normalized distance from center
        columnHeight = forestHeight * easedT; 
      }
      
      const maxY = columnStartY - columnHeight;
      numTreesInColumn = Math.max(1, (columnStartY - maxY) / incrementY) // Calc number of trees
    }

    if (shape === 'concave') {
      let columnHeight: number;
      const maxDistFromCenter = centerIndex; // Max distance is from edge to center

      if (maxDistFromCenter <= 0) { // Handles 1 or 2 columns
        columnHeight = forestHeight;
      } else {
        const distanceFromCenter = Math.abs(columnIndex - centerIndex);
        // Normalize distance: 0 at center, 1 at edges
        const t = distanceFromCenter / maxDistFromCenter;
        // Apply quadratic easing (ease-out equivalent for inverse logic)
        const easedT = t * t; 
        // Height scales inversely with eased normalized distance from center
        columnHeight = forestHeight * (1 - easedT);
      }
      
      const maxY = columnStartY - columnHeight;
      numTreesInColumn = Math.max(1, (columnStartY - maxY) / incrementY) // Calc number of trees
    }
    
    if (shape  === 'flat') {
      const columnHeight = forestHeight;
      const maxY = columnStartY - columnHeight;
      numTreesInColumn = Math.max(1, (columnStartY - maxY) / incrementY) // Calc number of trees based on how many can fit into the alotted space
    }
    
    if (shape === 'upHill') {
      let columnHeight: number;
      if (forestNumberOfColumns <= 1){
        columnHeight = forestHeight; // Handle edge case of a single column
      } else {
        const t = columnIndex / (forestNumberOfColumns - 1); // Normalize columnIndex to a value between 0 and 1 
        columnHeight = forestHeight * t; // Linearly scale the height from 0 up to forestHeight
      }

      const maxY = columnStartY - columnHeight;
      numTreesInColumn = Math.max(1, (columnStartY - maxY) / incrementY) // Calc number of trees
    }
    
    if (shape === 'downHill') {
      let columnHeight: number;
      if (forestNumberOfColumns <= 1) {
        columnHeight = forestHeight; // Handle edge case of a single column
      } else {
        const t = columnIndex / (forestNumberOfColumns - 1); // Normalize columnIndex to a value between 0 and 1
        columnHeight = forestHeight * (1 - t); // Linearly scale the height from forestHeight down to 0
      }
      const maxY = columnStartY - columnHeight;
      numTreesInColumn = Math.max(1, (columnStartY - maxY) / incrementY); // Ensure numTreesInColumn is at least 1
    }
    
    return {incrementY, numTreesInColumn}
    
  }
    
}