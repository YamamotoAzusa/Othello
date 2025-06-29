import { Color } from '../shared/Color';
import { Position } from '../shared/Position';

/**
 * オセロの石を表すクラス。
 */
export class Stone {
  /**
   * @param color 石の色
   */
  constructor(public color: Color) {}
}

/**
 * オセロの盤面を表すクラス。
 */
export class Board {
  cells: Stone[][];

  constructor() {
    this.cells = Array(8).fill(null).map(() => Array(8).fill(null).map(() => new Stone(Color.NONE)));
    this.initialize();
  }

  /**
   * 盤面を初期状態に設定する。
   * 中央に白石と黒石を2つずつ配置する。
   */
  private initialize(): void {
    this.cells[3][3] = new Stone(Color.WHITE);
    this.cells[3][4] = new Stone(Color.BLACK);
    this.cells[4][3] = new Stone(Color.BLACK);
    this.cells[4][4] = new Stone(Color.WHITE);
  }

  /**
   * 指定されたプレイヤーが置ける有効な手のリストを返す。
   * @param player プレイヤーの色
   * @returns 有効な手のPositionオブジェクトの配列
   */
  getValidMoves(player: Color): Position[] {
    const validMoves: Position[] = [];
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const position = new Position(x, y);
        if (this.isValidMove(position, player)) {
          validMoves.push(position);
        }
      }
    }
    return validMoves;
  }

  /**
   * 指定された位置に石を置き、挟んだ石をひっくり返す。
   * @param position 石を置く位置
   * @param player 石を置くプレイヤーの色
   * @throws Error 指定された位置が盤面の範囲外、または既に石が置かれている場合
   * @throws Error 無効な手の場合 (ひっくり返せる石がない場合)
   */
  placeStone(position: Position, player: Color): void {
    if (position.x < 0 || position.x >= 8 || position.y < 0 || position.y >= 8) {
      throw new Error('Position out of bounds');
    }
    if (this.cells[position.x][position.y].color !== Color.NONE) {
      throw new Error('Cell is not empty');
    }

    const flippableStones = this._getFlippableStones(position, player);
    if (flippableStones.length === 0) {
      throw new Error('Invalid move');
    }

    this.cells[position.x][position.y] = new Stone(player);
    this._flipStones(flippableStones, player);
  }

  /**
   * 指定された位置が有効な手であるかを判定する。
   * @param position 判定する位置
   * @param player プレイヤーの色
   * @returns 有効な手であればtrue、そうでなければfalse
   */
  private isValidMove(position: Position, player: Color): boolean {
    if (this.cells[position.x][position.y].color !== Color.NONE) {
      return false;
    }
    return this._getFlippableStones(position, player).length > 0;
  }

  /**
   * 指定された位置に石を置いた場合にひっくり返せる石のリストを返す。
   * @param position 石を置く位置
   * @param player プレイヤーの色
   * @returns ひっくり返せる石のPositionオブジェクトの配列
   */
  private _getFlippableStones(position: Position, player: Color): Position[] {
    const flippableStones: Position[] = [];
    const opponent = player === Color.BLACK ? Color.WHITE : Color.BLACK;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;

        let x = position.x + dx;
        let y = position.y + dy;
        const stonesInDirection: Position[] = [];

        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
          const currentStone = this.cells[x][y];
          if (currentStone.color === opponent) {
            stonesInDirection.push(new Position(x, y));
          } else if (currentStone.color === player) {
            flippableStones.push(...stonesInDirection);
            break;
          } else {
            break;
          }
          x += dx;
          y += dy;
        }
      }
    }
    return flippableStones;
  }

  /**
   * 指定された石のリストをプレイヤーの色にひっくり返す。
   * @param stonesToFlip ひっくり返す石のPositionオブジェクトの配列
   * @param player ひっくり返す色
   */
  private _flipStones(stonesToFlip: Position[], player: Color): void {
    for (const stonePos of stonesToFlip) {
      this.cells[stonePos.x][stonePos.y] = new Stone(player);
    }
  }

  /**
   * 現在の盤面における黒石と白石の数を返す。
   * @returns 黒石と白石の数を含むオブジェクト
   */
  getStoneCounts(): { black: number; white: number } {
    let blackStones = 0;
    let whiteStones = 0;

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const stone = this.cells[x][y];
        if (stone.color === Color.BLACK) {
          blackStones++;
        } else if (stone.color === Color.WHITE) {
          whiteStones++;
        }
      }
    }
    return { black: blackStones, white: whiteStones };
  }

  /**
   * 盤面が石で埋まっているかどうかを判定する。
   * @returns 盤面が埋まっていればtrue、そうでなければfalse
   */
  isFull(): boolean {
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.cells[x][y].color === Color.NONE) {
          return false;
        }
      }
    }
    return true;
  }
}
