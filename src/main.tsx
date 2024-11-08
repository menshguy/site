import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import App from './App.tsx'
import FallSunlight from './components/FallSunlight.tsx';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/fallsunlight" element={<FallSunlight />} /> {/* New route */}
      </Routes>
    </Router>
  </StrictMode>
)
