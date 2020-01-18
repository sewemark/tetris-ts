import { GameCell } from "./GameCell";
import { GameCellPosition } from "../GameCellPosition";
import { ICanvasRenderableElement } from "./ICanvasRenderableElement";

export class MovingGameCell extends GameCell implements ICanvasRenderableElement {
    protected color: string = '#374785';

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

    public canRote() {
        return true;
    }

    public isReplaceable() {
        return false;
    }
}