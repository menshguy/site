import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import App from './App.tsx'
import OneTree from './projects/seasons/OneTree.tsx';
import Vermont from './projects/seasons/Vermont.tsx';
import VermontII from './projects/seasons/VermontII.tsx';
import VermontIII from './projects/seasons/VermontIII.tsx';
import VermontIIIAnimated from './projects/seasons/VermontIIIAnimated.tsx';
import VermontIIIWildCard from './projects/seasons/VermontIIIWildCard.tsx';
import VermontSeasons from './projects/seasons/VermontSeasons.tsx';
import VermontIIII from './projects/seasons/VermontIIII.tsx';
import FallSunlight from './projects/seasons/FallSunlight.tsx';
import FallBreeze from './projects/seasons/FallBreeze.tsx';
import SeasonalForests from './projects/seasons/SeasonalForests.tsx';
import ThreeDTest from './projects/3dtest/ThreeDTest.tsx';
import Couch from './projects/couch/Couch.tsx';
import Tree1 from './projects/trees/Tree5.tsx';
import Tree2 from './projects/trees/Tree4.tsx';
import Tree3 from './projects/trees/Tree3.tsx';
import Tree4 from './projects/trees/Tree2.tsx';
import Tree5 from './projects/trees/Tree1.tsx';
// import Rowhome1 from './projects/rowhomes/Rowhome1.tsx';
import Rowhome2 from './projects/rowhomes/Rowhome2.tsx';
import Rowhome3 from './projects/rowhomes/Rowhome3.tsx';
import BezierDemo from './projects/demos/BezierDemo.tsx';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/vermont" element={<Vermont />} />
        <Route path="/vermontii" element={<VermontII />} />
        <Route path="/vermontiii" element={<VermontIII />} />
        <Route path="/vermontiiia" element={<VermontIIIAnimated />} />
        <Route path="/vermontiiiwildcard" element={<VermontIIIWildCard />} />
        <Route path="/vermontseasons" element={<VermontSeasons />} />
        <Route path="/vermontiiii" element={<VermontIIII />} />
        <Route path="/couch" element={<Couch />} />
        <Route path="/OneTree" element={<OneTree />} />
        <Route path="/fallsunlight" element={<FallSunlight />} />
        <Route path="/fallbreeze" element={<FallBreeze />} />
        <Route path="/seasonalforests" element={<SeasonalForests />} />
        <Route path="/3dtest" element={<ThreeDTest />} />
        <Route path="/tree1" element={<Tree1 />} />
        <Route path="/tree2" element={<Tree2 />} />
        <Route path="/tree3" element={<Tree3 />} />
        <Route path="/tree4" element={<Tree4 />} />
        <Route path="/tree5" element={<Tree5 />} />
        {/* <Route path="/rowhome1" element={<Rowhome1 />} /> */}
        <Route path="/rowhome2" element={<Rowhome2 />} />
        <Route path="/rowhome3" element={<Rowhome3 />} />
        <Route path="/bezierdemo" element={<BezierDemo />} />
      </Routes>
    </Router>
  </StrictMode>
)
