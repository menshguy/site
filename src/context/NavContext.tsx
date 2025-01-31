import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDevice } from './DeviceContext';

interface NavContextType {
  navHeight: number;
  setNavHeight: (height: number) => void;
  getContentHeight: () => number;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export const NavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navHeight, setNavHeight] = useState(0);
  const { isMobile } = useDevice();

  // Default heights
  const defaultMobileNavHeight = 40;
  const defaultDesktopNavHeight = 60;

  useEffect(() => {
    // Set initial default height based on device
    setNavHeight(isMobile ? defaultMobileNavHeight : defaultDesktopNavHeight);
  }, [isMobile]);

  const getContentHeight = () => {
    return window.innerHeight - navHeight;
  };

  return (
    <NavContext.Provider value={{ navHeight, setNavHeight, getContentHeight }}>
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => {
  const context = useContext(NavContext);
  if (context === undefined) {
    throw new Error('useNav must be used within a NavProvider');
  }
  return context;
};
