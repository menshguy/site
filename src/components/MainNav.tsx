// vite-project/src/components/MainNav.tsx
import React, { useState, useEffect } from 'react';
import styles from './MainNav.module.css';
import { useDevice } from '../context/DeviceContext.tsx';

interface DropdownItem {
  label: string;
  href: string;
  img?: string;
  description?: string;
}

interface DropdownProps {
  title: string;
  items: DropdownItem[];
}

function Dropdown({ title, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {isMobile} = useDevice();

  // Close dropdown when clicking outside
  useEffect(() => {
    if (isOpen) {
      const closeDropdown = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest(`.${styles.dropdown}`)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('click', closeDropdown);
      return () => document.removeEventListener('click', closeDropdown);
    }
  }, [isOpen]);

  // Prevent body scroll when mobile dropdown is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMobile, isOpen]);

  return (
    <div 
      className={styles.dropdown}
      onMouseEnter={() => !isMobile && setIsOpen(true)}
      onMouseLeave={() => !isMobile && setIsOpen(false)}
    >
      
      {/* Dropdown Button */}
      <button 
        className={styles.dropdownButton}
        onClick={() => isMobile && setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <DownCaret />
      </button>
      
      {/* Menu Content */}
      {isOpen && (
        <div className={styles.dropdownContent}>
          {items.map((item, i) => (
            <a 
              key={i} 
              href={`${item.href}`} 
              className={styles.dropdownItem}
              style={item.img ? {
                backgroundImage: isMobile ? `linear-gradient(rgba(248, 249, 250, 0.2), rgba(248, 249, 250, 0.2)), url(${item.img})` : `linear-gradient(rgba(248, 249, 250, 0.8), rgba(248, 249, 250, 0.8)), url(${item.img})`,
                color: isMobile ? 'white' : 'inherit',
                textShadow: isMobile ? '0 0 4px rgba(0,0,0,0.9)' : 'inherit',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'all 0.3s ease'
              } : undefined}
              onMouseEnter={(e) => {
                if (item.img) {
                  e.currentTarget.style.backgroundImage = `linear-gradient(rgba(248, 249, 250, 0.2), rgba(248, 249, 250, 0.2)), url(${item.img})`;
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.textShadow = '0 0 4px rgba(0,0,0,0.9)';
                }
              }}
              onMouseLeave={(e) => {
                if (item.img) {
                  e.currentTarget.style.backgroundImage = `linear-gradient(rgba(248, 249, 250, 0.8), rgba(248, 249, 250, 0.8)), url(${item.img})`;
                  e.currentTarget.style.color = 'inherit';
                  e.currentTarget.style.textShadow = '0 0 4px rgba(0,0,0,0.2)';
                }
              }}
            >
              <p className={styles.dropdownLabel}>
                <strong>{item.label}</strong>
              </p>
              {item.description && (
                <p className={styles.dropdownDescription}>
                  {item.description}
                </p>
              )}
            </a>
          ))}
        </div>
      )}

    </div>
  );
}

const DownCaret = () => (
  <svg 
  width="12" 
  height="12" 
  viewBox="0 0 24 24"
  className={styles.dropdownArrow}
  >
    <path 
      d="M7 10l5 5 5-5" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

const MainNav: React.FC = () => {
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
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <a href="/">
          <img src="/me.svg" alt="Logo" className={styles.logo} />
        </a>
        <Dropdown title="Artwork" items={dropdown1Items} />
        <Dropdown title="Projects" items={dropdown2Items} />
      </div>
    </nav>
  );
};

export default MainNav;