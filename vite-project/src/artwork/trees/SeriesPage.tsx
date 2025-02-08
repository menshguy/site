import React from 'react';
import Page from '../../components/Page';
import { mySketch as tree1Sketch } from './Tree1';
import { mySketch as tree2Sketch } from './Tree2';
import { mySketch as tree3Sketch } from './Tree3';
import { mySketch as tree4Sketch } from './Tree4';
import { mySketch as tree5Sketch } from './Tree5';
import { mySketch as oneTreeSketch } from './OneTree';

const sketches = {
  tree1: tree1Sketch,
  tree2: tree2Sketch,
  tree3: tree3Sketch,
  tree4: tree4Sketch,
  tree5: tree5Sketch,
  oneTree: oneTreeSketch,
};

const SeriesPage: React.FC = () => {
  return (
    <div>
      <Page
        header={"Trees"}
        sketches={sketches} 
        route={"artwork/trees"}
        />
    </div>
  );
};

export default SeriesPage;