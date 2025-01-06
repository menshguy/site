// vite-project/src/components/MainNav.tsx
import React, { CSSProperties } from 'react';


function SeriesOnlyList() {
  const series = [
    'home',
    'vermont', 
    'seasons', 
    // 'couch', // Nothing here yet
    'rowhomes', 
    // 'trees', // Nothing Intresting here - keep onTree for debuggin
    'demos'
  ]; // Hidden: crowds, pictureframes
  
  const styles: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    maxWidth: '1200px',
    marginLeft: '4px',
  }
  
  return (
    <div style={styles}>
      {series.map((series, i) => (
        <a key={i} href={`/${series}`}>{series}</a>
      ))}
    </div>
  )
}

const MainNav: React.FC = () => {

    return (
        <nav style={styles.nav}>
          <SeriesOnlyList />

          {/* <Link to={`/`} style={styles.button} >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24px"
                height="24px"
            >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </Link> */}
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