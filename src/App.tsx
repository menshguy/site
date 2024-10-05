import { useState, useEffect } from 'react'
import Doodle from './components/Doodle'
import './App.css'


const rawDoodles = [
  {bg: 'red'}, {bg: 'blue'}, {bg: 'green'}, 
  {bg: 'yellow'}, {bg: 'purple'}, {bg: 'orange'}, 
  {bg: 'pink'}, {bg: 'brown'}, {bg: 'gray'},
  {bg: 'beige'}
]

function App() {
  const [columns, _setColumns] = useState<number>(4) // Change this value to adjust grid
  const [doodles, setDoodles] = useState<Array<{ bg:string, row:number, col:number }>>([])
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
            row={doodle.row}
            col={doodle.col}
            index={idx}
            width={2} //in columns
            height={2} //in columns
            offset={size/2}
          />
        )}
      </div>

    </>
  )
}

export default App
