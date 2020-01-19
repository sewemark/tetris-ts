import { NoRotatingPointFoundError } from "../errors/NoRotatingPointFoundError";
import { BlockGameCell } from "./cells/BlockGameCell";
import { GameCell } from "./cells/GameCell";
import { MovingGameCell } from "./cells/MovingGameCell";
import { RotatingMovingGameCell } from "./cells/RotatingMovingGameCell";
import { GameCellPosition } from "./GameCellPosition";

export class GameState {
  map: GameCell[][];
  private readonly GAMEBOARD_ROWS = 15;
  private readonly GAMEBOARD_COLUMNS = 10;
  private readonly GAMEBOARD_CELL_SIZE = 50;
  constructor() {
    this.map = [];
    for (let i = 0; i < this.GAMEBOARD_COLUMNS; i++) {
      this.map[i] = [];
      for (let j = 0; j < this.GAMEBOARD_ROWS; j++) {
        this.map[i][j] = new GameCell();
      }
    }
  }

  getCell(x: number, y: number): GameCell {
    return this.map[x][y];
  }

  setNewMap(map: GameCell[][]): void {
    this.map = map;
  }

  getRotatingGameCell(): GameCellPosition {
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[0].length; j++) {
        if (this.map[i][j].constructor === RotatingMovingGameCell) {
          return new GameCellPosition(i, j);
        }
      }
    }
    throw new NoRotatingPointFoundError();
  }

  clearMovingGameCells(gameBoard: any) {
    for (let i = 0; i < gameBoard.length; i++) {
      for (let j = 0; j < gameBoard[0].length; j++) {
        if (gameBoard[i][j].constructor === MovingGameCell) {
          gameBoard[i][j] = new GameCell();
        }
      }
    }
    return gameBoard;
  }

  markAllMovingCellsAsGameCells() {
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[0].length; j++) {
        if (
          this.map[i][j].constructor === MovingGameCell ||
          this.map[i][j].constructor === RotatingMovingGameCell
        ) {
          this.map[i][j] = new BlockGameCell();
        }
      }
    }
  }
}
