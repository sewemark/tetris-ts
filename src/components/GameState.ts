import { NoRotatingPointFoundError } from "../errors/NoRotatingPointFoundError";
import { Color } from "csstype";

export interface IMovingCellFactory {
    clone(gameCell: GameCell): GameCell;
}
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
export class GameCell {

    protected readonly GAMEBOARD_ROWS = 15;
    protected readonly GAMEBOARD_COLUMNS = 10;
    protected readonly GAMEBOARD_CELL_SIZE = 50;

    public render(ctx: any, x: number, y: number) {
        this.drawCell(ctx, x, y, 'red');
    }

    protected drawCell(ctx: any, x: number, y: number, color: string | Color) {
        ctx.beginPath();
        ctx.fillStyle = color
        ctx.fillRect(x * this.GAMEBOARD_CELL_SIZE + 2, y * this.GAMEBOARD_CELL_SIZE + 2, this.GAMEBOARD_CELL_SIZE - 2, this.GAMEBOARD_CELL_SIZE - 2);
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
}

export class MovingGameCell extends GameCell {
    render(ctx: any, x: number, y: number) {
        this.drawCell(ctx, x, y, 'blue');
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

export class BlockGameCell extends GameCell {
    render(ctx: any, x: number, y: number) {
        this.drawCell(ctx, x, y, 'green');
    }

    public isReplaceable() {
        return false;
    }
}

export class RotatingMovingGameCell extends GameCell {
    render(ctx: any, x: number, y: number) {
        this.drawCell(ctx, x, y, 'yellow');
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

export class GameCellPosition {
    constructor(
        public x: number,
        public y: number,
    ) {
        this.x = x;
        this.y = y;
    }
}

export class GameState {
    private readonly GAMEBOARD_ROWS = 15;
    private readonly GAMEBOARD_COLUMNS = 10;
    private readonly GAMEBOARD_CELL_SIZE = 50;
    public map: GameCell[][];
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
                if (this.map[i][j].constructor === MovingGameCell || this.map[i][j].constructor === RotatingMovingGameCell) {
                    this.map[i][j] = new BlockGameCell();
                }
            }
        }
    }
}