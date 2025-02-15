import React from 'react';
import { mySketch as vermontSeasonsSketch } from './VermontSeasons';
import { mySketch as vermontIISketch } from './VermontII';
import { mySketch as vermontIIISketch } from './VermontIII';
// import { mySketch as vermontIIIAnimatedSketch } from './VermontIIIAnimated';
// import { mySketch as vermontIIIWildCardSketch } from './VermontIIIWildCard';
import { mySketch as vermontIIIISketch } from './VermontIIII';
import Page from '../../components/Page';
import { useDevice } from '../../context/DeviceContext';

const sketches = {
  "VermontIII": vermontIIISketch,
  "VermontII": vermontIISketch,
  "SoloTree": vermontIIIISketch,
  // "VermontBreeze(WIP)": vermontIIIAnimatedSketch, // Needs work - crashes browser and isnt finished
  // "VermontRandom": vermontIIIWildCardSketch, // Not great yet
  "RainyDay": vermontSeasonsSketch,
};

const SeriesPage: React.FC = () => {
  const {isMobile} = useDevice();
  return (
    <div>
      { isMobile ? (
        <h2 style={{margin: "80px 20px"}}> These sketches can be viewed on Desktop only 😢 </h2>        
      ) : (
        <Page
          header={"Vermont"}
          sketches={sketches} 
          route={"artwork/vermont"}
        />
      )}
    </div>
  );
};

export default SeriesPage;