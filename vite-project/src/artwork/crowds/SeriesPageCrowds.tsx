import React from 'react';
import crowdSketch from './crowdSketch';
// import ThreeDTestSketch from './ThreeDTest';
import { useDevice } from '../../context/DeviceContext';
import SeriesPage from '../../components/SeriesPage';

const route = "artwork/crowds";

const sketches = [
  {sketch: crowdSketch, subroute: 'crowd', label: 'Crowd'},
];

const SeriesPageCrowds: React.FC = () => {
  const {isMobile} = useDevice();
  return (
      <SeriesPage
        sketches={sketches}
        route={route}
        disable={isMobile}
        p5Props={{disableClickToClear: true, disableClickToRedraw: true, disableClickToSetup: true}}
      />
  );
};

export default SeriesPageCrowds;