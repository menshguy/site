import React from 'react';
import fallSunlightSketch from './fallSunlightSketch';
import seasonalForestsSketch from './seasonalForestsSketch';
import vermontSketch from './vermontSketch';
import { useDevice } from '../../context/DeviceContext';
import SeriesPage from '../../components/SeriesPage';

const sketches = [
  {sketch: vermontSketch(), subroute: 'vermont', label: 'Vermont'},
  {sketch: fallSunlightSketch(), subroute: 'fallSunlight', label: 'Fall Sunlight'},
  {sketch: seasonalForestsSketch(), subroute: 'seasonalForests', label: 'Seasonal Forests'},
  // {sketch: fallBreezeSketch(), subroute: 'treefallBreeze', label: 'Fall Breeze'},
];

const route = "artwork/seasons";

const SeasonsPage: React.FC = () => {
  const {isMobile} = useDevice();

  return (
    <SeriesPage
      sketches={sketches}
      route={route}
      disable={isMobile}
    />
  );
};

export default SeasonsPage;