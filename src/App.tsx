import { useState, useEffect } from 'react'
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
  {bg: 'red'}, {bg: 'blue'}, {bg: 'green'}, 
  {bg: 'yellow'}, {bg: 'purple'}, {bg: 'orange'}, 
  {bg: 'pink'}, {bg: 'brown'}, {bg: 'gray'},
  {bg: 'beige'}
]

function App() {
  const [columns, _setColumns] = useState<number>(4) // Change this value to adjust grid
  const [doodles, setDoodles] = useState<Doodle[]>([])
  const size = Math.floor(window.innerWidth / (columns * 2));

  const styles = {
    display: 'grid',
    gridTemplateColumns: `repeat(7, ${size}px)`,
    gridTemplateRows: `repeat(7, ${size}px)`,
    gridAutoRows: `${size}px`,
    gridAutoColumns: `${size}px`,
    /* gap: 10px; */
    transform: 'perspective(1000px) rotateX(30deg) rotateY(-10deg)',
    transformStyle: 'preserve-3d' as const
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
      <div className='grid-container' style={styles}>
        {doodles.length && doodles.map((doodle, idx) => 
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
        )}
      </div>

    </>
  )
}

export default App
