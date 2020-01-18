import { IMovingCellFactory } from "./IMovingCellFactory";
import { GameCell } from "./cells/GameCell";
import { MovingGameCell } from "./cells/MovingGameCell";
import { RotatingMovingGameCell } from "./cells/RotatingMovingGameCell";

export class MovingCellFactory implements IMovingCellFactory{
    public clone(gameCell: GameCell): GameCell {
        switch(gameCell.constructor) {
            case MovingGameCell:
                return new MovingGameCell();
            case RotatingMovingGameCell:
                return new RotatingMovingGameCell();
            default:
                return new GameCell();
        }
    }
}
