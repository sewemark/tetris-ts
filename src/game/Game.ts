import { GameState } from "./GameState";
import { SHAPES } from "../game/pieceDefinition/pieceDefinition";
import cloneDeep from 'lodash.clonedeep';
import { EventEmitter } from "events";
import { IMathUtil } from "../utils/MathUtil";
import { IPieceMoveResult } from "./IPieceMoveResult";
import { IMovingCellFactory } from "./IMovingCellFactory";
import { GameCell } from "./cells/GameCell";
import { BlockGameCell } from "./cells/BlockGameCell";
import { MovingGameCell } from "./cells/MovingGameCell";
import { GameCellPosition } from "./GameCellPosition";
import { RotatingMovingGameCell } from "./cells/RotatingMovingGameCell";
export const GAME_STATE = {
    LOOSE: 'loose',
    NEW_GAME: 'newGame',
}

export class Game extends EventEmitter {

    public readonly GAMEBOARD_ROWS = 15;
    public readonly GAMEBOARD_COLUMNS = 10;
    public readonly GAMEBOARD_CELL_SIZE = 50;
    public gameState: GameState;
    private mathUtil: IMathUtil;
    private movingCellFactory: IMovingCellFactory;

    constructor(mathUtil: IMathUtil, movingCellFactory: IMovingCellFactory) {
        super();
        this.mathUtil = mathUtil;
        this.gameState = new GameState();
        this.movingCellFactory = movingCellFactory;
    }

