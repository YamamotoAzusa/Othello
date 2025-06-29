import { Board } from '../board/Board';
import { Player } from '../player/Player';
import { Color } from '../shared/Color';
import { GameStatus } from './GameStatus';
import { Position } from '../shared/Position';

/**
 * オセロゲームのロジックを管理するクラス。
 */
export class Game {
  board: Board;
  currentPlayer: Player;
  blackPlayer: Player;
  whitePlayer: Player;
  status: GameStatus;
  private consecutivePasses: number;

  /**
   * Gameクラスの新しいインスタンスを初期化する。
   * @param blackPlayer 黒石のプレイヤー
   * @param whitePlayer 白石のプレイヤー
   */
  constructor(blackPlayer: Player, whitePlayer: Player) {
    this.board = new Board();
    this.blackPlayer = blackPlayer;
    this.whitePlayer = whitePlayer;
    this.currentPlayer = blackPlayer; // 黒が常に先行
    this.status = GameStatus.NOT_STARTED;
    this.consecutivePasses = 0;
  }

  /**
   * ゲームを開始する。
   */
  start(): void {
    this.status = GameStatus.IN_PROGRESS;
    this.consecutivePasses = 0;
  }

  /**
   * 指定された位置に石を置く。
   * @param position 石を置く位置
   * @throws Error ゲームが開始されていない場合
   */
  placeStone(position: Position): void {
    if (this.status !== GameStatus.IN_PROGRESS) {
      throw new Error('Game has not started');
    }

    this.board.placeStone(position, this.currentPlayer.color);
    this.consecutivePasses = 0; // 有効な手があった場合、連続パスをリセット
    this.switchPlayer();
    this.checkGameEnd();
  }

  /**
   * ターンをパスする。
   * @throws Error ゲームが開始されていない場合
   */
  passTurn(): void {
    if (this.status !== GameStatus.IN_PROGRESS) {
      throw new Error('Game has not started');
    }

    this.consecutivePasses++;
    this.switchPlayer();
    this.checkGameEnd();
  }

  /**
   * 現在のプレイヤーを切り替える。
   */
  private switchPlayer(): void {
    this.currentPlayer = this.currentPlayer.equals(this.blackPlayer)
      ? this.whitePlayer
      : this.blackPlayer;
  }

  /**
   * ゲーム終了条件をチェックし、必要であればゲームの状態を更新する。
   * 盤面が埋まった場合、または2回連続でパスがあった場合にゲームは終了する。
   */
  private checkGameEnd(): void {
    if (this.board.isFull() || this.consecutivePasses >= 2) {
      this.status = GameStatus.ENDED;
    }
  }

  /**
   * ゲームの勝者を返す。
   * @returns 勝者のPlayerオブジェクト、引き分けの場合はnull
   */
  getWinner(): Player | null {
    if (this.status !== GameStatus.ENDED) {
      return null; // ゲームがまだ終了していない
    }

    const { black: blackStones, white: whiteStones } = this.board.getStoneCounts();

    if (blackStones > whiteStones) {
      return this.blackPlayer;
    } else if (whiteStones > blackStones) {
      return this.whitePlayer;
    } else {
      return null; // 引き分け
    }
  }
}
