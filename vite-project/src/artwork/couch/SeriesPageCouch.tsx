import React from 'react';
import couchSketch from './couchSketch';
// import ThreeDTestSketch from './ThreeDTest';
import { useDevice } from '../../context/DeviceContext';
import SeriesPage from '../../components/SeriesPage';

const route = "artwork/couch";

const sketches = [
  {sketch: couchSketch, subroute: 'couch', label: 'Couch'},
  // {sketch: ThreeDTestSketch, subroute: 'threeDTest', label: '3D Test'}
];

const SeriesPageCouch: React.FC = () => {
  const {isMobile} = useDevice();
  return (
      <SeriesPage
        sketches={sketches}
        route={route}
        disable={isMobile}
      />
  );
};

export default SeriesPageCouch;