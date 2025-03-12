import React, { useState, useEffect } from 'react';
import SketchSelector from './SketchSelector';
import { useNavigate, useLocation } from 'react-router-dom';
import P5Wrapper from './P5Wrapper';
import p5 from 'p5';
import styles from './SeriesPage.module.css';

type Sketch = (p: p5) => void;

type Sketches = Array<{sketch: Sketch, subroute: string, label: string}>

interface SeriesPageProps {
    sketches: Sketches;
    route: string;
    disable: boolean;
    p5Props?: {disableClickToClear: boolean, disableClickToRedraw: boolean, disableClickToSetup: boolean};
}

const SeriesPage: React.FC<SeriesPageProps> = ({sketches, route, disable, p5Props}) => {
  const [selectedSketchIndex, setSelectedSketchIndex] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e: {target: {value: string}}) => {
    const sketchIndex = Number(e.target.value);
    setSelectedSketchIndex(sketchIndex);
    navigate(`/${route}/${sketches[sketchIndex].subroute}`);
  };

  useEffect(() => {
    const path = location.pathname.split('/');
    const subroute = path[path.length - 1];
    if (subroute && sketches.map(s => s.subroute).includes(subroute)) {
      const index = sketches.findIndex(s => s.subroute === subroute);
      setSelectedSketchIndex(index);
    } else {
      navigate(`/${route}/${sketches[selectedSketchIndex].subroute}`);
    }
  }, [location.pathname, route, sketches, selectedSketchIndex, navigate]);

  return (
    <div className={styles.seriesPage}>
      {disable ? (
        <h2 className={styles.mobileOnly}> 
          These sketches can be viewed on Desktop only 😢 
        </h2>        
      ) : (
        <div className={styles.contentContainer}>
          <SketchSelector
            route={route}
            sketches={sketches} 
            selectedSketchIndex={selectedSketchIndex}
            handleChange={handleChange}
          />
          <div className={styles.sketchContainer}>
            <P5Wrapper sketch={sketches[selectedSketchIndex].sketch} {...p5Props}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesPage;