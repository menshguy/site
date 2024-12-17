import React from 'react';
import { mySketch as vermontSeasonsSketch } from './VermontSeasons';
import { mySketch as vermontIISketch } from './VermontII';
import { mySketch as vermontIIISketch } from './VermontIII';
import { mySketch as vermontIIIAnimatedSketch } from './VermontIIIAnimated';
import { mySketch as vermontIIIWildCardSketch } from './VermontIIIWildCard';
import { mySketch as vermontIIIISketch } from './VermontIIII';
import Page from '../../components/Page';

const sketches = {
  "Rainy Day": vermontSeasonsSketch,
  "Vermont II": vermontIISketch,
  "Vermont III": vermontIIISketch,
  "Vermont Breeze (WIP)": vermontIIIAnimatedSketch,
  "Vermont Random": vermontIIIWildCardSketch,
  "Solo Tree": vermontIIIISketch,
};

const SeriesPage: React.FC = () => {
  return (
    <div>
      <h1>Vermont</h1>
      <Page 
        sketches={sketches} 
        route={"vermont"}
      />
    </div>
  );
};

export default SeriesPage;