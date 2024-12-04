import { useState, CSSProperties } from 'react'
import DESK_SVG from './assets/desk.svg';
import CHARACTER_GIF_PERSONAL from './assets/character.gif';
import CHARACTER_GIF_PROFESSIONAL from './assets/character_work.gif';
import P5Wrapper from './components/P5Wrapper.tsx';
import {mySketch as vermontSeasonsSketch} from './projects/vermont/VermontSeasons.tsx';
import './App.css'

interface Doodle {
  series: string;
  title: string;
  href: string;
  previewGifSrc?: string;
  previewImgSrc?: string;
}

const doodleConfigs: Doodle[] = [
  {series: "vermont", title:"vermont ii", href: "/vermont/vermontii"}, 
  {series: "vermont", title:"vermont iii", href: "/vermont/vermontiii"}, 
  {series: "vermont", title:"vermont iii Animated", href: "/vermont/vermontiiia"}, 
  {series: "vermont", title:"vermont random", href: "/vermont/vermontiiiwildcard"}, 
  {series: "vermont", title:"vermont iiii", href: "/vermont/vermontiiii"}, 
  {series: "vermont", title:"vermont seasons", href: "/vermont/vermontseasons"}, 
  
  {series: "seasons", title:"fall in vermont", href: "/seasons/vermont"}, 
  {series: "seasons", title:"fall Sunlight", href: "/seasons/fallsunlight"}, 
  {series: "seasons", title:"fall Breeze", href:"/seasons/fallbreeze"}, 
  {series: "seasons", title:"seasonal Forests", href: "/seasons/seasonalforests"}, 
  
  {series: "couch", title:"Couch", href: "/couch/couch"}, 
  
  {series: "trees", title:"oneTree", href: "/trees/onetree"}, 
  {series: "trees", title:"tree 1", href: '/trees/tree1'}, 
  {series: "trees", title:"tree 2", href: '/trees/tree2'}, 
  {series: "trees", title:"tree 3", href: '/trees/tree3'}, 
  {series: "trees", title:"tree 4", href: '/trees/tree4'}, 
  {series: "trees", title:"tree 5", href: '/trees/tree5'}, 
  
  // {series: "rowhomes", title:, href: 'rowhome1'}, 
  {series: "rowhomes", title:"Rowhomes", href: '/rowhomes/rowhome2'},
  {series: "rowhomes", title:"Rowhomes and Trees", href: '/rowhomes/rowhome3'}, 
  
  {series: "demos", title:"Bezier demo", href: '/rowhomes/bezierdemo'}
]

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
  const [doodles, _setDoodles] = useState<Doodle[]>(doodleConfigs);
  const [isProfessionalSite, _setIsProfessionalSite] = useState<boolean>(true);
  const CHARACTER_GIF = isProfessionalSite ? CHARACTER_GIF_PROFESSIONAL: CHARACTER_GIF_PERSONAL;

  const mainHeaderContainerStyles: CSSProperties = {
    maxWidth: '1200px',
    margin: '20px auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  }
  const animationContainerStyles: CSSProperties = {
    width: '300px',
    position: 'relative',
    borderRadius: '200px',
    overflow: 'hidden',
  }
  const animationSubContainerStyles: CSSProperties = {
    width: '100%',
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  }
  const deskStyles: CSSProperties = {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  }
  const characterStyles: CSSProperties = {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  } 
  const bioContainerStyles: CSSProperties = {
    height: '200px',
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  }

  const canvasContainerStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
  }
  
  const p5sketchContainerStyles: CSSProperties = {
    height: '500px',
    maxWidth: '1200px',
    width: '1200px',
    flexDirection: 'column',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'antiquewhite',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    padding: '0px 50px',
    boxSizing: 'border-box',
  }

  // Sketch text styles
  const pStyles: CSSProperties = {
    color: 'black',
    fontWeight: 'bold',
    margin: '0px 0px 10px 0px',
  };
  
  const pBioStyles: CSSProperties = {
    color: 'black',
    margin: '0px 0px 0px 0px',
  };

  const spanStyles: CSSProperties = {
    color: '#929292',
    fontWeight: 'lighter',
  };

  const seriesContainerStyles: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '10px',
  }

  return (
    <div>

    {/* Main Header */}
    <div style={mainHeaderContainerStyles}>
      {/* Character at desk */}
      <div style={animationContainerStyles}>
        <div style={animationSubContainerStyles}>
          <SVGObject styles={deskStyles} svgData={DESK_SVG} label="Desk"/>
          <SVGObject styles={characterStyles} svgData={CHARACTER_GIF} label="Character"/>
        </div>
      </div>
      <div style={bioContainerStyles}>
        <p style={pBioStyles}> Shalom! I am a <strong>generative artist</strong>, <strong>software engineer</strong>, and <strong>illustator</strong>.</p>
        <p style={pBioStyles}> I like to doodle with code. I often post the results here & on <a href="https://x.com/menshguy">twitter/x</a>. </p>
        <p style={pBioStyles}> 
          While you're here, enjoy the <a href="/seasons/vermont">seasons</a>, eat a <a href="/bagel/bagel">bagel</a>,
           or <a href="/vermont/vermontII">touch some grass</a>. I'll be chilling here on the <a href="/couch/couch">couch with my dog</a> at <a href="/rowhomes/rowhomes3">home</a>.
        </p>
      </div>
    </div>
    
    {/* Main Drawing */}
    <div style={canvasContainerStyles}>
      <div style={p5sketchContainerStyles}>
        <p style={pStyles}>Click to redraw <span style={spanStyles}>(some drawings take a few seconds...)</span> </p>
        <P5Wrapper sketch={vermontSeasonsSketch} />
      </div>
    </div>
    
    <div style={seriesContainerStyles as CSSProperties}>
      
      {/* Vermont Series */}
      <div>
      <h3>Vermont Series</h3>
        {doodles.map((doodle, i) => doodle.series === "vermont" && (
          <a key={i} href={doodle.href}>
            <p>{doodle.title}</p>
          </a>
        ))}
      </div>
    
      {/* Seasons Series */}
      <div>
      <h3>Seasons Series</h3>
      {doodles.map((doodle, i) => doodle.series === "seasons" && (
        <a key={i}  href={doodle.href}>
          <p>{doodle.title}</p>
        </a>
        ))}
      </div>
    
      {/* Couch Series */}
      <div>
      <h3>Couch Series</h3>
      {doodles.map((doodle, i) => doodle.series === "couch" && (
        <a key={i} href={doodle.href}>
          <p>{doodle.title}</p>
        </a>
        ))}
      </div>
    
      {/* Rowhomes Series */}
      <div>
      <h3>Rowhomes Series</h3>
      {doodles.map((doodle, i) => doodle.series === "rowhomes" && (
        <a key={i} href={doodle.href}>
          <p>{doodle.title}</p>
        </a>
        ))}
      </div>
    
      {/* Trees Series */}
      <div>
      <h3>Trees Series</h3>
      {doodles.map((doodle, i) => doodle.series === "trees" && (
        <a key={i} href={doodle.href}>
          <p>{doodle.title}</p>
        </a>
        ))}
      </div>
      
      {/* Demos / Tuts */}
      <div>
      <h3>Demos & Tutorials</h3>
      {doodles.map((doodle, i) => doodle.series === "demos" && (
        <a key={i} href={doodle.href}>
          <p>{doodle.title}</p>
        </a>
        ))}
      </div>
    </div>
    </div>
  )
}

export default App;
