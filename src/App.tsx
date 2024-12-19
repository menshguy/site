import { CSSProperties } from 'react'
// import DESK_SVG from './assets/desk.svg';
// import CHARACTER_GIF_PERSONAL from './assets/character.gif';
// import CHARACTER_GIF_PROFESSIONAL from './assets/character_work.gif';
// import {mySketch as vermontSeasonsSketch} from './projects/vermont/VermontSeasons.tsx';
import {mySketch as vermontSketch} from './projects/seasons/Vermont.tsx';
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
        innerWidth={1000} 
        innerHeight={600} 
        frameTopWidth={70}
        frameSideWidth={70}
        innerSketch={vermontSketch} 
      />
    </div>
  )
}

export default App;
