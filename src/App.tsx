import { CSSProperties, useState } from 'react'
import DESK_SVG from './assets/desk.svg';
import CHARACTER_GIF_PERSONAL from './assets/character.gif';
import CHARACTER_GIF_PROFESSIONAL from './assets/character_work.gif';
// import {mySketch as vermontSeasonsSketch} from './projects/vermont/VermontSeasons.tsx';
import {mySketch as vermontSketch} from './projects/seasons/Vermont.tsx';
import './App.css'
import RoyalFrame from './projects/pictureFrames/RoyalFrame.tsx';
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


// function _FullList({doodles}: {doodles: Doodle[]}) {

//   const seriesContainerStyles: CSSProperties = {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(5, 1fr)',
//     gap: '10px',
//   }

//   return (
//   <div style={seriesContainerStyles as CSSProperties}>
      
//       {/* Vermont Series */}
//       <div>
//       <h3>Vermont Series</h3>
//         {doodles.map((doodle, i) => doodle.series === "vermont" && (
//           <a key={i} href={doodle.href}>
//             <p>{doodle.title}</p>
//           </a>
//         ))}
//       </div>
    
//       {/* Seasons Series */}
//       <div>
//       <h3>Seasons Series</h3>
//       {doodles.map((doodle, i) => doodle.series === "seasons" && (
//         <a key={i}  href={doodle.href}>
//           <p>{doodle.title}</p>
//         </a>
//         ))}
//       </div>
    
//       {/* Couch Series */}
//       <div>
//       <h3>Couch Series</h3>
//       {doodles.map((doodle, i) => doodle.series === "couch" && (
//         <a key={i} href={doodle.href}>
//           <p>{doodle.title}</p>
//         </a>
//         ))}
//       </div>
    
//       {/* Rowhomes Series */}
//       <div>
//       <h3>Rowhomes Series</h3>
//       {doodles.map((doodle, i) => doodle.series === "rowhomes" && (
//         <a key={i} href={doodle.href}>
//           <p>{doodle.title}</p>
//         </a>
//         ))}
//       </div>
    
//       {/* Trees Series */}
//       <div>
//       <h3>Trees Series</h3>
//       {doodles.map((doodle, i) => doodle.series === "trees" && (
//         <a key={i} href={doodle.href}>
//           <p>{doodle.title}</p>
//         </a>
//         ))}
//       </div>
      
//       {/* Demos / Tuts */}
//       <div>
//       <h3>Demos & Tutorials</h3>
//       {doodles.map((doodle, i) => doodle.series === "demos" && (
//         <a key={i} href={doodle.href}>
//           <p>{doodle.title}</p>
//         </a>
//         ))}
//       </div>
//     </div>
//   )
// }

function App() {
  const { deviceWidth, deviceHeight, isMobile } = useDevice();
  const [isProfessionalSite, _setIsProfessionalSite] = useState(false);
  const CHARACTER_GIF = isProfessionalSite ? CHARACTER_GIF_PROFESSIONAL: CHARACTER_GIF_PERSONAL;
  const sidePadding = isMobile ? 0 : 0;
  
  const mainSketch = getMainSketch();

  function getMainSketch() {
    const randomMobileFrameSize = Math.floor(Math.random() * (20 - 80)) + 80;
    const randomFrameSize = Math.floor(Math.random() * (150 - 50)) + 50;
    const frameTopWidth = isMobile ? randomMobileFrameSize : randomFrameSize;
    const frameSideWidth = isMobile ? randomMobileFrameSize : randomFrameSize;
    const w1 = isMobile 
      ? deviceWidth - sidePadding - (frameSideWidth*2) 
      : Math.min(deviceWidth, 1280) - (frameSideWidth*2);
    const h1 = isMobile 
      ? deviceHeight - (frameTopWidth*2) 
      : 600;
    const sketch1 = vermontSketch(w1, h1);
    return { sketch: sketch1, width: w1, height: h1, frameTopWidth, frameSideWidth };
  }

  const mainContainerStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };
  const galleryContainerStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '16px',
  };

  const bioContainer: CSSProperties = {
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
  };
  const animationContainer: CSSProperties = {
    width: isMobile ? '100%' : '50%',
    height: isMobile ? '300px' : 'auto',
    position: 'relative',
  }
  const deskStyles: CSSProperties = {
    width: '100%',
    position: 'absolute',
    bottom: '0px',
    left: 0,
  }
  const characterStyles: CSSProperties = {
    width: '100%',
    position: 'absolute',
    bottom: '0px',
    left: 0,
  } 
  const bioTextStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    textAlign: 'left',
    padding: '24px 0px',
  }
  const nameStyles: CSSProperties = {
    display: 'flex',
    justifySelf: isMobile ? 'center' : 'flex-start',
    textAlign: isMobile ? 'center' : 'left',
    alignSelf: isMobile ? 'center' : 'flex-start',
  }

  return (
    <>
      <div style={mainContainerStyles}>
        {/* BIO SECTION */}
        <div style={bioContainer}>
            <div style={animationContainer}>
              <SVGObject styles={deskStyles} svgData={DESK_SVG} label="Desk"/>
              <SVGObject styles={characterStyles} svgData={CHARACTER_GIF} label="Character"/>
            </div>
            <div style={bioTextStyles}>
              <h3 style={nameStyles}>Jeffrey Fenster</h3>
              <p style={{margin: '0px', width: '100%', textAlign: isMobile ? 'center' : 'left'}}> Shalom! I am a <strong>generative artist</strong>, <strong>software engineer</strong>, and <strong>illustrator</strong>.</p>
              <p style={{margin: '0px', width: '100%', textAlign: isMobile ? 'center' : 'left'}}> I like to doodle with code. I often post the results here & on <a target="_blank" rel="noopener noreferrer" href="https://x.com/menshguy">twitter/x</a>. </p>
              {/* <p style={{margin: '0px'}}> 
                While you're here, enjoy the <a href="/seasons/vermont">seasons</a>, eat a <a href="/bagel/bagel">bagel</a>,
                or <a href="/vermont/vermontII">touch some grass</a>. I'll be chilling here on the <a href="/couch/couch">couch with my dog</a> at <a href="/rowhomes/rowhomes3">home</a>.
                </p> */}
                <a style={{margin: '0px', width: '100%', textAlign: isMobile ? 'center' : 'left'}} href="https://www.linkedin.com/in/jeff-fenster/" target="_blank">LinkedIn</a>
            </div>
          {/* <div style={{marginTop: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%'}}>
            You can also check out my other series: <SeriesOnlyList />
          </div> */}
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
      <div style={galleryContainerStyles}>
        
      </div>
    </>
  );
}

export default App;
