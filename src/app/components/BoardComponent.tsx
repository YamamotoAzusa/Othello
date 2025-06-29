import React from 'react';
import { Board } from '../../domains/board/Board';
import { Color } from '../../domains/shared/Color';
import { Position } from '../../domains/shared/Position';
import CellComponent from './CellComponent';

interface BoardProps {
  /**
   * 現在の盤面状態
   */
  board: Board;
  /**
   * セルがクリックされたときに呼び出されるコールバック関数
   */
  onCellClick: (position: Position) => void;
  /**
   * 有効な手を示すPositionオブジェクトの配列
   */
  validMoves: Position[];
}

/**
 * オセロの盤面を表示するReactコンポーネント。
 */
const BoardComponent: React.FC<BoardProps> = ({ board, onCellClick, validMoves }) => {
  const boardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 50px)',
    gridTemplateRows: 'repeat(8, 50px)',
    border: '2px solid #333',
    width: '400px', // 8 * 50px
    height: '400px', // 8 * 50px
  };

  /**
   * 指定された座標が有効な手であるかを判定する。
   * @param x X座標
   * @param y Y座標
   * @returns 有効な手であればtrue、そうでなければfalse
   */
  const isValidMove = (x: number, y: number): boolean => {
    return validMoves.some(move => move.x === x && move.y === y);
  };

  return (
    <div style={boardStyle}>
      {board.cells.map((row, x) => (
        row.map((stone, y) => (
          <CellComponent
            key={`${x}-${y}`}
            color={stone.color}
            onClick={() => onCellClick(new Position(x, y))}
            isClickable={isValidMove(x, y)}
          />
        ))
      ))}
    </div>
  );
};

export default BoardComponent;
