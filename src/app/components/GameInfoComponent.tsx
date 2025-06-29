import React from 'react';
import { Player } from '../../domains/player/Player';
import { GameStatus } from '../../domains/game/GameStatus';
import { Color } from '../../domains/shared/Color';

interface GameInfoProps {
  /**
   * 現在のターンプレイヤー
   */
  currentPlayer: Player;
  /**
   * 現在のゲームステータス
   */
  status: GameStatus;
  /**
   * 勝者プレイヤー (ゲーム終了時のみ、引き分けの場合はnull)
   */
  winner: Player | null;
}

/**
 * ゲームの情報を表示するReactコンポーネント。
 * 現在のターンプレイヤー、ゲームステータス、勝者などを表示する。
 */
const GameInfoComponent: React.FC<GameInfoProps> = ({ currentPlayer, status, winner }) => {
  /**
   * 現在のゲームステータスに基づいて表示メッセージを生成する。
   * @returns 表示するステータスメッセージ
   */
  const getStatusMessage = () => {
    switch (status) {
      case GameStatus.NOT_STARTED:
        return 'Game Not Started';
      case GameStatus.IN_PROGRESS:
        return `Current Turn: ${currentPlayer.name} (${currentPlayer.color === Color.BLACK ? 'Black' : 'White'})`;
      case GameStatus.ENDED:
        if (winner) {
          return `Winner: ${winner.name} (${winner.color === Color.BLACK ? 'Black' : 'White'})`;
        } else {
          return 'Game Ended: Draw';
        }
      default:
        return '';
    }
  };

  return (
    <div style={{ marginBottom: '20px', fontSize: '1.2em' }}>
      <p>{getStatusMessage()}</p>
    </div>
  );
};

export default GameInfoComponent;
