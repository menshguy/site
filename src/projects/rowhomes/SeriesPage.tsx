import React from 'react';
import Page from '../../components/Page';
// import { mySketch as rowHome1Sketch } from './Rowhome1';
import { mySketch as rowHome2Sketch } from './Rowhome2';
import { mySketch as rowHome3Sketch } from './Rowhome3';

const sketches = {
  "Rowhome": rowHome3Sketch,
  "Rowhome(Draft)": rowHome2Sketch,
};

const SeriesPage: React.FC = () => {
  return (
    <div>
      <h1>Rowhomes</h1>
      <Page 
        sketches={sketches} 
        route={"rowhomes"}
        />
    </div>
  );
};

export default SeriesPage;