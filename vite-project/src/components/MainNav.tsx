import React, { useRef } from 'react';
import styles from './MainNav.module.css';
import { useNav } from '../context/NavContext.tsx';
import NavDropdown from './NavDropdown';
import { getSiteMode } from '../utils/siteMode';

const MainNav: React.FC = () => {
  const { navHeight } = useNav();
  const navRef = useRef<HTMLDivElement>(null);
  const siteMode = getSiteMode();
  

  const navStyle = {
    '--nav-min-height': `${navHeight}px`,
  } as React.CSSProperties;

  const dropdownArtworkItems = [
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
      description: 'A collection of generative p5js picture frames inspired by the elaborate picture frames used in Museums',
      hide: siteMode == "professional"
    }, 
    {
      label: 'Scribble Frames 1 (wip)', 
      img: '/nav/nav_frames_scribble_sm.png',
      href: '/artwork/scribbleframes',
      description: 'A collection of generative p5js picture frames inspired by the elaborate picture frames used in Museums',
      hide: siteMode == "professional"
    }, 
    {
      label: 'Scribble Frames 2 (wip)', 
      img: '/nav/nav_frames_scribble2_sm.png',
      href: '/artwork/scribbleframes2',
      description: 'A collection of generative p5js picture frames inspired by the elaborate picture frames used in Museums',
      hide: siteMode == "professional"
    }, 
    {
      label: 'Rowhomes (wip)', 
      img: '/nav/nav_rowhomes_temp_sm.png',
      href: '/artwork/rowhomes/RowhomeRefactor',
      description: 'A collection of generative p5js picture frames inspired by the elaborate picture frames used in Museums',
      hide: siteMode == "professional"
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
  
  const dropdownProjectsItems = [
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

  const dropdownToolsItems = [
    {
      label: 'Beziers', 
      // img: '/nav/nav_n2i_sm.png',
      href: '/artwork/demos/bezierDemo',
      description: 'A little tool that lets you play around with Bezier curs to help you understand them better.'
    },
    {
      label: 'Shape Creator', 
      // img: '/nav/nav_n2i_sm.png',
      href: '/artwork/demos/shapecreator',
      description: 'A tittle p5js tool that lets you create a shape and console log the code.'
    },
  ];

  return (
    <nav ref={navRef} style={navStyle} className={styles.nav}>
      <div className={styles.navContent}>
        <a href="/" className={styles.logo}>
          <img src="/me.svg" alt="Logo"  />
        </a>
        <NavDropdown title="Artwork" items={dropdownArtworkItems} />
        <NavDropdown title="Projects" items={dropdownProjectsItems} />
        {siteMode === 'personal' && <NavDropdown title="Tools" items={dropdownToolsItems} />}
      </div>
    </nav>
  );
};

export default MainNav;