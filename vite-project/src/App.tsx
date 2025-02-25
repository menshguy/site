import { CSSProperties, useState, useRef, useEffect } from 'react'
import DESK_SVG from './assets/desk.svg';
import CHAIR_SVG from './assets/chair.svg';
import CHAIR_ARM_SVG from './assets/chair_arm.svg';
import CHARACTER_GIF_PERSONAL from './assets/character.gif';
import CHARACTER_GIF_PROFESSIONAL from './assets/character_work.gif';
import './App.css'
import { useDevice } from './context/DeviceContext.tsx';
import { useNav } from './context/NavContext';
import { getSiteMode } from './utils/siteMode';

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
  const {navHeight} = useNav();
  const siteMode = getSiteMode();
  const CHARACTER_GIF = siteMode === 'professional' ? CHARACTER_GIF_PROFESSIONAL : CHARACTER_GIF_PERSONAL;
  const contentRef = useRef<HTMLDivElement>(null);

  const styles = {
    contentContainer: {
      height: isMobile 
        ? `calc(100dvh - ${navHeight}px)` 
        : `calc(100vh - ${navHeight}px)`,
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
    BoxPlaceholder: {
      position: 'absolute',
      // background: '#e4dce5',
      background: '#adbff5',
      height: '80%',
      width: '60%',
      bottom: '10%',
      left: '30%',
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

        {/* @TODO: Add a P5 Sketch with Rain here */}
        <div style={styles.BoxPlaceholder}></div>
        
        {/* Character Animation */}
        <SVGObject styles={styles.characterSvgPlacement} svgData={DESK_SVG} label="Desk"/>
        <SVGObject styles={styles.characterSvgPlacement} svgData={CHAIR_SVG} label="Chair"/>
        <SVGObject styles={styles.characterSvgPlacement} svgData={CHARACTER_GIF} label="Character"/>
        <SVGObject styles={styles.characterSvgPlacement} svgData={CHAIR_ARM_SVG} label="Chair"/>
      </div>

      {/* Terminal Window & Input */}
      <TerminalWindow showInput={true} />
    </div>
  );
}

const TerminalWindow = ({showInput}: {showInput: boolean}) => {
  const {isMobile} = useDevice();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const siteMode = getSiteMode();
  const terminalContentRef = useRef<HTMLInputElement>(null);
  const userInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const scrollToBottom = () => {
    if (terminalContentRef.current) {
      // terminalContentRef.current.scrollTo({
      //   top: terminalContentRef.current.scrollHeight,
      //   behavior: 'smooth'
      // });
      terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
    }
  };

  const selectUserInput = () => {
    if (userInputRef.current && showInput) {
      userInputRef.current.focus();
    }
  };

  useEffect(() => {
    selectUserInput();
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Don't submit empty messages
    if (!userInput.trim()) return;

    // Add users input to terminal immediately and reset input
    setMessages((prevMessages) => [...prevMessages, userInput]);
    setUserInput('');
    setIsLoading(true);

    const fetchResponse = async (userInput: string) => {
      try {
        // Fetch data
        const response = await fetch(`/api/bot?message=${encodeURIComponent(userInput)}`);
        const data = await response.json();
        
        // Update state
        setMessages((prevMessages) => [...prevMessages, data.message]);
        
        // Use setTimeout to ensure state updates are complete before scrolling
        setTimeout(scrollToBottom, 0);
        setTimeout(selectUserInput, 0);
      } catch (err) {
        console.error('Error fetching data:', err);
        setUserInput(userInput); // If call fails, keep original input so user can try again.
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponse(userInput);
  };

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

  const lightGray = '#323232';
  const terminalGreen = '#00ff00';
  const terminalGreenLight = '#00ff0078';

  const floatingTerminalStyles = isMobile ? {
    width: '100%',
    maxHeight: '50%',
    overflowY: 'scroll',
  } : {
    position: 'relative',
    margin: 'auto 10px',
    maxWidth: '50%',
    transform: `translate(${position.x}px, ${position.y}px)`,
    cursor: isDragging ? 'grabbing' : 'default',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
  }

  const styles = {
    terminalContainer: {
      maxHeight: '80%',
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
      ...floatingTerminalStyles
    } as CSSProperties,
    terminalHeader: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      height: '25px',
      backgroundColor: lightGray,
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
      marginTop: '10px',
      textAlign: 'left',
      width: '100%',
      overflow: 'scroll',
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
    terminalInputContainer: {
      display: 'flex',
      alignItems: 'center',
      marginRight: '4px',
      backgroundColor: lightGray,
      padding: 0,
      borderRadius: 4,
      width: '100%',
    } as CSSProperties,
    askButton: {
      backgroundColor: terminalGreenLight,
      color: '#fff',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginLeft: '8px',
    } as CSSProperties
  }

  const BioLinks = () => (
    <>
    {siteMode === 'personal' && <a style={{textDecoration: 'underline', marginRight: 8}} target="_blank" rel="noopener noreferrer" href={'https://x.com/menshguy'}>{'Twitter/X'}</a>}
    {siteMode === 'personal' && <a style={{textDecoration: 'underline', marginRight: 8}} target="_blank" rel="noopener noreferrer" href={'https://github.com/menshguy'}>{'Github'}</a>}
    <a style={{textDecoration: 'underline', marginRight: 8}} target="_blank" rel="noopener noreferrer" href={'https://linkedin.com/in/jeff-fenster/'}>{'LinkedIn'}</a>
    </>
  )

  const BioMobile = () => (
    <p style={{margin: '10px 0', color: terminalGreen}}>
      <span style={{color: '#fff'}}>
        <span>Find me on: </span>
        <BioLinks />
      </span>
    </p>
  )
  
  const BioDesktop = () => (
    <p style={{margin: '20px 0', color: terminalGreen}}>
    <span style={{color: '#fff'}}> 
      When I am not working, I like to create illustrations and artwork using code (they sometimes call it "Creative Coding" or "Generative Art"). 
      You can usually find me at my computer building stuff for the web.
      <br />
      <br />
      You can also find me on: <BioLinks />
    </span>
    </p>
  )
  
  return (
    <div style={styles.terminalContainer} >
      
      {/* Terminal Window Top */}
      <div style={styles.terminalHeader} onMouseDown={handleMouseDown}>
        <div style={styles.terminalButton}></div>
        <div style={styles.terminalButtonYellow}></div>
        <div style={styles.terminalButtonGreen}></div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalContentRef}
        style={styles.terminalContent}
        className="terminal-scrollbar"
      >
        <p style={{margin: '8px 0', color: terminalGreen}}>
          <span style={{color: terminalGreenLight}}>$ whoami </span>
          <br/>
          <span style={{color: '#fff'}}> Hello! My name is Jeff Fenster. I am a Software Engineer, Creative Coder, and a passionate Product Leader.
          </span>
        </p>

        { isMobile ? <BioMobile /> : <BioDesktop /> }

        {messages.map((message, index) => (
          <p key={`message-${index}`} style={{color: index % 2 === 0 ? terminalGreenLight : terminalGreen}}>
            {index % 2 === 0 ? `$ ${message}` : message}
          </p>
        ))}

      {/* User Input Field */}
      </div>
        {showInput && (
          <form 
            onSubmit={handleSubmit}
            style={{
              ...styles.terminalInputContainer,
              display: 'flex', alignItems: 'center', width: '100%', color: terminalGreenLight, padding: '0px 0px 0px 10px'
            }}
          >
            $ 
            <input
              ref={userInputRef}
              value={userInput}
              style={{color: terminalGreenLight}}
              disabled={isLoading}
              onChange={e => setUserInput(e.target.value)}
              className='terminalInput'
              type="text"
              placeholder={isLoading ? "💭" : "Ask me anything..."}
            />
            <button type="submit" style={styles.askButton}>Ask</button>
          </form>
      )}
    </div>
  );
};

export default App;
