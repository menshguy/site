import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDevice } from '../context/DeviceContext.tsx';
import P5Wrapper from './P5Wrapper';

interface PageProps {
  sketches: Record<string, any>; // Adjust 'any' to the specific type if known
  route: string;
  header: string;
  subheader?: string;
}

const Page: React.FC<PageProps> = ({ sketches, route, header, subheader }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {isMobile} = useDevice();
  const [selectedSketch, setSelectedSketch] = useState<keyof typeof sketches>('');
  const userPrompt = isMobile ? 'Refresh page to redraw' : 'Click sketch to redraw';

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    const initialSketch = Object.keys(sketches)[0] as keyof typeof sketches;
    if (path === route) {
      navigate(`/${route}/${initialSketch}`); // If no path, navigate to initial sketch
    } else if (path && Object.keys(sketches).includes(path)) {
      setSelectedSketch(path as keyof typeof sketches); // If path, set selected sketch
    } else {
      navigate(`/${route}/${initialSketch}`); // If no path, set selected sketch to initial sketch
    }
  }, [location.pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSketch = e.target.value as keyof typeof sketches;
    setSelectedSketch(newSketch);
    navigate(`/${route}/${newSketch}`);
  };

  return (
    <div style={{padding: isMobile ? '5px' : '50px'}}>
      
      {/* Headers */}
      {header && <h1 style={isMobile ? {margin: 0, display: 'flex', justifyContent: 'center'} : {margin: 0}}>{header}</h1>}
      {subheader && <h2>{subheader}</h2>}
      
      {/* Actions */}
      <div style={{display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center'}}>
        <select value={selectedSketch} onChange={handleChange}>
          {Object.keys(sketches).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
        <p style={{paddingLeft: 5}}>{userPrompt}</p>
      </div>

      {/* Sketch */}
      <P5Wrapper includeSaveButton={true} sketch={sketches[selectedSketch]} />
    </div>
  );
};

export default Page;