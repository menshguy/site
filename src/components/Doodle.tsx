import React from 'react'

interface DoodleProps {
  index: number;
  title: string;
  row: number;
  col: number;
  width: number;
  height: number;
  offset: number;
  href: string;
  previewSrc: string;
}

const Doodle: React.FC<DoodleProps> = ({ index:_index, title, row, col, width, height, offset, href, previewSrc }) => {
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
        color: 'darkGreen',
        gridColumn: `${col*width - 1} / span ${width}`,
        gridRow: `${row} / span ${height}`,
        top: offset * row
      } // grid-column: col-start, col-end | grid-area: row-start, col-start, row-end, col-end

  return (
    <a href={href} className='grid-item' style={styles}>
        <img className='grid-item-preview' src={previewSrc} />
        <span className='grid-item-title'>{title}</span>
    </a>
  )
}

export default Doodle