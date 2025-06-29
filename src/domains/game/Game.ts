import { Board } from '../board/Board';
import { Player } from '../player/Player';
import { Color } from '../shared/Color';
import { GameStatus } from './GameStatus';
import { Position } from '../shared/Position';

export class Game {
  board: Board;
  currentPlayer: Player;
  blackPlayer: Player;
  whitePlayer: Player;
  status: GameStatus;
  private consecutivePasses: number;

  constructor(blackPlayer: Player, whitePlayer: Player) {
    this.board = new Board();
    this.blackPlayer = blackPlayer;
    this.whitePlayer = whitePlayer;
    this.currentPlayer = blackPlayer; // Black always starts
    this.status = GameStatus.NOT_STARTED;
    this.consecutivePasses = 0;
  }

  start(): void {
    this.status = GameStatus.IN_PROGRESS;
    this.consecutivePasses = 0;
  }

  placeStone(position: Position): void {
    if (this.status !== GameStatus.IN_PROGRESS) {
      throw new Error('Game has not started');
    }

    this.board.placeStone(position, this.currentPlayer.color);
    this.consecutivePasses = 0; // Reset consecutive passes after a valid move
    this.switchPlayer();
    this.checkGameEnd();
  }

  passTurn(): void {
    if (this.status !== GameStatus.IN_PROGRESS) {
      throw new Error('Game has not started');
    }

    this.consecutivePasses++;
    this.switchPlayer();
    this.checkGameEnd();
  }

  private switchPlayer(): void {
    this.currentPlayer = this.currentPlayer.equals(this.blackPlayer)
      ? this.whitePlayer
      : this.blackPlayer;
  }

  private checkGameEnd(): void {
    if (this.board.isFull() || this.consecutivePasses >= 2) {
      this.status = GameStatus.ENDED;
    }
  }

  getWinner(): Player | null {
    if (this.status !== GameStatus.ENDED) {
      return null; // Game not ended yet
    }

    const { black: blackStones, white: whiteStones } = this.board.getStoneCounts();

    if (blackStones > whiteStones) {
      return this.blackPlayer;
    } else if (whiteStones > blackStones) {
      return this.whitePlayer;
    } else {
      return null; // Draw
    }
  }
}
