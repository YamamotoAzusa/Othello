import React from 'react';
import { Player } from '../../domains/player/Player';
import { GameStatus } from '../../domains/game/GameStatus';

interface GameInfoProps {
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
}

const GameInfoComponent: React.FC<GameInfoProps> = ({ currentPlayer, status, winner }) => {
  const getStatusMessage = () => {
    switch (status) {
      case GameStatus.NOT_STARTED:
        return 'Game Not Started';
      case GameStatus.IN_PROGRESS:
        return `Current Turn: ${currentPlayer.name} (${currentPlayer.color === 0 ? 'Black' : 'White'})`;
      case GameStatus.ENDED:
        if (winner) {
          return `Winner: ${winner.name} (${winner.color === 0 ? 'Black' : 'White'})`;
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
