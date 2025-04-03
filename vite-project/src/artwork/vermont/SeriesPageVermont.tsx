import React from 'react';
import { mySketch as vermontIISketch } from './VermontII';
import { mySketch as vermontIIISketch } from './VermontIII';
import { mySketch as vermontIII_PERFORMANT_Sketch } from './VermontIII_Performant';
import { mySketch as vermontIIIISketch } from './VermontIIII';
// import { mySketch as vermontSeasonsSketch } from './VermontSeasons';
// import { mySketch as vermontIIIAnimatedSketch } from './VermontIIIAnimated';
// import { mySketch as vermontIIIWildCardSketch } from './VermontIIIWildCard';
import { useDevice } from '../../context/DeviceContext';
import SeriesPage from '../../components/SeriesPage';

const route = "artwork/vermont";

const sketches = [
  {sketch: vermontIIISketch, subroute: 'vermontIII', label: 'Vermont I'},
  {sketch: vermontIII_PERFORMANT_Sketch, subroute: 'vermontIII_Performant', label: 'Vermont Performant'},
  {sketch: vermontIISketch, subroute: 'vermontII', label: 'VermontII'},
  {sketch: vermontIIIISketch, subroute: 'soloTree', label: 'Reflection'},
  // {sketch: vermontSeasonsSketch, subroute: 'rainyDay', label: 'Rainy Day'},
  // {sketch: vermontIIIAnimatedSketch, subroute: 'VermontBreeze(WIP)', label: 'VermontBreeze(WIP)'},
  // {sketch: vermontIIIWildCardSketch, subroute: 'VermontRandom', label: 'VermontRandom'},
]

const SeriesPageVermont: React.FC = () => {
  const {isMobile} = useDevice();
  return (
      <SeriesPage
        sketches={sketches}
        route={route}
        disable={isMobile}
      />
  );
};

export default SeriesPageVermont;