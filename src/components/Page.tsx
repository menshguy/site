import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import P5Wrapper from './P5Wrapper';

interface PageProps {
  sketches: Record<string, any>; // Adjust 'any' to the specific type if known
  route: string;
}

const Page: React.FC<PageProps> = ({ sketches, route }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSketch, setSelectedSketch] = useState<keyof typeof sketches>('');

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
    <div>
      <select value={selectedSketch} onChange={handleChange}>
        {Object.keys(sketches).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>

      <P5Wrapper includeSaveButton={true} sketch={sketches[selectedSketch]} />
    </div>
  );
};

export default Page;