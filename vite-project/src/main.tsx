import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { DeviceProvider } from './context/DeviceContext.tsx';
import { NavProvider } from './context/NavContext.tsx';
import { Analytics } from "@vercel/analytics/react"
import MainNav from './components/MainNav.tsx';
import {useNav} from './context/NavContext.tsx';
import App from './App.tsx'

// Projects Imports
import ProjectsPage from './projects/ProjectsPage.tsx';
import ProjectPageNoise2Ink from './projects/ProjectPageNoise2Ink.tsx';
import ProjectPageSnowFrame from './projects/ProjectPageSnowFrame.tsx';
import ProjectPageAnniversary from './projects/ProjectPageAnniversary.tsx';

// Artwork Imports
import ArtworkPage from './artwork/ArtworkPage.tsx';
import SeriesPageVermont from './artwork/vermont/SeriesPageVermont.tsx';
import SeriesPageTrees from './artwork/trees/SeriesPageTrees.tsx';
import SeriesPageSeasons from './artwork/seasons/SeriesPageSeasons.tsx';
import SeriesPageRowhomes from './artwork/rowhomes/SeriesPageRowhomes.tsx';
import SeriesPageTools from './artwork/tools/SeriesPageTools.tsx';
import SeriesPageCouch from './artwork/couch/SeriesPageCouch.tsx';
import SeriesPageCrowds from './artwork/crowds/SeriesPageCrowds.tsx';
import SeriesPageRoyalFrames from './artwork/pictureFrames/SeriesPagePictureframes.tsx';
// import SeriesPageScribbleFrames from './artwork/pictureFrames/SeriesPageScribble.tsx';
// import SeriesPageScribbleFrames2 from './artwork/pictureFrames/SeriesPageScribble2.tsx';
import './index.css'

function AppWithNav() {

  const {navHeight} = useNav();

  return (
    <>
      <MainNav />
      <div style={{marginTop: navHeight}}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/home" element={<App />} />
          
          <Route path="projects">
            <Route index element={<ProjectsPage />} />
            <Route path="noise2ink" element={<ProjectPageNoise2Ink />} />
            <Route path="snowframe" element={<ProjectPageSnowFrame />} />
            <Route path="anniversary" element={<ProjectPageAnniversary />} />
          </Route>
          
          <Route path="artwork">
            <Route index element={<ArtworkPage />} />
            <Route path="vermont/*" element={<SeriesPageVermont />} />
            <Route path="seasons/*" element={<SeriesPageSeasons />} />
            <Route path="pictureframes/*" element={<SeriesPageRoyalFrames />} />
            <Route path="trees/*" element={<SeriesPageTrees />} />
            <Route path="rowhomes/*" element={<SeriesPageRowhomes />} />
            <Route path="tools/*" element={<SeriesPageTools />} />
            <Route path="couch/*" element={<SeriesPageCouch />} />
            <Route path="crowds/*" element={<SeriesPageCrowds />} />
          </Route>
  

        </Routes>
      </div>
      
      {/* Vercel Analytics: https://vercel.com/docs/analytics/quickstart#add-the-analytics-component-to-your-app */}
      <Analytics />
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DeviceProvider>
      <NavProvider>
        <Router>
          <AppWithNav />
        </Router>
      </NavProvider>
    </DeviceProvider>
  </StrictMode>
)