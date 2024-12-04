import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import App from './App.tsx'

import SeriesPageVermont from './projects/vermont/SeriesPage.tsx';
import SeriesPageTrees from './projects/trees/SeriesPage.tsx';
import SeriesPageSeasons from './projects/seasons/SeriesPage.tsx';
import SeriesPageRowhomes from './projects/rowhomes/SeriesPage.tsx';
import SeriesPageDemos from './projects/demos/SeriesPage.tsx';
import SeriesPageCouch from './projects/couch/SeriesPage.tsx';
import RoyalFrame from './projects/pictureFrames/RoyalFrame.tsx';
import {mySketch as Tree3Sketch } from './projects/trees/Tree3.tsx';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/vermont/*" element={<SeriesPageVermont />} />
        <Route path="/trees/*" element={<SeriesPageTrees />} />
        <Route path="/seasons/*" element={<SeriesPageSeasons />} />
        <Route path="/rowhomes/*" element={<SeriesPageRowhomes />} />
        <Route path="/demos/*" element={<SeriesPageDemos />} />
        <Route path="/couch/*" element={<SeriesPageCouch />} />
        <Route 
          path="/pictureframes/royalframe" 
          element={
            <RoyalFrame 
              innerWidth={600} 
              innerHeight={600} 
              frameTopWidth={50}
              frameSideWidth={50}
              innerSketch={Tree3Sketch} 
            />
          } 
        />
      </Routes>
    </Router>
  </StrictMode>
)
