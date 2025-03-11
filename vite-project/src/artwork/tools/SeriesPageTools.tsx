import React from 'react';
import bezierDemoSketch from './bezierSketch.tsx';
import shapeCreatorSketch from './shapeCreatorSketch.tsx';
import { useDevice } from '../../context/DeviceContext.tsx';
import SeriesPage from '../../components/SeriesPage.tsx';

const sketches = [
  {sketch: shapeCreatorSketch, subroute: 'shapeCreator', label: 'Shape Creator'},
  {sketch: bezierDemoSketch(600, 600), subroute: 'bezierDemo', label: 'Bezier Demo'},
];

const route = "artwork/tools";

const SeriesPageTools: React.FC = () => {
  const { isMobile } = useDevice();
  return (
    <SeriesPage
      sketches={sketches}
      route={route}
      disable={isMobile}
      p5Props={{disableClickToClear: true, disableClickToRedraw: true, disableClickToSetup: true}}
    />
  );
};

export default SeriesPageTools;