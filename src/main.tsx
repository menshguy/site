import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import MainNav from './components/MainNav.tsx';
import App from './App.tsx'

import SeriesPageVermont from './projects/vermont/SeriesPage.tsx';
import SeriesPageTrees from './projects/trees/SeriesPage.tsx';
import SeriesPageSeasons from './projects/seasons/SeriesPage.tsx';
import SeriesPageRowhomes from './projects/rowhomes/SeriesPage.tsx';
import SeriesPageDemos from './projects/demos/SeriesPage.tsx';
import SeriesPageCouch from './projects/couch/SeriesPage.tsx';
import RoyalFrame from './projects/pictureFrames/RoyalFrame.tsx';
import {mySketch as seasonalForestsSketch } from './projects/seasons/SeasonalForests.tsx';
import './index.css'

function AppWithNav() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      {!isHomePage && <MainNav />}
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
            <div style={{ position: 'absolute', top: '64px' }}>
              <RoyalFrame 
                innerWidth={800} 
                innerHeight={800} 
                // frameTopWidth={100}
                // frameSideWidth={100}
                innerSketch={seasonalForestsSketch} 
              />
            </div>
          } 
        />
      </Routes>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AppWithNav />
    </Router>
  </StrictMode>
)