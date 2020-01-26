import { GAMEBOARD_COLUMNS, GAMEBOARD_ROWS } from "../common/CanvasConstats";
import { NoRotatingPointFoundError } from "../errors/NoRotatingPointFoundError";
import { BlockGameCell } from "./cells/BlockGameCell";
import { GameCell } from "./cells/GameCell";
import { RotatingMovingGameCell } from "./cells/RotatingMovingGameCell";
import { GameCellPosition } from "./GameCellPosition";
import { IGameState } from "./IGameState";

export class GameState implements IGameState {
  map: GameCell[][];

  constructor() {
    this.map = [];
    this.initBoard();
  }

  initBoard() {
    for (let i = 0; i < GAMEBOARD_COLUMNS; i++) {
      this.map[i] = [];
      for (let j = 0; j < GAMEBOARD_ROWS; j++) {
        this.map[i][j] = new GameCell();
      }
    }
  }

  getCell(cellPosition: GameCellPosition): GameCell {
    return this.map[cellPosition.x][cellPosition.y];
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

  markAllMovingCellsAsGameCells() {
    // tslint:disable-next-line: prefer-for-of
    for (let x = 0; x < this.map.length; x++) {
      for (let y = 0; y < this.map[0].length; y++) {
        if (this.map[x][y].canMoveDown()) {
          this.map[x][y] = new BlockGameCell();
        }
      }
    }
  }
}
