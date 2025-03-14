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
      label: 'Royal Frames (wip)', 
      img: '/nav/nav_frames_blk_sm.png',
      href: '/artwork/pictureframes/',
      description: 'A collection of generative p5js picture frames inspired by the elaborate picture frames used in Museums',
      hide: siteMode == "professional"
    }, 
    // {
    //   label: 'Scribble Frames 1 (wip)', 
    //   img: '/nav/nav_frames_scribble_sm.png',
    //   href: '/artwork/pictureframes/scribbleframe',
    //   description: 'A collection of generative p5js picture frames inspired by the elaborate picture frames used in Museums',
    //   hide: siteMode == "professional"
    // }, 
    // {
    //   label: 'Scribble Frames 2 (wip)', 
    //   img: '/nav/nav_frames_scribble2_sm.png',
    //   href: '/artwork/pictureframes/scribbleframe2',
    //   description: 'A collection of generative p5js picture frames inspired by the elaborate picture frames used in Museums',
    //   hide: siteMode == "professional"
    // }, 
    {
      label: 'Philly Rowhomes (wip)', 
      img: '/nav/nav_rowhomes_temp_sm.png',
      href: '/artwork/rowhomes/RowhomeRefactor',
      description: 'A p5js project that generates little drawings of Rowhomes, inspired by the rowhomes in Philadelphia where I live.',
      hide: siteMode == "professional"
    }, 
    {
      label: 'Trees', 
      img: '/nav/nav_trees_temp_sm.png',
      href: '/artwork/trees',
      description: 'A p5js project that generates little drawings of Trees, inspired by the trees in Philadelphia where I live.',
      hide: siteMode == "professional"
    }, 
    {
      label: 'Couch', 
      img: '/nav/nav_couch_temp_sm.png',
      href: '/artwork/couch',
      description: 'A p5js project that generates little drawings of Couches, inspired by the couches in Philadelphia where I live.',
      hide: siteMode == "professional"
    }, 
    {
      label: 'Crowds', 
      img: '/nav/nav_crowds_temp_sm.png',
      href: '/artwork/crowds',
      description: 'A p5js project that generates little drawings of Crowds, inspired by the World Cup.',
      hide: siteMode == "professional"
    }, 
    {
      label: 'All Artwork', 
      href: '/artwork',
      // description: 'View all artwork collections'
    }, 
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
      description: 'A little p5js tool that lets you create a shape and console log the code.'
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