import { CSSProperties } from 'react'
// import DESK_SVG from './assets/desk.svg';
// import CHARACTER_GIF_PERSONAL from './assets/character.gif';
// import CHARACTER_GIF_PROFESSIONAL from './assets/character_work.gif';
// import {mySketch as vermontSeasonsSketch} from './projects/vermont/VermontSeasons.tsx';
import {mySketch as seasonalForestsSketch} from './projects/seasons/SeasonalForests.tsx';
import './App.css'
import RoyalFrame from './projects/pictureFrames/RoyalFrame.tsx';

// function SVGObject (
//   { svgData, styles, label }: 
//   { svgData: string, styles?: CSSProperties, label: string }
// ) {
//   return (
//     <img
//       style={styles}
//       id={label}
//       src={svgData}
//       aria-label={label}
//       aria-required="true"
//     />
//   )
// }

function SeriesOnlyList() {
  const series = ['vermont', 'seasons', 'couch', 'rowhomes', 'trees', 'demos']; // Hidden: crowds, pictureframes
  
  const styles: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    maxWidth: '1200px',
    marginLeft: '10px',
  }
  
  return (
    <div style={styles}>
      {series.map((series, i) => (
        <a key={i} href={`/${series}`}>{series}</a>
      ))}
    </div>
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
  // const [isProfessionalSite, _setIsProfessionalSite] = useState<boolean>(true);
  // const CHARACTER_GIF = isProfessionalSite ? CHARACTER_GIF_PROFESSIONAL: CHARACTER_GIF_PERSONAL;
  
  return (
    <div style={{
      position: 'absolute', 
      top: '0px', 
      left: '0px', 
      width: '100%', 
      height: '100%',
    }}>
      <SeriesOnlyList />
      <RoyalFrame 
        innerWidth={800} 
        innerHeight={800} 
        frameTopWidth={70}
        frameSideWidth={70}
        innerSketch={seasonalForestsSketch} 
      />
    </div>
    // {/* Main Header */}
    // {/* <div style={mainHeaderContainerStyles}>
    //   <div style={animationContainerStyles}>
    //     <div style={animationSubContainerStyles}>
    //       <SVGObject styles={deskStyles} svgData={DESK_SVG} label="Desk"/>
    //       <SVGObject styles={characterStyles} svgData={CHARACTER_GIF} label="Character"/>
    //     </div>
    //   </div>
    //   <div style={bioContainerStyles}>
    //     <p style={pBioStyles}> Shalom! I am a <strong>generative artist</strong>, <strong>software engineer</strong>, and <strong>illustator</strong>.</p>
    //     <p style={pBioStyles}> I like to doodle with code. I often post the results here & on <a target="_blank" rel="noopener noreferrer" href="https://x.com/menshguy">twitter/x</a>. </p>
    //     <div style={{marginTop: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%'}}>
    //       <p style={pBioStyles}> 
    //         While you're here, enjoy the <a href="/seasons/vermont">seasons</a>, eat a <a href="/bagel/bagel">bagel</a>,
    //         or <a href="/vermont/vermontII">touch some grass</a>. I'll be chilling here on the <a href="/couch/couch">couch with my dog</a> at <a href="/rowhomes/rowhomes3">home</a>.
    //       </p>
    //     </div>
    //     <div style={{marginTop: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%'}}>
    //       You can also check out my other series: <SeriesOnlyList />
    //     </div>
    //   </div>
    // </div> */}
    
    // {/* Main Drawing */}
    // {/* <div style={canvasContainerStyles}> */}
    //   {/* <div style={p5sketchContainerStyles}> */}
    //     {/* <p style={pStyles}>Click to redraw <span style={spanStyles}>(some drawings take a few seconds...)</span> </p> */}

    //     {/* <RoyalFrame 
    //       innerWidth={800} 
    //       innerHeight={800} 
    //       frameTopWidth={70}
    //       frameSideWidth={70}
    //       innerSketch={innersketch} 
    //     /> */}
    //     {/* <P5Wrapper sketch={seasonalForestsSketch} /> */}
    //   {/* </div> */}
    // {/* </div> */}
  )
}

// const mainHeaderContainerStyles: CSSProperties = {
//   maxWidth: '1100px',
//   margin: '20px auto',
//   display: 'flex',
//   flexDirection: 'row',
//   alignItems: 'center',
//   overflow: 'hidden',
//   padding: '24px',
//   background: '#eaf4ff',
//   borderRadius: '2%',
//   boxSizing: 'border-box',
// }
// const animationContainerStyles: CSSProperties = {
//   width: '300px',
//   position: 'relative',
//   borderRadius: '200px',
//   overflow: 'hidden',
// }
// const animationSubContainerStyles: CSSProperties = {
//   width: '100%',
//   height: '200px',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   position: 'relative',
// }
// const deskStyles: CSSProperties = {
//   width: '100%',
//   position: 'absolute',
//   top: 0,
//   left: 0,
// }
// const characterStyles: CSSProperties = {
//   width: '100%',
//   position: 'absolute',
//   top: 0,
//   left: 0,
// } 
// const bioContainerStyles: CSSProperties = {
//   height: '200px',
//   width: '100%',
//   position: 'relative',
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'center',
//   alignItems: 'flex-start',
//   textAlign: 'left',
// }

// // const canvasContainerStyles: CSSProperties = {
// //   display: 'flex',
// //   flexDirection: 'column',
// //   justifyContent: 'center',
// //   alignItems: 'center',
// //   padding: '10px',
// // }

// // const p5sketchContainerStyles: CSSProperties = {
// //   height: '500px',
// //   width: '1200px',
// //   flexDirection: 'column',
// //   position: 'relative',
// //   display: 'flex',
// //   justifyContent: 'flex-start',
// //   alignItems: 'flex-start',
// //   backgroundColor: 'antiquewhite',
// //   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
// //   padding: '0px 50px',
// //   boxSizing: 'border-box',
// // }

// // Sketch text styles
// const pStyles: CSSProperties = {
//   color: 'black',
//   fontWeight: 'bold',
//   margin: '0px 0px 10px 0px',
// }
// const pBioStyles: CSSProperties = {
//   color: 'black',
//   margin: '0px 0px 0px 0px',
// }
// const spanStyles: CSSProperties = {
//   color: '#929292',
//   fontWeight: 'lighter',
// }

export default App;
