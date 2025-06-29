import React from 'react';
import { Color } from '../../domains/shared/Color';

interface CellProps {
  color: Color;
  onClick: () => void;
  isClickable: boolean;
}

const CellComponent: React.FC<CellProps> = ({ color, onClick, isClickable }) => {
  const cellStyle: React.CSSProperties = {
    width: '50px',
    height: '50px',
    border: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006400', // Dark green for the board
    cursor: isClickable ? 'pointer' : 'default',
  };

  const stoneStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: color === Color.BLACK ? 'black' : color === Color.WHITE ? 'white' : 'transparent',
  };

  return (
    <div style={cellStyle} onClick={isClickable ? onClick : undefined}>
      {color !== Color.NONE && <div style={stoneStyle}></div>}
    </div>
  );
};

export default CellComponent;
