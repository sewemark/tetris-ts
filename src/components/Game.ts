import { GameState, MovingGameCell, GameCell, BlockGameCell, RotatingMovingGameCell } from "./GameState";
import { SHAPES } from "../game/pieceDefinition/pieceDefinition";
import cloneDeep from 'lodash.clonedeep';
import { EventEmitter } from "events";
export const GAME_STATE = {
    LOOSE: 'loose',
    NEW_GAME: 'newGame',
}
export class Game extends EventEmitter {

    public readonly GAMEBOARD_ROWS = 15;
    public readonly GAMEBOARD_COLUMNS = 10;
    public readonly GAMEBOARD_CELL_SIZE = 50;
    public gameState: GameState;
    private state: string;
    constructor() {
        super();
        this.gameState = new GameState();
        this.state = GAME_STATE.NEW_GAME;
    }

    public movePiece(direction: number) {
        if (direction === 37) {
            this.moveLeft();
        } else if (direction === 39) {
            this.moveRight();
        }
        else if (direction === 38) {
            this.rotate();
        } else if (direction === 40) {
            this.down();
        }
    }

    public insertNewPiece() {
        const randomIndex = Math.floor(Math.random() * (4 - 0 + 1) + 0);
        const piece = SHAPES[randomIndex];
        const mapWithAddedPiece = this.gameState.map;
        const middle = Math.floor(mapWithAddedPiece.length / 2);
        let wasCollision = false;
        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[0].length; j++) {
                if (mapWithAddedPiece[middle + i][j].constructor != GameCell) {
                    wasCollision = true;
                }
                if (piece[i][j] != 0) {
                    if (piece[i][j] === 2) {
                        mapWithAddedPiece[middle + i][j] = new RotatingMovingGameCell();
                    } else {
                        mapWithAddedPiece[middle + i][j] = new MovingGameCell();

                    }
                }
            }
        }
        if (!wasCollision) {
            this.gameState.setNewMap(mapWithAddedPiece);
        } else {
            this.gameState.setNewMap(mapWithAddedPiece);
            console.log('Was collision!!!!!!!');
            this.state = GAME_STATE.LOOSE;
            this.emit('GameLoose');
        }
    }

    public animate() {
        let wasMoved = false;
        let wasCollistion = false;
        const mapWithAddedPiece = cloneDeep(this.gameState.map);
        for (let j = mapWithAddedPiece[0].length - 1; j >= 0; j--) {
            for (let i = mapWithAddedPiece.length - 1; i >= 0; i--) {
                if (mapWithAddedPiece[i][j].constructor === MovingGameCell || mapWithAddedPiece[i][j].constructor === RotatingMovingGameCell) {
                    if (j + 1 < mapWithAddedPiece[0].length) {
                        if (mapWithAddedPiece[i][j + 1].constructor === GameCell) {
                            wasMoved = true;
                            if (mapWithAddedPiece[i][j].constructor === MovingGameCell) {
                                mapWithAddedPiece[i][j + 1] = new MovingGameCell();
                            } else if (mapWithAddedPiece[i][j].constructor === RotatingMovingGameCell) {
                                mapWithAddedPiece[i][j + 1] = new RotatingMovingGameCell();
                            }
                            mapWithAddedPiece[i][j] = new GameCell();
                        } else {
                            wasCollistion = true;
                        }
                    }
                }
            }
        }
        if (wasCollistion) {
            wasMoved = false;
        }


        if (wasMoved === false) {
            this.markAllMovingCellsAsGameCells();
            this.insertNewPiece();
        } else {
            this.gameState.setNewMap(mapWithAddedPiece);
        }
        this.checkIfLinesToRemove();
    }

    public checkIfLinesToRemove() {
        let mapWithAddedPiece = cloneDeep(this.gameState.map);
        for (let j = 0; j < mapWithAddedPiece[0].length; j++) {
            let toRemove = true;
            for (let i = 0; i < mapWithAddedPiece.length; i++) {
                if (mapWithAddedPiece[i][j].constructor !== BlockGameCell) {
                    toRemove = false;
                }
            }
            if (toRemove) {
                for (let x = 0; x < mapWithAddedPiece.length; x++) {
                    console.log(mapWithAddedPiece.length);
                    mapWithAddedPiece[x].splice(j, 1)
                    mapWithAddedPiece[x] = [new GameCell()].concat(mapWithAddedPiece[x]);
                }
            }
        }
        this.gameState.setNewMap(mapWithAddedPiece);
    }

    public down() {
        const mapWithAddedPiece = cloneDeep(this.gameState.map);
        let wasCollistion = true;
        for (let j = mapWithAddedPiece[0].length - 1; j >= 0; j--) {
            for (let i = mapWithAddedPiece.length - 1; i >= 0; i--) {
                if (mapWithAddedPiece[i][j].constructor === MovingGameCell || mapWithAddedPiece[i][j].constructor === RotatingMovingGameCell) {
                    if (j + 1 < mapWithAddedPiece[0].length) {
                        if (mapWithAddedPiece[i][j + 1].constructor === GameCell) {
                            if (mapWithAddedPiece[i][j].constructor === MovingGameCell) {
                                mapWithAddedPiece[i][j + 1] = new MovingGameCell();
                            } else if (mapWithAddedPiece[i][j].constructor === RotatingMovingGameCell) {
                                mapWithAddedPiece[i][j + 1] = new RotatingMovingGameCell();
                            }
                            mapWithAddedPiece[i][j] = new GameCell();
                        }
                    } else {
                        wasCollistion = true;
                    }
                }
            }
        }
        if (!wasCollistion) {
            this.gameState.setNewMap(mapWithAddedPiece);
        }
    }

    public moveLeft() {
        const mapWithAddedPiece = cloneDeep(this.gameState.map);
        let wasCollision = false;
        for (let j = mapWithAddedPiece[0].length - 1; j >= 0; j--) {
            for (let i = 0; i < mapWithAddedPiece.length; i++) {
                if (mapWithAddedPiece[i][j].constructor === MovingGameCell || mapWithAddedPiece[i][j].constructor === RotatingMovingGameCell) {
                    if (i - 1 >= 0) {
                        if (mapWithAddedPiece[i - 1][j].constructor === GameCell) {

                            if (mapWithAddedPiece[i][j].constructor === RotatingMovingGameCell) {
                                mapWithAddedPiece[i - 1][j] = new RotatingMovingGameCell();
                            } else {
                                mapWithAddedPiece[i - 1][j] = new MovingGameCell();
                            }
                            mapWithAddedPiece[i][j] = new GameCell();
                        } else {
                            wasCollision = true;
                        }
                    } else {
                        wasCollision = true;
                    }
                }
            }
        }
        if (!wasCollision) {
            this.gameState.setNewMap(mapWithAddedPiece);
        }
    }

    public rotate() {
        const rotating: any = this.getRotatingGameCell() || { x: 0, y: 0 };
        let wasCollistion = false
        const mapWithAddedPiece = cloneDeep(this.gameState.map);
        let mapWithAddedPiece2 = cloneDeep(this.gameState.map);
        mapWithAddedPiece2 = this.clearMovingGameCells(mapWithAddedPiece2)
        console.log(mapWithAddedPiece2);
        for (let j = mapWithAddedPiece[0].length - 1; j >= 0; j--) {
            for (let i = 0; i < mapWithAddedPiece.length; i++) {
                if (mapWithAddedPiece[i][j].constructor === MovingGameCell) {
                    const r = this.rotatePoint(rotating.x, rotating.y, i, j, 90);
                    let newX = Math.round(r[0]);
                    let newY = Math.round(r[1]);
                    if (newX < 0 || newY < 0 || newX >= mapWithAddedPiece2.length || newY >= mapWithAddedPiece2[0].length) {
                        wasCollistion = true;
                    } else if (mapWithAddedPiece2[newX][newY].constructor !== BlockGameCell) {
                        console.log(`${i}, ${j} ${newX} ${newY}`);
                        newX = Math.abs(Math.round(r[0]));
                        newY = Math.abs(Math.round(r[1]));
                        mapWithAddedPiece2[newX][newY] = new MovingGameCell();
                        mapWithAddedPiece[i][j] = new GameCell();
                    } else {
                        wasCollistion = true;
                    }
                }
            }
        }
        if (!wasCollistion) {
            this.gameState.setNewMap(mapWithAddedPiece2);
        }
    }

    public moveRight() {
        let wasCollision = false;
        const mapWithAddedPiece = cloneDeep(this.gameState.map);
        for (let j = mapWithAddedPiece[0].length - 1; j >= 0; j--) {
            for (let i = mapWithAddedPiece.length - 1; i >= 0; i--) {
                if (mapWithAddedPiece[i][j].constructor === MovingGameCell || mapWithAddedPiece[i][j].constructor === RotatingMovingGameCell) {
                    if (i + 1 < mapWithAddedPiece.length) {
                        if (mapWithAddedPiece[i + 1][j].constructor === GameCell) {
                            if (mapWithAddedPiece[i][j].constructor === RotatingMovingGameCell) {
                                mapWithAddedPiece[i + 1][j] = new RotatingMovingGameCell();
                            } else {
                                mapWithAddedPiece[i + 1][j] = new MovingGameCell();
                            }
                            mapWithAddedPiece[i][j] = new GameCell();
                        }
                    } else {
                        wasCollision = true;
                    }
                }
            }
        }
        if (!wasCollision) {
            this.gameState.setNewMap(mapWithAddedPiece);
        }
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
        for (let i = 0; i < this.gameState.map.length; i++) {
            for (let j = 0; j < this.gameState.map[0].length; j++) {
                if (this.gameState.map[i][j].constructor === MovingGameCell || this.gameState.map[i][j].constructor === RotatingMovingGameCell) {
                    this.gameState.map[i][j] = new BlockGameCell();
                }
            }
        }
    }

    getRotatingGameCell() {
        for (let i = 0; i < this.gameState.map.length; i++) {
            for (let j = 0; j < this.gameState.map[0].length; j++) {
                if (this.gameState.map[i][j].constructor === RotatingMovingGameCell) {
                    return {
                        x: i,
                        y: j
                    }
                }
            }
        }
    }

    public getWidth(): number {
        return this.GAMEBOARD_CELL_SIZE * this.GAMEBOARD_COLUMNS;
    }

    public getHeight(): number {
        return this.GAMEBOARD_CELL_SIZE * this.GAMEBOARD_ROWS;
    }

    public getState(): string {
        return this.state;
    }

    private rotatePoint(cx: number, cy: number, x: number, y: number, angle: number): any {
        var radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return [nx, ny];
    }
}