import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { DeviceProvider } from './context/DeviceContext.tsx';
import MainNav from './components/MainNav.tsx';
import App from './App.tsx'

// Projects Imports
import ProjectsPage from './projects/ProjectsPage.tsx';
import ProjectPageNoise2Ink from './projects/ProjectPageNoise2Ink.tsx';

// Artwork Imports
import ArtworkPage from './artwork/ArtworkPage.tsx';
import SeriesPageVermont from './artwork/vermont/SeriesPage.tsx';
import SeriesPageTrees from './artwork/trees/SeriesPage.tsx';
import SeriesPageSeasons from './artwork/seasons/SeriesPage.tsx';
import SeriesPageRowhomes from './artwork/rowhomes/SeriesPage.tsx';
import SeriesPageDemos from './artwork/demos/SeriesPage.tsx';
import SeriesPageCouch from './artwork/couch/SeriesPage.tsx';
import RoyalFrame from './artwork/pictureFrames/RoyalFrame.tsx';
import {mySketch as seasonalForestsSketch } from './artwork/seasons/SeasonalForests.tsx';
import './index.css'

function AppWithNav() {

  return (
    <>
      <MainNav />
      <div className="main-content">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<App />} />
        
        <Route path="projects">
          <Route index element={<ProjectsPage />} />
          <Route path="noise2ink" element={<ProjectPageNoise2Ink />} />
        </Route>
        
        <Route path="artwork">
          <Route index element={<ArtworkPage />} />
          <Route path="vermont/*" element={<SeriesPageVermont />} />
          <Route path="trees/*" element={<SeriesPageTrees />} />
          <Route path="seasons/*" element={<SeriesPageSeasons />} />
          <Route path="rowhomes/*" element={<SeriesPageRowhomes />} />
          <Route path="demos/*" element={<SeriesPageDemos />} />
          <Route path="couch/*" element={<SeriesPageCouch />} />
        </Route>
        
        <Route 
          path="/pictureframes/royalframe" 
          element={
            <div style={{ position: 'absolute', top: '64px' }}>
              <RoyalFrame 
                innerWidth={800} 
                innerHeight={800} 
                // frameTopWidth={100}
                // frameSideWidth={100}
                innerSketch={seasonalForestsSketch()} 
              />
            </div>
          } 
        />
      </Routes>
      </div>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DeviceProvider>
      <Router>
        <AppWithNav />
      </Router>
    </DeviceProvider>
  </StrictMode>
)