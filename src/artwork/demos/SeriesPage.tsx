import React from 'react';
import Page from '../../components/Page';
import { mySketch as bezierDemoSketch } from './BezierDemo';

const sketches = {
  bezierDemo: bezierDemoSketch(),
};

const SeriesPage: React.FC = () => {
  return (
    <div>
      <h1>Demos & Tutorials</h1>
      <Page 
        sketches={sketches} 
        route={"artwork/demos"}
        />
    </div>
  );
};

export default SeriesPage;