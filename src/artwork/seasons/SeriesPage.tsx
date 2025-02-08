import React from 'react';
import Page from '../../components/Page';
// import { mySketch as fallBreezeSketch } from './FallBreeze';
import { mySketch as fallSunlightSketch } from './FallSunlight';
import { mySketch as seasonalForestsSketch } from './SeasonalForests';
import { mySketch as vermontSketch } from './Vermont';

const sketches = {
  // treefallBreeze: fallBreezeSketch(),
  vermont: vermontSketch(),
  fallSunlight: fallSunlightSketch(),
  seasonalForests: seasonalForestsSketch(),
};

const SeriesPage: React.FC = () => {
  return (
    <div>
      <Page
        header={"Seasons"}
        sketches={sketches} 
        route={"artwork/seasons"}
      />
    </div>
  );
};

export default SeriesPage;