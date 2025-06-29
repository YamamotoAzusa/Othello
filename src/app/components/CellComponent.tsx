import React from 'react';
import { Color } from '../../domains/shared/Color';

interface CellProps {
  /**
   * セルに置かれている石の色
   */
  color: Color;
  /**
   * セルがクリックされたときに呼び出されるコールバック関数
   */
  onClick: () => void;
  /**
   * セルがクリック可能かどうか
   */
  isClickable: boolean;
}

/**
 * オセロの盤面の一つのセルを表示するReactコンポーネント。
 */
const CellComponent: React.FC<CellProps> = ({ color, onClick, isClickable }) => {
  const cellStyle: React.CSSProperties = {
    width: '50px',
    height: '50px',
    border: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006400', // 盤面の色 (濃い緑)
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
