import React from 'react';
import tree1Sketch from './tree1Sketch';
import tree2Sketch from './tree2Sketch';
import tree3Sketch from './tree3Sketch';
import tree4Sketch from './tree4Sketch';
import tree5Sketch from './tree5Sketch';
import oneTreeSketch from './oneTreeSketch';
import { useDevice } from '../../context/DeviceContext';
import SeriesPage from '../../components/SeriesPage';

const route = "artwork/trees";

const sketches = [
  {sketch: tree5Sketch, subroute: 'tree5', label: 'Tree 5'},
  {sketch: tree4Sketch, subroute: 'tree4', label: 'Tree 4'},
  {sketch: tree1Sketch, subroute: 'tree1', label: 'Tree 1'},
  {sketch: tree2Sketch, subroute: 'tree2', label: 'Tree 2'},
  {sketch: tree3Sketch, subroute: 'tree3', label: 'Tree 3'},
  {sketch: oneTreeSketch, subroute: 'oneTree', label: 'Debug Tree'}
];

const SeriesPageTrees: React.FC = () => {
  const {isMobile} = useDevice();
  return (
      <SeriesPage
        sketches={sketches}
        route={route}
        disable={isMobile}
      />
  );
};

export default SeriesPageTrees;