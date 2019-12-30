import { Game } from "./Game";


export class GameCell {
    protected readonly GAMEBOARD_ROWS = 15;
    protected readonly GAMEBOARD_COLUMNS = 10;
    protected readonly GAMEBOARD_CELL_SIZE = 50;
    render(ctx: any, x: number, y: number) {
        ctx.beginPath();
        ctx.fillStyle = "red"
        ctx.fillRect(x * this.GAMEBOARD_CELL_SIZE + 2, y * this.GAMEBOARD_CELL_SIZE + 2, this.GAMEBOARD_CELL_SIZE - 2, this.GAMEBOARD_CELL_SIZE - 2);
        ctx.stroke();
    }
}

export class MovingGameCell extends GameCell {
    render(ctx: any, x: number, y: number) {
        ctx.beginPath();
        ctx.fillStyle = "blue"
        ctx.fillRect(x * this.GAMEBOARD_CELL_SIZE + 2, y * this.GAMEBOARD_CELL_SIZE + 2, this.GAMEBOARD_CELL_SIZE - 2, this.GAMEBOARD_CELL_SIZE - 2);
        ctx.stroke();
    }
}

export class BlockGameCell extends GameCell {
    render(ctx: any, x: number, y: number) {
        ctx.beginPath();
        ctx.fillStyle = "green"
        ctx.fillRect(x * this.GAMEBOARD_CELL_SIZE + 2, y * this.GAMEBOARD_CELL_SIZE + 2, this.GAMEBOARD_CELL_SIZE - 2, this.GAMEBOARD_CELL_SIZE - 2);
        ctx.stroke();
    }
}

export class RotatingMovingGameCell extends GameCell {
    render(ctx: any, x: number, y: number) {
        ctx.beginPath();
        ctx.fillStyle = "yellow"
        ctx.fillRect(x * this.GAMEBOARD_CELL_SIZE + 2, y * this.GAMEBOARD_CELL_SIZE + 2, this.GAMEBOARD_CELL_SIZE - 2, this.GAMEBOARD_CELL_SIZE - 2);
        ctx.stroke();
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
}