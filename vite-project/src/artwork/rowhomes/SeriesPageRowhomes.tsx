import React from 'react';
import { useDevice } from '../../context/DeviceContext.tsx';
import SeriesPage from '../../components/SeriesPage.tsx';
import rowhome1Sketch from './rowhome1Sketch';
import rowhome2Sketch from './rowhome2Sketch';
import rowhome3Sketch from './rowhome3Sketch';

const sketches = [
  {sketch: rowhome3Sketch, subroute: 'rowhome', label: 'Rowhome (wip)'},
  {sketch: rowhome2Sketch, subroute: 'rowhomeolder', label: 'Rowhome (older)'},
  {sketch: rowhome1Sketch, subroute: 'rowhomeolder', label: 'Rowhome (old)'},
];

const route = "artwork/rowhomes";

const SeriesPageRowhomes: React.FC = () => {
  const { isMobile } = useDevice();
  return (
    <SeriesPage
      sketches={sketches}
      route={route}
      disable={isMobile}
    />
  );
};

export default SeriesPageRowhomes;