    public insertNewPiece() {
        const piece = this.getNextRandomPiece();
        const mapWithAddedPiece = this.gameState.map;
        const middle = Math.floor(mapWithAddedPiece.length / 2);
        let wasCollision = false;
        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[0].length; j++) {
                if (!mapWithAddedPiece[middle + i][j].isReplaceable()) {
                    wasCollision = true;
                }
                if (piece[i][j] != 0) {
                    mapWithAddedPiece[middle + i][j] = this.createNewGameCell(piece[i][j]);
                }
            }
        }
        this.gameState.setNewMap(mapWithAddedPiece);
        if (wasCollision) {
            this.emit('GameLoose');
        }
    }

    public animate() {
        const result = this.canPieceMoveDown();
        if (result.wasCollision) {
            this.gameState.markAllMovingCellsAsGameCells();
            this.insertNewPiece();
        } else {
            this.gameState.setNewMap(result.mapWithAddedPiece);
        }
        this.removeLines();
    }

    public down() {
        const result = this.canPieceMoveDown();
        if (!result.wasCollision) {
            this.gameState.setNewMap(result.mapWithAddedPiece);
        }
    }

    public canPieceMoveDown(): IPieceMoveResult {
        let wasCollision = false;
        const mapWithAddedPiece = cloneDeep(this.gameState.map);
        for (let j = mapWithAddedPiece[0].length - 1; j >= 0; j--) {
            for (let i = mapWithAddedPiece.length - 1; i >= 0; i--) {
                if (mapWithAddedPiece[i][j].canMoveDown()) {
                    if (j + 1 < mapWithAddedPiece[0].length && mapWithAddedPiece[i][j + 1].isReplaceable()) {
                        mapWithAddedPiece[i][j + 1] = this.movingCellFactory.clone(mapWithAddedPiece[i][j]);
                        mapWithAddedPiece[i][j] = new GameCell();
                    } else {
                        wasCollision = true;
                    }
                }
            }
        }
        return {
            wasCollision,
            mapWithAddedPiece
        }
    }

    public removeLines() {
        let mapWithAddedPiece = cloneDeep(this.gameState.map);
        for (let y = 0; y < mapWithAddedPiece[0].length; y++) {
            const shouldBeRemoved = mapWithAddedPiece.reduce((prev: boolean, curr: GameCell[]) => {
                return prev && curr[y].canBeRemovedInline()
            }, true)
            if (shouldBeRemoved) {
                for (let x = 0; x < mapWithAddedPiece.length; x++) {
                    mapWithAddedPiece[x].splice(y, 1)
                    mapWithAddedPiece[x] = [new GameCell()].concat(mapWithAddedPiece[x]);
                }
            }
        }
        this.gameState.setNewMap(mapWithAddedPiece);
    }

    public rotate() {
        const rotating: any = this.gameState.getRotatingGameCell();
        let wasCollistion = false
        const mapWithAddedPiece = cloneDeep(this.gameState.map);
        let mapWithAddedPiece2 = cloneDeep(this.gameState.map);
        mapWithAddedPiece2 = this.gameState.clearMovingGameCells(mapWithAddedPiece2)
        for (let j = mapWithAddedPiece[0].length - 1; j >= 0; j--) {
            for (let i = 0; i < mapWithAddedPiece.length; i++) {
                if (mapWithAddedPiece[i][j].constructor === MovingGameCell) {
                    const r = this.mathUtil.rotatePoint(rotating.x, rotating.y, i, j, 90);
                    let newX = Math.round(r.x);
                    let newY = Math.round(r.y);
                    if (newX < 0 || newY < 0 || newX >= mapWithAddedPiece2.length || newY >= mapWithAddedPiece2[0].length) {
                        wasCollistion = true;
                    } else if (mapWithAddedPiece2[newX][newY].constructor !== BlockGameCell) {
                        console.log(`${i}, ${j} ${newX} ${newY}`);
                        newX = Math.abs(Math.round(r.x));
                        newY = Math.abs(Math.round(r.y));
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

    public canPieceMoveSide(position: GameCellPosition, offset: GameCellPosition, mapWithAddedPiece: GameCell[][]): IPieceMoveResult {
        let wasCollision = false;
        if (mapWithAddedPiece[position.x][position.y].canMoveRight()) {
            if (position.x + offset.x >=0 && position.x + offset.x < mapWithAddedPiece.length) {
                if (mapWithAddedPiece[position.x + offset.x][position.y + offset.y].isReplaceable()) {
                    mapWithAddedPiece[position.x + offset.x][position.y + offset.y] = this.movingCellFactory.clone(mapWithAddedPiece[position.x][position.y]);
                    mapWithAddedPiece[position.x][position.y] = new GameCell();
                }
            } else {
                wasCollision = true;
            }
        }
        return {
            wasCollision,
            mapWithAddedPiece,
        }
    }

    public moveRight() {
        let wasCollision = false;
        let mapWithAddedPiece = cloneDeep(this.gameState.map);
        for (let y = mapWithAddedPiece[0].length - 1; y >= 0; y--) {
            for (let x = mapWithAddedPiece.length - 1; x >= 0; x--) {
                const result = this.canPieceMoveSide(new GameCellPosition(x, y), new GameCellPosition(1, 0), mapWithAddedPiece);
                mapWithAddedPiece = result.mapWithAddedPiece;
                wasCollision = wasCollision || result.wasCollision;
            }
        }
        if (!wasCollision) {
            this.gameState.setNewMap(mapWithAddedPiece);
        }
    }

    public moveLeft() {
        let wasCollision = false;
        let mapWithAddedPiece = cloneDeep(this.gameState.map);
        for (let y = mapWithAddedPiece[0].length - 1; y >= 0; y--) {
            for (let x = 0; x < mapWithAddedPiece.length; x++) {
                const result = this.canPieceMoveSide(new GameCellPosition(x, y), new GameCellPosition(-1, 0), mapWithAddedPiece);
                mapWithAddedPiece = result.mapWithAddedPiece;
                wasCollision = wasCollision || result.wasCollision;
            }
        }
        if (!wasCollision) {
            this.gameState.setNewMap(mapWithAddedPiece);
        }
    }

    public getWidth(): number {
        return this.GAMEBOARD_CELL_SIZE * this.GAMEBOARD_COLUMNS;
    }

    public getHeight(): number {
        return this.GAMEBOARD_CELL_SIZE * this.GAMEBOARD_ROWS;
    }

    private getNextRandomPiece() {
        const randomIndex = Math.floor(Math.random() * (4 - 0 + 1) + 0);
        return SHAPES[randomIndex];
    }

    private createNewGameCell(piece: number): GameCell {
        return piece === 2 ? new RotatingMovingGameCell() : new MovingGameCell();
    }
}

// public moveAbstract(offSet: GameCellPosition) {
//     let wasCollision = false;
//     let mapWithAddedPiece = this.gameState.map;
//     let mapWithAddedPiece2 = cloneDeep(this.gameState.map);
//     mapWithAddedPiece2 = this.gameState.clearMovingGameCells(mapWithAddedPiece2);
//     for (let j = 0; j < mapWithAddedPiece[0].length; j++) {
//         for (let i = 0; i < mapWithAddedPiece.length; i++) {
//             if (mapWithAddedPiece[i][j].canMoveRight()) {
//                 if (this.canMoveToOffset(new GameCellPosition(i,j), offSet, mapWithAddedPiece2)) {
//                     if (mapWithAddedPiece2[i + offSet.x][j + offSet.y].constructor !== BlockGameCell) {
//                         if (mapWithAddedPiece[i][j].constructor === RotatingMovingGameCell) {
//                             mapWithAddedPiece2[i + offSet.x][j + offSet.y] = new RotatingMovingGameCell();
//                         } else {
//                             mapWithAddedPiece2[i + offSet.x][j + offSet.y] = new MovingGameCell();
//                         }
//                         mapWithAddedPiece[i][j] = new GameCell();
//                     }
//                 } else {
//                     console.log('huj12333333');
//                     wasCollision = true;
//                 }
//             }
//         }
//     }
//     if (!wasCollision) {
//         this.gameState.setNewMap(mapWithAddedPiece2);
//     }
// }