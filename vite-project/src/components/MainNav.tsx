import React, { useRef } from 'react';
import styles from './MainNav.module.css';
import { useNav } from '../context/NavContext.tsx';
import NavDropdown from './NavDropdown';

const MainNav: React.FC = () => {
  const { navHeight } = useNav();
  const navRef = useRef<HTMLDivElement>(null);

  const navStyle = {
    '--nav-min-height': `${navHeight}px`,
  } as React.CSSProperties;

  const dropdown1Items = [
    {
      label: 'Vermont',
      img: '/nav/nav_vermont_sm.png',
      href: '/artwork/vermont',
      description: 'A collection of generative p5js sketches inspired by Vermont landscapes'
    }, 
    {
      label: 'Seasons', 
      img: '/nav/nav_seasons_sm.png',
      href: '/artwork/seasons',
      description: 'A collection of generative p5js sketches exploring seasonal changes'
    }, 
    {
      label: 'Royal Picture Frames (wip)', 
      img: '/nav/nav_frames_blk_sm.png',
      href: '/artwork/royalframes',
      description: 'A collection of generative p5js picture frames inspired by the elaborate picture frames used in Museums'
    }, 
    {
      label: 'All Artwork', 
      href: '/artwork',
      // description: 'View all artwork collections'
    }, 
    // '/sketches/couch',
    // '/sketches/rowhomes', 
    // '/sketches/trees',
    // '/sketches/demos'
    // '/sketches/crowds'
    // '/sketches/pictureframes'
  ];
  
  const dropdown2Items = [
    {
      label: 'Noise to Ink', 
      img: '/nav/nav_n2i_sm.png',
      href: '/projects/noise2Ink',
      description: 'A platform for generative artists to sell physical prints of their generative artwork.'
    },
    {
      label: 'Snowy Afternoon', 
      img: '/nav/nav_snowy_sm.png',
      href: '/projects/snowFrame',
      description: 'An animated picture frame I made for my wife using a raspberry pi and some acrylic sheets.'
    },
    {
      label: 'NYC Anniversary Album', 
      img: '/nav/nav_anniversary_sm.png',
      href: '/projects/anniversary',
      description: 'Another animated picture frame I made for my wife using a raspberry pi reflecting our time living in NYC.'
    },
    {
      label: 'All Projects', 
      href: '/projects',
      // description: 'View all personal projects'
    },
  ];

  return (
    <nav ref={navRef} style={navStyle} className={styles.nav}>
      <div className={styles.navContent}>
        <a href="/" className={styles.logo}>
          <img src="/me.svg" alt="Logo"  />
        </a>
        <NavDropdown title="Artwork" items={dropdown1Items} />
        <NavDropdown title="Projects" items={dropdown2Items} />
      </div>
    </nav>
  );
};

export default MainNav;