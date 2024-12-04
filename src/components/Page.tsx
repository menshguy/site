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
  const [selectedSketch, setSelectedSketch] = useState<keyof typeof sketches>(Object.keys(sketches)[0] as keyof typeof sketches);

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && Object.keys(sketches).includes(path)) {
      setSelectedSketch(path as keyof typeof sketches);
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
      <P5Wrapper sketch={sketches[selectedSketch]} />
    </div>
  );
};

export default Page;