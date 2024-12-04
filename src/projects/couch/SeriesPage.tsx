import React from 'react';
import Page from '../../components/Page';
import { mySketch as couchSketch } from './Couch';
import { mySketch as ThreeDTestSketch } from './ThreeDTest';

const sketches = {
  couch: couchSketch,
  threeDTest: ThreeDTestSketch,
};

const SeriesPage: React.FC = () => {
  return (
    <div>
      <h1>Couch</h1>
      <Page 
        sketches={sketches} 
        route={"couch"}
      />
    </div>
  );
};

export default SeriesPage;