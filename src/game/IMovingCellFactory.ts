import { GameCell } from "./cells/GameCell";

export interface IMovingCellFactory {
    clone(gameCell: GameCell): GameCell;
}