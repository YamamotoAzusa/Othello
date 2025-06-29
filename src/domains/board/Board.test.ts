import { Board, Stone } from './Board';
import { Color } from '../shared/Color';
import { Position } from '../shared/Position';

describe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  it('should be initialized with 8x8 cells', () => {
    expect(board.cells.length).toBe(8);
    expect(board.cells[0].length).toBe(8);
  });

  it('should have initial stones at the center', () => {
    // Initial state: two white, two black stones in the center
    // W B
    // B W
    expect(board.cells[3][3].color).toBe(Color.WHITE);
    expect(board.cells[3][4].color).toBe(Color.BLACK);
    expect(board.cells[4][3].color).toBe(Color.BLACK);
    expect(board.cells[4][4].color).toBe(Color.WHITE);
  });

  it('should have empty cells elsewhere', () => {
    // Check a few corners and edges to ensure they are empty
    expect(board.cells[0][0].color).toBe(Color.NONE);
    expect(board.cells[7][7].color).toBe(Color.NONE);
    expect(board.cells[0][7].color).toBe(Color.NONE);
    expect(board.cells[7][0].color).toBe(Color.NONE);
    expect(board.cells[3][2].color).toBe(Color.NONE);
  });

  describe('getValidMoves', () => {
    it('should return valid moves for black at the start of the game', () => {
      const validMoves = board.getValidMoves(Color.BLACK);
      expect(validMoves.length).toBe(4);
      expect(validMoves).toContainEqual(new Position(2, 3));
      expect(validMoves).toContainEqual(new Position(3, 2));
      expect(validMoves).toContainEqual(new Position(4, 5));
      expect(validMoves).toContainEqual(new Position(5, 4));
    });

    it('should return valid moves for white at the start of the game', () => {
      const validMoves = board.getValidMoves(Color.WHITE);
      expect(validMoves.length).toBe(4);
      expect(validMoves).toContainEqual(new Position(2, 4));
      expect(validMoves).toContainEqual(new Position(3, 5));
      expect(validMoves).toContainEqual(new Position(4, 2));
      expect(validMoves).toContainEqual(new Position(5, 3));
    });

    it('should return an empty array if no valid moves exist', () => {
      // Create a board with no valid moves (e.g., full board or no flippable stones)
      const emptyBoard = new Board();
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          emptyBoard.cells[i][j] = new Stone(Color.BLACK);
        }
      }
      expect(emptyBoard.getValidMoves(Color.WHITE)).toEqual([]);
    });
  });

  describe('placeStone', () => {
    it('should place a stone and flip opponent\'s stones', () => {
      // Initial: W B
      //          B W
      // Place black at (2,3) to flip (3,3) white stone
      board.placeStone(new Position(2, 3), Color.BLACK);

      expect(board.cells[2][3].color).toBe(Color.BLACK);
      expect(board.cells[3][3].color).toBe(Color.BLACK);
      expect(board.cells[3][4].color).toBe(Color.BLACK);
      expect(board.cells[4][3].color).toBe(Color.BLACK);
      expect(board.cells[4][4].color).toBe(Color.WHITE);
    });

    it('should throw error if position is out of bounds', () => {
      expect(() => board.placeStone(new Position(-1, 0), Color.BLACK)).toThrow('Position out of bounds');
      expect(() => board.placeStone(new Position(8, 0), Color.BLACK)).toThrow('Position out of bounds');
      expect(() => board.placeStone(new Position(0, -1), Color.BLACK)).toThrow('Position out of bounds');
      expect(() => board.placeStone(new Position(0, 8), Color.BLACK)).toThrow('Position out of bounds');
    });

    it('should throw error if cell is not empty', () => {
      expect(() => board.placeStone(new Position(3, 3), Color.BLACK)).toThrow('Cell is not empty');
    });

    it('should throw error if move is not valid', () => {
      expect(() => board.placeStone(new Position(0, 0), Color.BLACK)).toThrow('Invalid move');
    });
  });
});