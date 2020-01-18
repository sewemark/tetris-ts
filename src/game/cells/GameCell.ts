import { GameCellPosition } from "../GameCellPosition";
import { ICanvasRenderableElement } from "./ICanvasRenderableElement";

export class GameCell implements ICanvasRenderableElement {
    protected readonly GAMEBOARD_ROWS = 15;
    protected readonly GAMEBOARD_COLUMNS = 10;
    protected readonly GAMEBOARD_CELL_SIZE = 50;
    protected color: string = '#F76C6C';

    public render(ctx: CanvasRenderingContext2D, gameCell: GameCellPosition) {
        this.drawCell(ctx, gameCell);
    }

    protected drawCell(ctx: any, gameCell: GameCellPosition) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(gameCell.x * this.GAMEBOARD_CELL_SIZE + 2, gameCell.y * this.GAMEBOARD_CELL_SIZE + 2, this.GAMEBOARD_CELL_SIZE - 2, this.GAMEBOARD_CELL_SIZE - 2);
        ctx.stroke();
    }

    public canMoveLeft() {
        return false;
    }

    public canMoveRight() {
        return false;
    }

    public canMoveDown() {
        return false;
    }

    public canRote() {
        return false;
    }

    public isReplaceable() {
        return true;
    }

    public canBeRemovedInline() {
        return false;
    }
}