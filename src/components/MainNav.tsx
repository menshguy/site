// vite-project/src/components/MainNav.tsx
import React, { useState } from 'react';
import styles from './MainNav.module.css';

interface DropdownProps {
  title: string;
  items: {label: string, href: string}[];
}

function Dropdown({ title, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={styles.dropdown}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className={styles.dropdownButton}>
      <span>{title}</span>
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
    </button>
      {isOpen && (
        <div className={styles.dropdownContent}>
          {items.map((item, i) => (
            <a key={i} href={`${item.href}`} className={styles.dropdownItem}>
              {item.label}
            </a>
          ))}
        </div>
      )}

    </div>
  );
}

const MainNav: React.FC = () => {
  const dropdown1Items = [
    {label: 'All Artwork', href: '/artwork'}, 
    {label: 'Vermont', href: '/artwork/vermont'}, 
    {label: 'Seasons', href: '/artwork/seasons'}, 
    // '/sketches/couch',
    // '/sketches/rowhomes', 
    // '/sketches/trees',
    // '/sketches/demos'
    // '/sketches/crowds'
    // '/sketches/pictureframes'
  ];

  const dropdown2Items = [
    {label: 'All Projects', href: '/projects'},
    {label: 'Noise2Ink', href: '/projects/noise2Ink'},
    // 'LLMs', 
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