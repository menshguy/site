import { CSSProperties, useState, useRef, useEffect } from 'react'
import DESK_SVG from './assets/desk.svg';
import CHAIR_SVG from './assets/chair.svg';
import CHAIR_ARM_SVG from './assets/chair_arm.svg';
import CHARACTER_GIF_PERSONAL from './assets/character.gif';
import CHARACTER_GIF_PROFESSIONAL from './assets/character_work.gif';
import {mySketch as vermontSketch} from './artwork/seasons/Vermont.tsx';
import './App.css'
import RoyalFrame from './artwork/pictureFrames/RoyalFrame.tsx';
import { useDevice } from './context/DeviceContext.tsx';
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
  const { deviceWidth, deviceHeight, isMobile } = useDevice();
  const [isProfessionalSite, _setIsProfessionalSite] = useState(false);
  const CHARACTER_GIF = isProfessionalSite ? CHARACTER_GIF_PROFESSIONAL: CHARACTER_GIF_PERSONAL;
  const sidePadding = isMobile ? 0 : 0;
  const marginTop = isMobile ? 0 : 100;
  
  const [bioHeight, setBioHeight] = useState(0);
  const bioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bioRef.current) {
      setBioHeight(bioRef.current.offsetHeight);
    }
  }, []);
  
  const mainSketch = (() => {
    
    const randomFrameSize = isMobile
      ? (Math.floor(Math.random() * (20 - 80)) + 80)
      : (Math.floor(Math.random() * (150 - 50)) + 50);
    const frameTopWidth = randomFrameSize;
    const frameSideWidth = randomFrameSize;
    
    const width = isMobile 
      ? deviceWidth - sidePadding - (frameSideWidth*2) 
      : Math.min(deviceWidth, 1280) - (frameSideWidth*2);
    
    const height = isMobile 
      ? deviceHeight - (frameTopWidth*2) 
      : deviceHeight - (frameTopWidth*2) - marginTop - bioHeight - 50; // extra 50px for padding
    
    const sketch = vermontSketch(width, height);
    return { sketch, width, height, frameTopWidth, frameSideWidth };
  })();

  const styles = {
    mainContainerStyles: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginTop: marginTop,
    } as CSSProperties,
    bioContainer: {
      backgroundColor: '#3a3c45',
      color: 'white',
      borderRadius: '2px',
      // maxWidth: '300px',
      textAlign: 'center',
      border: "8px solid #e9c79d",
      boxShadow: "rgba(0, 0, 0, 0.2) 0px 10px 20px",
      display: 'flex',
      justifyContent: isMobile ? 'center' : 'flex-start',
      gap: '12px',
      padding: isMobile ? '4px' : '0px',
      flexDirection: isMobile ? 'column-reverse' : 'row',
    } as CSSProperties,
    animationContainer: {
      width: isMobile ? '100%' : '50%',
      height: isMobile ? '300px' : 'auto',
      position: 'relative',
    } as CSSProperties,
    characterSvgPlacement: {
      width: '100%',
      position: 'absolute',
      bottom: '0px',
      left: 0,
    } as CSSProperties,
    characterStyles: {} as CSSProperties,
    chairStyles: {} as CSSProperties,
    bioTextStyles: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      width: '100%',
      textAlign: 'left',
      padding: '24px 0px',
    } as CSSProperties,
    nameStyles: {
      display: 'flex',
      justifySelf: isMobile ? 'center' : 'flex-start',
      textAlign: isMobile ? 'center' : 'left',
      alignSelf: isMobile ? 'center' : 'flex-start',
    } as CSSProperties
  }

  return (
    <>
      <div style={styles.mainContainerStyles}>
        {/* BIO SECTION */}
        <div ref={bioRef} style={styles.bioContainer}>
            <div style={styles.animationContainer}>
              <SVGObject styles={styles.characterSvgPlacement} svgData={DESK_SVG} label="Desk"/>
              <SVGObject styles={styles.characterSvgPlacement} svgData={CHAIR_SVG} label="Chair"/>
              <SVGObject styles={styles.characterSvgPlacement} svgData={CHARACTER_GIF} label="Character"/>
              <SVGObject styles={styles.characterSvgPlacement} svgData={CHAIR_ARM_SVG} label="Chair"/>
            </div>
            <div style={styles.bioTextStyles}>
              <h3 style={styles.nameStyles}>Jeffrey Fenster</h3>
              <p style={{margin: '0px', width: '100%', textAlign: isMobile ? 'center' : 'left'}}> Shalom! I am a <strong>generative artist</strong>, <strong>software engineer</strong>, and <strong>illustrator</strong>.</p>
              <p style={{margin: '0px', width: '100%', textAlign: isMobile ? 'center' : 'left'}}> I like to doodle with code. I often post the results here & on <a target="_blank" rel="noopener noreferrer" href="https://x.com/menshguy">twitter/x</a>. </p>
                <a style={{margin: '0px', width: '100%', textAlign: isMobile ? 'center' : 'left'}} href="https://www.linkedin.com/in/jeff-fenster/" target="_blank">LinkedIn</a>
            </div>
 
        </div>

        {/* MAIN SKETCH */}
        <RoyalFrame 
          innerWidth={mainSketch.width} 
          innerHeight={mainSketch.height} 
          frameTopWidth={mainSketch.frameTopWidth}
          frameSideWidth={mainSketch.frameSideWidth}
          innerSketch={mainSketch.sketch}
          includeBoxShadow={true}
        />
      </div>
    </>
  );
}

export default App;
