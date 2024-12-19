import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface DeviceContextProps {
  deviceWidth: number;
  deviceHeight: number;
  isMobile: boolean;
}

const DeviceContext = createContext<DeviceContextProps | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceContextProps>({
    deviceWidth: window.innerWidth,
    deviceHeight: window.innerHeight,
    isMobile: window.innerWidth <= 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo({
        deviceWidth: window.innerWidth,
        deviceHeight: window.innerHeight,
        isMobile: window.innerWidth <= 768,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <DeviceContext.Provider value={deviceInfo}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};