import { GameCell } from "./cells/GameCell";

export interface IMovingCellFactory {
  clone(gameCell: GameCell): GameCell;
  createNewGameCell(piece: number): GameCell;
}
