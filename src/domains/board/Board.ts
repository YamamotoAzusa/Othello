import { Color } from '../shared/Color';
import { Position } from '../shared/Position';

export class Stone {
  constructor(public color: Color) {}
}

export class Board {
  cells: Stone[][];

  constructor() {
    this.cells = Array(8).fill(null).map(() => Array(8).fill(null).map(() => new Stone(Color.NONE)));
    this.initialize();
  }

  private initialize(): void {
    this.cells[3][3] = new Stone(Color.WHITE);
    this.cells[3][4] = new Stone(Color.BLACK);
    this.cells[4][3] = new Stone(Color.BLACK);
    this.cells[4][4] = new Stone(Color.WHITE);
  }

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

  private isValidMove(position: Position, player: Color): boolean {
    if (this.cells[position.x][position.y].color !== Color.NONE) {
      return false;
    }
    return this._getFlippableStones(position, player).length > 0;
  }

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

  private _flipStones(stonesToFlip: Position[], player: Color): void {
    for (const stonePos of stonesToFlip) {
      this.cells[stonePos.x][stonePos.y] = new Stone(player);
    }
  }

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
