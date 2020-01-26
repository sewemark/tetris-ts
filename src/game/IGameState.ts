import { GameCell } from "./cells/GameCell";
import { GameCellPosition } from "./GameCellPosition";

export interface IGameState {
  getCell(cellPosition: GameCellPosition): GameCell;
}
