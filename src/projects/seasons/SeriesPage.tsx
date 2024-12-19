import React from 'react';
import Page from '../../components/Page';
import { mySketch as fallBreezzeSketch } from './FallBreeze';
import { mySketch as fallSunlightSketch } from './FallSunlight';
import { mySketch as seasonalForestsSketch } from './SeasonalForests';
import { mySketch as vermontSketch } from './Vermont';

const sketches = {
  treefallBreezze: fallBreezzeSketch,
  fallSunlight: fallSunlightSketch,
  seasonalForests: seasonalForestsSketch,
  vermont: vermontSketch,
};

const SeriesPage: React.FC = () => {
  return (
    <div>
      <h1>Seasons</h1>
      <Page 
        sketches={sketches} 
        route={"seasons"}
      />
    </div>
  );
};

export default SeriesPage;