import React from 'react';
import Page from '../../components/Page';
import { mySketch as bezierDemoSketch } from './BezierDemo';

const sketches = {
  bezierDemo: bezierDemoSketch(),
};

const SeriesPage: React.FC = () => {
  return (
    <div>
      <Page
        header={"Demos & Tutorials"}
        sketches={sketches} 
        route={"artwork/demos"}
        />
    </div>
  );
};

export default SeriesPage;