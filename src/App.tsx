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
      flexDirection: isMobile ? 'column-reverse' : 'row-reverse',
      gap: '12px',
      padding: isMobile ? '4px' : '0px',
      position: 'relative', 
    } as CSSProperties,
    characterContainer: {
      position: 'relative',
      flex: 1,
    } as CSSProperties,
    characterSvgPlacement: {
      width: '130%', // This works because the SVG image is not properly cropped, and there is is a lot of deadspace on the left side
      position: 'absolute',
      bottom: 0,
      right: 0,
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
      <TerminalWindow />
    </div>
  );
}

const TerminalWindow = () => {
  const {isMobile} = useDevice();
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

  const terminalGreen = '#00ff00'; // Original green color
  const terminalGreenLight = '#00ff0078'; // Lighter, more vibrant green

  const floatingTerminalStyles = isMobile ? {
    width: '100%',
  } : {
    position: 'relative',
    margin: 'auto 10px',
    maxWidth: '800px',
    transform: `translate(${position.x}px, ${position.y}px)`,
    cursor: isDragging ? 'grabbing' : 'default',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
  }

  const styles = {
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
      color: terminalGreen,
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
      backgroundColor: terminalGreen,
    } as CSSProperties,
    terminalContent: {
      marginTop: '30px',
      textAlign: 'left',
      width: '100%',
    } as CSSProperties,
    nameStyles: {
      display: 'flex',
      color: terminalGreen,
      margin: '0 0 15px 0',
      fontSize: '18px',
      fontWeight: 'bold',
      '&::before': {
        content: '"> "',
        marginRight: '8px',
      },
    } as CSSProperties,
  }
  
  return (
    <div style={styles.terminalContainer}>
      {/* Terminal Window Top */}
      <div style={styles.terminalHeader} onMouseDown={handleMouseDown}>
        <div style={styles.terminalButton}></div>
        <div style={styles.terminalButtonYellow}></div>
        <div style={styles.terminalButtonGreen}></div>
      </div>

      {/* Terminal Content */}
      <div style={styles.terminalContent}>
        {/* <h3 style={styles.nameStyles}>Jeffrey Fenster</h3> */}
        <p style={{margin: '8px 0', color: terminalGreen}}>
          <span style={{color: terminalGreenLight}}>$ whoami </span>
          <br/>
          <span style={{color: '#fff'}}> Hello! My name is Jeff Fenster. I am a <strong style={{color: terminalGreen}}>Software engineer</strong>, 
          <strong style={{color: terminalGreen}}> Generative artist</strong>, <strong style={{color: terminalGreen}}>Illustrator</strong>, and a passionate <strong style={{color: terminalGreen}}>Product Leader.</strong></span>
        </p>
        <p style={{margin: '20px 0', color: terminalGreen}}>
          <span style={{color: terminalGreenLight}}>$cat about.txt</span>
          <br/>
          <span style={{color: '#fff'}}> I like to doodle with code (they sometimes call it "Creative Coding" or "Generative Art"). I also draw, build stuff for the web, code, 
            and I am passionate about all things product, UX, and AI.
            <br />
            <br />
            I often post my work and ideas on <a style={{color: terminalGreen, textDecoration: 'underline'}} target="_blank" rel="noopener noreferrer" href="https://x.com/menshguy">Twitter/X</a> and <a style={{color: terminalGreen, textDecoration: 'underline'}} target="_blank" rel="noopener noreferrer" href="https://github.com/menshguy">Github</a>.
            You can also find me on <a style={{color: terminalGreen, textDecoration: 'underline'}} href="https://www.linkedin.com/in/jeff-fenster/" target="_blank">LinkedIn</a>
          </span>
        </p>
      </div>
    </div>
  );
};

export default App;
