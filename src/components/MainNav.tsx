// vite-project/src/components/MainNav.tsx

import React, { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

const MainNav: React.FC = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/');
    };

    return (
        <nav style={styles.nav}>
          <button style={styles.button} onClick={handleButtonClick}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24px"
                height="24px"
            >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </button>
        </nav>
    );
};

const styles: { nav: CSSProperties; button: CSSProperties } = {
    nav: {
      position: 'fixed', 
      top: 0,            
      width: '100%',     
      display: 'flex',
      alignItems: 'center',
      padding: '5px',
      backgroundColor: '#f8f9fa',
      zIndex: 1000,      
    },
    button: {
      borderRadius: '10%',
      padding: '10px 15px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
    },
};

export default MainNav;