import React from 'react';
import Page from '../../components/Page';
// import { mySketch as fallBreezeSketch } from './FallBreeze';
import { mySketch as fallSunlightSketch } from './FallSunlight';
import { mySketch as seasonalForestsSketch } from './SeasonalForests';
import { mySketch as vermontSketch } from './Vermont';
import { useDevice } from '../../context/DeviceContext';

const sketches = {
  // treefallBreeze: fallBreezeSketch(),
  vermont: vermontSketch(),
  fallSunlight: fallSunlightSketch(),
  seasonalForests: seasonalForestsSketch(),
};

const SeriesPage: React.FC = () => {
  const {isMobile} = useDevice();
  return (
    <div>
      { isMobile ? (
        <h2 style={{margin: "80px 20px"}}> These sketches can be viewed on Desktop only 😢 </h2>        
      ) : (
        <Page
          header={"Seasons"}
          sketches={sketches} 
          route={"artwork/seasons"}
        />
      )}
    </div>
  );
};

export default SeriesPage;