import { CSSProperties, useState, useRef, useEffect } from 'react'
import DESK_SVG from './assets/desk.svg';
import CHAIR_SVG from './assets/chair.svg';
import CHAIR_ARM_SVG from './assets/chair_arm.svg';
import CHARACTER_GIF_PERSONAL from './assets/character.gif';
import CHARACTER_GIF_PROFESSIONAL from './assets/character_work.gif';
import './App.css'
import { useDevice } from './context/DeviceContext.tsx';
import { useNav } from './context/NavContext';

function SVGObject (
  { svgData, styles, label }: 
  { svgData: string, styles?: CSSProperties, label: string }
) {
  return (
    <img
      style={styles}
      id={label}
      src={svgData}
      aria-label={label}
      aria-required="true"
    />
  )
}

function App() {
  const {isMobile} = useDevice();
  const { navHeight } = useNav();
  const [isProfessionalSite, _setIsProfessionalSite] = useState(false);
  const CHARACTER_GIF = isProfessionalSite ? CHARACTER_GIF_PROFESSIONAL: CHARACTER_GIF_PERSONAL;
  const contentRef = useRef<HTMLDivElement>(null);

  // Terminal State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isMobile) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const floatingTerminalStyles = isMobile ? {
      width: '100%',
    } : {
      position: 'relative',
      maxWidth: '800px',
      margin: '16px auto 0px',
      transform: `translate(${position.x}px, ${position.y}px)`,
      cursor: isDragging ? 'grabbing' : 'default',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    }

  const styles = {
    contentContainer: {
      height: `calc(100vh - ${navHeight}px)`,
      backgroundColor: '#3a3c45',
      color: 'white',
      borderRadius: '2px',
      textAlign: 'center',
      border: "8px solid #e9c79d",
      boxShadow: "rgba(0, 0, 0, 0.2) 0px 10px 20px",
      display: 'flex',
      justifyContent: isMobile ? 'center' : 'flex-start',
      flexDirection: isMobile ? 'column-reverse' : 'column-reverse',
      gap: '12px',
      padding: isMobile ? '4px' : '0px',
      position: 'relative', 
    } as CSSProperties,
    characterContainer: {
      position: 'relative',
      flex: 1,
    } as CSSProperties,
    characterSvgPlacement: {
      maxWidth: '100%',
      maxHeight: 800,
      position: 'absolute',
      bottom: 0,
      right: 0,

    } as CSSProperties,
    terminalContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: '24px',
      backgroundColor: 'rgba(30, 30, 30, 0.65)',
      backdropFilter: 'blur(8px)',
      borderRadius: '8px',
      fontFamily: 'Monaco, monospace',
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#00ff00',
      ...floatingTerminalStyles
    } as CSSProperties,
    terminalHeader: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      height: '25px',
      backgroundColor: '#323232',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 10px',
      gap: '6px',
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none',
    } as CSSProperties,
    terminalButton: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#ff5f56',
    } as CSSProperties,
    terminalButtonYellow: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#ffbd2e',
    } as CSSProperties,
    terminalButtonGreen: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#27c93f',
    } as CSSProperties,
    terminalContent: {
      marginTop: '30px',
      textAlign: 'left',
      width: '100%',
    } as CSSProperties,
    nameStyles: {
      display: 'flex',
      color: '#00ff00',
      margin: '0 0 15px 0',
      fontSize: '18px',
      fontWeight: 'bold',
      '&::before': {
        content: '"> "',
        marginRight: '8px',
      },
    } as CSSProperties,
  };

  return (
    <div ref={contentRef} style={styles.contentContainer}>
        <div style={styles.characterContainer}>
          <SVGObject styles={styles.characterSvgPlacement} svgData={DESK_SVG} label="Desk"/>
          <SVGObject styles={styles.characterSvgPlacement} svgData={CHAIR_SVG} label="Chair"/>
          <SVGObject styles={styles.characterSvgPlacement} svgData={CHARACTER_GIF} label="Character"/>
          <SVGObject styles={styles.characterSvgPlacement} svgData={CHAIR_ARM_SVG} label="Chair"/>
        </div>
        <div style={styles.terminalContainer}>
          <div 
            style={styles.terminalHeader}
            onMouseDown={handleMouseDown}
          >
            <div style={styles.terminalButton}></div>
            <div style={styles.terminalButtonYellow}></div>
            <div style={styles.terminalButtonGreen}></div>
          </div>
          <div style={styles.terminalContent}>
            {/* <h3 style={styles.nameStyles}>Jeffrey Fenster</h3> */}
            <p style={{margin: '8px 0', color: '#00ff00'}}>
              <span style={{color: '#00ff00'}}>$ </span>
              whoami<br/>
              <span style={{color: '#fff'}}> Hello! My name is Jeff Fenster. I am a <strong style={{color: '#00ff00'}}>software engineer</strong>, 
              <strong style={{color: '#00ff00'}}>generative artist</strong>, <strong style={{color: '#00ff00'}}>illustrator</strong>, and a passionate <strong style={{color: '#00ff00'}}>Product Leader.</strong></span>
            </p>
            <p style={{margin: '20px 0', color: '#00ff00'}}>
              <span style={{color: '#00ff00'}}>$ </span>
              cat about.txt<br/>
              <span style={{color: '#fff'}}> I like to doodle with code (they sometimes call it "Creative Coding" or "Generative Art"). I also draw, build stuff for the web, code, 
                and I am passionate about all things product, UX, and AI.
                <br />
                <br />
                I often post my work and ideas on <a style={{color: '#00ff00', textDecoration: 'underline'}} target="_blank" rel="noopener noreferrer" href="https://x.com/menshguy">twitter/x</a>.
                You can also find me on <a style={{color: '#00ff00', textDecoration: 'underline'}} href="https://www.linkedin.com/in/jeff-fenster/" target="_blank">linkedin</a>
              </span>
            </p>
          </div>
        </div>
    </div>
  );
}

export default App;
