import React from 'react'
import {useState} from 'react'

interface DoodleProps {
  title: string;
  row: number;
  col: number;
  width: number;
  height: number;
  offset: number;
  href: string;
  previewImgSrc: string;
  previewGifSrc: string;
}

const Doodle: React.FC<DoodleProps> = ({ 
  title, row, col, width, height, offset, href, previewImgSrc, previewGifSrc 
}) => {
  const [src, setSrc] = useState(previewImgSrc);
  const isOffset = row % 2 !== 0; // this will ensure that doodles in odd rows get offset styles
  
  const baseStyles = {
    gridRow: `${row} / span ${height}`,
    top: offset * row,
    gridColumn: `${isOffset ? col * width : col * width - 1} / span ${width}`
  }

  const colorStyles = isOffset
    ? { backgroundColor: '#3498db', color: 'blue' }
    : { backgroundColor: '#6faf10', color: 'darkGreen' }

  const styles = {...baseStyles, ...colorStyles}
  
  return (
    <a 
      href={href}
      className='grid-item'
      style={styles}
      onMouseEnter={() => setSrc(previewGifSrc)}
      onMouseLeave={() => setSrc(previewImgSrc)}
    >
        <img className='grid-item-preview' src={src} />
        <span className='grid-item-title'>{title}</span>
    </a>
  )
}

export default Doodle