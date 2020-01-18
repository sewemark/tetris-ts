import { GameCell } from "./GameCell";
import { ICanvasRenderableElement } from "./ICanvasRenderableElement";
import { GameCellPosition } from "../GameCellPosition";

export class RotatingMovingGameCell extends GameCell implements ICanvasRenderableElement {

    protected color: string = "#24305E";

    public render(ctx: CanvasRenderingContext2D, gameCell: GameCellPosition) {
        this.drawCell(ctx, gameCell);
    }

    public canMoveLeft() {
        return true;
    }

    public canMoveRight() {
        return true;
    }

    public canMoveDown() {
        return true;
    }

    public isReplaceable() {
        return false;
    }
}