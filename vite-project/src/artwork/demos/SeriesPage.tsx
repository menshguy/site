import React from 'react';
import Page from '../../components/Page';
import { mySketch as bezierDemoSketch } from './BezierDemo';
import { mySketch as shapeCreatorSketch } from './ShapeCreator';

const sketches = {
  shapeCreator: shapeCreatorSketch,
  bezierDemo: bezierDemoSketch(),
};

const SeriesPage: React.FC = () => {
  return (
    <div>
      <Page
        header={"Demos & Tutorials"}
        sketches={sketches} 
        route={"artwork/demos"}
        disableClickToSetup 
        disableClickToClear 
        disableClickToRedraw
      />
    </div>
  );
};

export default SeriesPage;