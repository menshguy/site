import { useState, useEffect, CSSProperties } from 'react'
import Doodle from './components/Doodle'
import './App.css'


interface Doodle {
  bg: string;
  col?: number;
  row?: number;
  href?: string;
  previewGifSrc?: string;
  previewImgSrc?: string;
  title?: string;
}

const rawDoodles: Doodle[] = [
  {bg: 'red', href: "/fallsunlight"}, {bg: 'blue', href:"/fallbreeze"}, {bg: 'green', href: "/seasonalforests"}, 
  {bg: 'yellow', href: 'tree1'}, {bg: 'purple', href: 'tree2'}, {bg: 'orange', href: 'tree3'}, 
  {bg: 'pink', href: 'tree4'}, {bg: 'brown', href: 'tree5'}, 
  // {bg: 'gray', href: 'rowhome1'}, 
  {bg: 'yellow', href: 'rowhome2'},
  {bg: 'beige', href: 'rowhome3'}, {bg: 'green', href: 'bezierdemo'}
]

function App() {
  const [columns, _setColumns] = useState<number>(3) // Change this value to adjust grid
  const [doodles, setDoodles] = useState<Doodle[]>([])
  const size = Math.floor(window.innerWidth / (columns * 2));
  const gridColumns = 7

  const baseStyles = {
    display: 'grid',
    position: 'absolute',
    top: 0,
    left: 0,
    transform: 'perspective(1000px) rotateX(30deg) rotateY(-10deg)',
    transformStyle: 'preserve-3d' as const
  }

  const gridStyles = {
    ...baseStyles,
    zIndex: 1,
    gridTemplateColumns: `repeat(${gridColumns}, ${size}px)`,
    gridTemplateRows: `repeat(${gridColumns}, ${size}px)`,
    gridAutoRows: `${size}px`,
    gridAutoColumns: `${size}px`,
  }

  const backgroundGridStyles = {
    ...baseStyles,
    zIndex: 0,
    background: 'red',
    gridTemplateColumns: `repeat(${gridColumns * 2}, ${size}px)`,
    gridTemplateRows: `repeat(${gridColumns * 2}, ${size}px)`,
    gridAutoRows: `${size}px`,
    gridAutoColumns: `${size}px`,
    top: ((gridColumns/2) * size * 2.5) * -1,
    left: ((gridColumns/2) * size * 2.5) * -1
  }

  const emptyGridItemStyles = {
    backgroundColor: 'aqua',
    gridarea: `span ${2}`
  }

  useEffect(() => {
    let currentRow = 1;
    let currentColumn = 1;
    if(!doodles.length) {
      const doodlesWithRows = rawDoodles.map( (doodle, idx) => {
        let updated = { ...doodle, row: currentRow, col: currentColumn}
        currentRow = (idx + 1) % columns === 0 ? currentRow + 1 : currentRow;
        currentColumn = currentColumn < columns ? currentColumn + 1 : 1
        return updated
      });
      setDoodles(doodlesWithRows)
    }
  }, [doodles, columns])

  console.log("doodles", doodles)

  return (
    <>
      <div style={backgroundGridStyles as CSSProperties}>
        {Array(gridColumns * 2 * gridColumns).fill({}).map((_elem, idx) =>
          <div 
            key={idx} 
            className="grid-item"
            style={emptyGridItemStyles}
            ></div>
        )}
      </div>
      <div className='grid-container' style={gridStyles as CSSProperties}>
        {doodles.length > 0 && 
          doodles.map((doodle, idx) => (
            <Doodle
              key={idx}
              title={doodle.title || `Doodle ${idx}`}
              row={doodle.row || 0}
              col={doodle.col || 0}
              width={2} // columns
              height={2} // columns
              offset={size/2}
              href={doodle.href || `/${idx}`}
              previewImgSrc={doodle.previewImgSrc || `./sample.png`} // use https://ezgif.com/split to split gif into frames, save 1st frame. Prob some API you can use to do this for many gifs if needed
              previewGifSrc={doodle.previewGifSrc || `./sample.gif`}
            />
        ))}
      </div>
    </>

  )
}

export default App
