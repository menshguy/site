import React from 'react'

interface DoodleProps {
  index: number;
  row: number;
  col: number;
  width: number;
  height: number;
  offset: number;
}

const Doodle: React.FC<DoodleProps> = ({ index, row, col, width, height, offset }) => {
  const isOffset = row % 2 !== 0; // this will ensure that doodles in odd rows get offset styles
  const styles = isOffset
    ? {
        backgroundColor: '#3498db',
        color: 'blue',
        gridColumn: `${col*width} / span ${width}`,
        gridRow: `${row} / span ${height}`,
        top: offset * row
      }
    : {
        backgroundColor: '#6faf10',
        color: 'red',
        gridColumn: `${col*width - 1} / span ${width}`,
        gridRow: `${row} / span ${height}`,
        top: offset * row
      } // grid-column: col-start, col-end | grid-area: row-start, col-start, row-end, col-end

  return (
    <a href={`/${index}`} className='grid-item' style={styles}>
        Doodle {index}
    </a>
  )
}

export default Doodle