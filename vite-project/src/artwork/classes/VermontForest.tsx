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
      numPointsPerRow: number, 
      numLeavesPerPoint: number, 
      minBoundaryRadius: number;
      maxBoundaryRadius: number;
      rowHeight: number, // REMOVE this and calcuate dynamically in VermontTreePerformant class based on height of tree and boundary radius
      leafWidth: number, 
      leafHeight: number,
  },
  forestLightSettings?: {
    lightAngle: number, // Radians (i.e p.radians(200))
    lightFillPercentage: number, // portion of leaves that will highlight color, facing sun
  },
}

export class VermontForest {
  private p: p5;
  private settings: VermontForestSettings;

  constructor({p5Instance, settings}: {p5Instance: p5; settings: VermontForestSettings}) {
    this.p = p5Instance;
    this.settings = settings;
  }

  getImage(width: number, height: number){
    const {forestStartX, forestStartY} = this.settings;
    const trees = this.#generateForestTrees();
    const buffer = this.p.createGraphics(width, height);
    
    buffer.push();
    // buffer.translate(forestStartX, forestStartY);
    trees.forEach(tree => tree.draw(buffer))
    buffer.pop();

    return buffer;
  }

  #generateForestTrees() {
    const {p, settings} = this;
    const {forestNumberOfColumns, forestStartX, forestStartY, forestShape,forestPalette,forestTreeSettings, forestLeafSettings, forestTrunkSettings, forestLightSettings} = settings;
    const {trunkSpace, minHeight, maxHeight} = forestTreeSettings;
    const {numTrunkLines, trunkHeight, trunkWidth: _trunkWidth} = forestTrunkSettings;
    const {leafWidth, leafHeight, minBoundaryRadius, maxBoundaryRadius, numLeavesPerPoint, numPointsPerRow} = forestLeafSettings;
    const {lightAngle, lightFillPercentage} = forestLightSettings || {lightAngle: 0, lightFillPercentage: 0};

    let trees = []
    for (let i = 0; i < forestNumberOfColumns; i++) {
      
      const {incrementY, numTreesInColumn} = this.#getForestShape(forestShape, i)
      for (let j = Math.floor(numTreesInColumn); j >= 0; j--) {
        // Tree Settings
        // let trunkHeight = p.random(trunkHeight, trunkHeight);
        const isFirstTreeInColumn = j === 0;
        const includeTrunk = isFirstTreeInColumn;
        const treeHeight = p.random(minHeight, maxHeight); // total height including leaves
        const trunkWidth = _trunkWidth;
        const treeWidth = p.random(trunkWidth, trunkWidth+5); // total width including leaves
        // const numTrunkLines = p.random(3,5); //trunks are made up of X bezier curves
        const rowHeight = treeHeight/5; //x points will drawn p.randominly in each row. rows increment up by this amount
        const startX = (forestStartX + treeWidth + 20) + (i * ( (p.width+treeWidth)/forestNumberOfColumns ) + p.random(-25, 25)) // add an extra treeWidth for some bufferspace
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
              rowHeight,
              leavesStartY: startY - trunkSpace,
              numLeavesPerPoint, 
              numPointsPerRow, 
              pointBoundaryRadius,
            },
            lightSettings: {
              lightAngle,
              lightFillPercentage,
            }
          }
        });

        trees.push(tree);
      }
    }

    return trees;
  }

  #getForestShape(shape: VermontForestShapes, columnIndex: number) {
    const {settings} = this;
    const {forestHeight, forestNumberOfColumns, forestTreeSettings} = settings;
    const {minHeight: minTreeHeight} = forestTreeSettings;
    const maxForestHeight = forestHeight;
    
    const centerIndex = (forestNumberOfColumns - 1) / 2; // indenify center index for shapes that bulge like convave or convex
    const incrementY = minTreeHeight/2; // spaceing between trees. This will allow the trees to overlap
    
    let columnStartY = 0;
    let numTreesInColumn = 0;

    if (shape === 'convex') {
      let columnHeight: number;
      const maxDistFromCenter = centerIndex; // Max distance is from edge to center

      if (maxDistFromCenter <= 0) { // Handles 1 or 2 columns
        columnHeight = maxForestHeight; 
      } else {
        const distanceFromCenter = Math.abs(columnIndex - centerIndex);
        // Normalize distance: 0 at center, 1 at edges
        const t = distanceFromCenter / maxDistFromCenter; 
        // Apply quadratic easing (ease-in)
        const easedT = t * t; 
        // Height scales with eased normalized distance from center
        columnHeight = maxForestHeight * easedT; 
      }
      
      const maxY = columnStartY - columnHeight;
      numTreesInColumn = Math.max(1, (columnStartY - maxY) / incrementY) // Calc number of trees
    }

    if (shape === 'concave') {
      let columnHeight: number;
      const maxDistFromCenter = centerIndex; // Max distance is from edge to center

      if (maxDistFromCenter <= 0) { // Handles 1 or 2 columns
        columnHeight = maxForestHeight;
      } else {
        const distanceFromCenter = Math.abs(columnIndex - centerIndex);
        // Normalize distance: 0 at center, 1 at edges
        const t = distanceFromCenter / maxDistFromCenter;
        // Apply quadratic easing (ease-out equivalent for inverse logic)
        const easedT = t * t; 
        // Height scales inversely with eased normalized distance from center
        columnHeight = maxForestHeight * (1 - easedT);
      }
      
      const maxY = columnStartY - columnHeight;
      numTreesInColumn = Math.max(1, (columnStartY - maxY) / incrementY) // Calc number of trees
    }
    
    if (shape  === 'flat') {
      const columnHeight = maxForestHeight;
      const maxY = columnStartY - columnHeight;
      numTreesInColumn = Math.max(1, (columnStartY - maxY) / incrementY) // Calc number of trees based on how many can fit into the alotted space
    }
    
    if (shape === 'upHill') {
      let columnHeight: number;
      if (forestNumberOfColumns <= 1){
        columnHeight = maxForestHeight; // Handle edge case of a single column
      } else {
        const t = columnIndex / (forestNumberOfColumns - 1); // Normalize columnIndex to a value between 0 and 1 
        columnHeight = maxForestHeight * t; // Linearly scale the height from 0 up to maxForestHeight
      }

      const maxY = columnStartY - columnHeight;
      numTreesInColumn = Math.max(1, (columnStartY - maxY) / incrementY) // Calc number of trees
    }
    
    if (shape === 'downHill') {
      let columnHeight: number;
      if (forestNumberOfColumns <= 1) {
        columnHeight = maxForestHeight; // Handle edge case of a single column
      } else {
        const t = columnIndex / (forestNumberOfColumns - 1); // Normalize columnIndex to a value between 0 and 1
        columnHeight = maxForestHeight * (1 - t); // Linearly scale the height from maxForestHeight down to 0
      }
      const maxY = columnStartY - columnHeight;
      numTreesInColumn = Math.max(1, (columnStartY - maxY) / incrementY); // Ensure numTreesInColumn is at least 1
    }
    
    return {incrementY, numTreesInColumn}
    
  }
    
}