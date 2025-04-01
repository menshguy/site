import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDevice } from '../context/DeviceContext.tsx';
import styles from './SketchSelector.module.css';
import p5 from 'p5';

type Sketch = (p: p5) => void;

type Sketches = Array<{sketch: Sketch, subroute: string, label: string}>

interface SketchSelectorProps {
  sketches: Sketches;
  route: string;
  handleChange: (e: {target: {value: string}}) => void;
  selectedSketchIndex: number;
}

const SketchSelector: React.FC<SketchSelectorProps> = ({ sketches, route, handleChange, selectedSketchIndex = 0, ...props }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {isMobile} = useDevice();

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    
    if (path === route) {
      navigate(`/${route}/${sketches[selectedSketchIndex].subroute}`); // If no path, navigate to initial sketch
    } else if (path && sketches.map(s => s.subroute).includes(path)) {
      const value = sketches.findIndex(s => s.subroute === path);
      handleChange({target: {value: value.toString()}}); // If path, set selected sketch
    } else {
      navigate(`/${route}/${sketches[selectedSketchIndex].subroute}`); // If no path, set selected sketch to initial sketch
    }
  }, [location.pathname]);

  return (
    <div className={isMobile ? styles.mobileContainer : styles.container}>
      <div className={isMobile ? styles.mobileActionsContainer : styles.actionsContainer} {...props}>
        <select className={styles.select} value={selectedSketchIndex} onChange={handleChange}>
          {sketches.map((sketch, index) => (
            <option 
              key={index} 
              value={index}
            >
              {sketch.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SketchSelector;