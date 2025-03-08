// vite-project/src/components/MainNav.tsx
import { useState, useEffect } from 'react';
import styles from './NavDropdown.module.css';
import { useDevice } from '../context/DeviceContext.tsx';

interface NavDropdownProps {
  title: string;
  items: NavDropdownItem[];
}

interface NavDropdownItem {
  label: string;
  href: string;
  img?: string;
  description?: string;
  hide?: boolean;
}

function NavDropdown({ title, items }: NavDropdownProps) {
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
        <div
          className={styles.dropdownContent}
          style={{top: isMobile ? '40px' : '30px'}}
        >
          {items.map((item, i) => {
            if (item.hide) return null;
            return (
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
                } : {
                  color: 'black'
                }}
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
          )})}
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

export default NavDropdown;