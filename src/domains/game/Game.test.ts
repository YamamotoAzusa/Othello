import { Game } from './Game';
import { Board, Stone } from '../board/Board';
import { Player } from '../player/Player';
import { Color } from '../shared/Color';
import { GameStatus } from './GameStatus';
import { Position } from '../shared/Position';

describe('Game', () => {
  let game: Game;
  let blackPlayer: Player;
  let whitePlayer: Player;

  beforeEach(() => {
    blackPlayer = new Player(Color.BLACK, 'Black Player');
    whitePlayer = new Player(Color.WHITE, 'White Player');
    game = new Game(blackPlayer, whitePlayer);
  });

  it('should initialize the game with a new board and current player as black', () => {
    expect(game.board).toBeInstanceOf(Board);
    expect(game.currentPlayer).toEqual(blackPlayer);
    expect(game.status).toBe(GameStatus.NOT_STARTED);
  });

  it('should start the game', () => {
    game.start();
    expect(game.status).toBe(GameStatus.IN_PROGRESS);
  });

  it('should place a stone and switch player turn', () => {
    game.start();
    const initialBlackStones = game.board.cells.flat().filter(s => s.color === Color.BLACK).length;
    const initialWhiteStones = game.board.cells.flat().filter(s => s.color === Color.WHITE).length;

    // Black makes a valid move
    game.placeStone(new Position(2, 3));

    expect(game.board.cells[2][3].color).toBe(Color.BLACK);
    expect(game.currentPlayer).toEqual(whitePlayer);
    expect(game.board.cells.flat().filter(s => s.color === Color.BLACK).length).toBeGreaterThan(initialBlackStones);
    expect(game.board.cells.flat().filter(s => s.color === Color.WHITE).length).toBeLessThan(initialWhiteStones);
  });

  it('should throw error if placing stone before game starts', () => {
    expect(() => game.placeStone(new Position(2, 3))).toThrow('Game has not started');
  });

  it('should throw error if placing stone on an invalid position', () => {
    game.start();
    // (0,0) is an invalid move at the start
    expect(() => game.placeStone(new Position(0, 0))).toThrow('Invalid move');
  });

  it('should handle pass turn when no valid moves for current player', () => {
    game.start();
    // Simulate a scenario where black has no valid moves
    jest.spyOn(game.board, 'getValidMoves').mockReturnValueOnce([]);

    game.placeStone(new Position(2, 3)); // Black makes a move, then it's white's turn
    // Now it's white's turn, and white has no valid moves
    jest.spyOn(game.board, 'getValidMoves').mockReturnValueOnce([]);

    game.passTurn();
    expect(game.currentPlayer).toEqual(blackPlayer); // Turn should switch back to black
    expect(game.status).toBe(GameStatus.IN_PROGRESS); // Game should still be in progress
  });

  it('should end the game if both players pass consecutively', () => {
    game.start();
    jest.spyOn(game.board, 'getValidMoves').mockReturnValue([]); // No valid moves for anyone

    game.passTurn(); // Black passes
    game.passTurn(); // White passes

    expect(game.status).toBe(GameStatus.ENDED);
  });

  it('should end the game if board is full', () => {
    game.start();
    jest.spyOn(game.board, 'isFull').mockReturnValue(true);

    game.placeStone(new Position(2, 3)); // Any valid move

    expect(game.status).toBe(GameStatus.ENDED);
  });

  it('should determine the winner correctly when black has more stones', () => {
    game.start();
    // Manipulate board state for testing winner
    game.board.cells[0][0] = new Stone(Color.BLACK);
    game.board.cells[0][1] = new Stone(Color.BLACK);
    game.board.cells[0][2] = new Stone(Color.WHITE);

    jest.spyOn(game.board, 'getValidMoves').mockReturnValue([]);
    game.passTurn();
    game.passTurn();

    expect(game.getWinner()).toBe(blackPlayer);
  });

  it('should determine the winner correctly when white has more stones', () => {
    game.start();
    game.board.cells[0][0] = new Stone(Color.WHITE);
    game.board.cells[0][1].color = Color.WHITE;
    game.board.cells[0][2].color = Color.BLACK;

    jest.spyOn(game.board, 'getValidMoves').mockReturnValue([]);
    game.passTurn();
    game.passTurn();

    expect(game.getWinner()).toBe(whitePlayer);
  });

  it('should return null if it is a draw', () => {
    game.start();
    // Simulate a draw by filling the board with equal black and white stones
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        game.board.cells[i][j] = new Stone((i + j) % 2 === 0 ? Color.BLACK : Color.WHITE);
      }
    }

    // Manually set game status to ENDED for testing getWinner in a draw scenario
    game.status = GameStatus.ENDED;

    expect(game.getWinner()).toBeNull();
  });
});