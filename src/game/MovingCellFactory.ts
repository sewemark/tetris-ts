import { GameCell } from "./cells/GameCell";
import { MovingGameCell } from "./cells/MovingGameCell";
import { RotatingMovingGameCell } from "./cells/RotatingMovingGameCell";
import { IMovingCellFactory } from "./IMovingCellFactory";

export class MovingCellFactory implements IMovingCellFactory {
  clone(gameCell: GameCell): GameCell {
    switch (gameCell.constructor) {
      case MovingGameCell:
        return new MovingGameCell();
      case RotatingMovingGameCell:
        return new RotatingMovingGameCell();
      default:
        return new GameCell();
    }
  }

  createNewGameCell(piece: number): GameCell {
    switch (piece) {
      case 0:
        return new GameCell();
      case 2:
        return new RotatingMovingGameCell();
      default:
        return new MovingGameCell();
    }
  }
}
