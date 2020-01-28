import { EventEmitter } from "events";
import cloneDeep from "lodash.clonedeep";
import { GAMEBOARD_CELL_SIZE, GAMEBOARD_COLUMNS, GAMEBOARD_ROWS } from "../common/CanvasConstats";
import { GameLooseEvent } from "../events/GameLooseEvent";
import { LineRemovedEvent } from "../events/LineRemovedEvent";
import { NewPieceEvent } from "../events/NewPieceEvent";
import { SHAPES } from "../game/pieceDefinition/pieceDefinition";
import { IMathUtil } from "../utils/MathUtil";
import { BlockGameCell } from "./cells/BlockGameCell";
import { GameCell } from "./cells/GameCell";
import { MovingGameCell } from "./cells/MovingGameCell";
import { RotatingMovingGameCell } from "./cells/RotatingMovingGameCell";
import { GameCellPosition } from "./GameCellPosition";
import { GameState } from "./GameState";
import { IGameLogic } from "./IGameLogic";
import { IMovingCellFactory } from "./IMovingCellFactory";
import { IPieceMoveResult } from "./IPieceMoveResult";

export const GAME_STATE = {
  LOOSE: "loose",
  NEW_GAME: "newGame",
};

export class Game extends EventEmitter implements IGameLogic {
  gameState: GameState;
  private mathUtil: IMathUtil;
  private movingCellFactory: IMovingCellFactory;
  private mutex: boolean;
  private nextPiece: number[][];

  constructor(mathUtil: IMathUtil, movingCellFactory: IMovingCellFactory) {
    super();
    this.mathUtil = mathUtil;
    this.gameState = new GameState();
    this.movingCellFactory = movingCellFactory;
    this.mutex = false;
  }

  insertNewPiece(): void {
    const currentPiece = this.setNextPiece();
    this.emit(NewPieceEvent.EVENT_NAME, { nextPiece: this.nextPiece });
    const result = this.canInsertNewPiece(currentPiece);
    this.gameState.setNewMap(result.mapWithAddedPiece);
    if (result.wasCollision) {
      this.emit(GameLooseEvent.EVENT_NAME);
    }
  }

  animate(): void {
    if (this.mutex) {
      return;
    }
    const result = this.canPieceMoveDown();
    if (result.wasCollision) {
      this.gameState.markAllMovingCellsAsGameCells();
      this.insertNewPiece();
    } else {
      this.gameState.setNewMap(result.mapWithAddedPiece);
    }
    this.removeLines();
  }

  rotate(): void {
    this.mutex = true;
    const rotationCenterPoint: any = this.gameState.getRotatingGameCell();
    const mapWithAddedPiece = cloneDeep(this.gameState.map);
    let mapWithAddedPieceClearCopy = cloneDeep(this.gameState.map);
    mapWithAddedPieceClearCopy = this.clearMovingGameCells(mapWithAddedPieceClearCopy);

    for (let y = mapWithAddedPiece[0].length - 1; y >= 0; y--) {
      for (let x = 0; x < mapWithAddedPiece.length; x++) {
        if (mapWithAddedPiece[x][y].canRote()) {
          const rotatedPoint = this.mathUtil.rotatePoint(rotationCenterPoint.x, rotationCenterPoint.y, x, y, 90);
          if (this.canCellBePutInNewPosition(rotatedPoint, mapWithAddedPieceClearCopy)) {
            mapWithAddedPieceClearCopy[rotatedPoint.x][rotatedPoint.y] = new MovingGameCell();
            mapWithAddedPiece[x][y] = new GameCell();
          } else {
            this.mutex = false;
            return;
          }
        }
      }
    }
    this.gameState.setNewMap(mapWithAddedPieceClearCopy);
    this.mutex = false;
  }

  moveDown(): void {
    const result = this.canPieceMoveDown();
    if (!result.wasCollision) {
      this.gameState.setNewMap(result.mapWithAddedPiece);
    }
  }

  moveRight(): void {
    this.mutex = true;
    let mapWithAddedPiece = cloneDeep(this.gameState.map);
    for (let y = mapWithAddedPiece[0].length - 1; y >= 0; y--) {
      for (let x = mapWithAddedPiece.length - 1; x >= 0; x--) {
        const result = this.canPieceMoveSide(new GameCellPosition(x, y), new GameCellPosition(1, 0), mapWithAddedPiece);
        if (result.wasCollision) {
          this.mutex = false;
          return;
        }
        mapWithAddedPiece = result.mapWithAddedPiece;
      }
    }
    this.gameState.setNewMap(mapWithAddedPiece);
    this.mutex = false;
  }

  moveLeft(): void {
    this.mutex = true;
    let mapWithAddedPiece = cloneDeep(this.gameState.map);
    for (let y = mapWithAddedPiece[0].length - 1; y >= 0; y--) {
      for (let x = 0; x < mapWithAddedPiece.length; x++) {
        const result = this.canPieceMoveSide(new GameCellPosition(x, y), new GameCellPosition(-1, 0), mapWithAddedPiece);
        if (result.wasCollision) {
          this.mutex = false;
          return;
        }
        mapWithAddedPiece = result.mapWithAddedPiece;
      }
    }
    this.gameState.setNewMap(mapWithAddedPiece);
    this.mutex = false;
  }

  getWidth(): number {
    return GAMEBOARD_CELL_SIZE * GAMEBOARD_COLUMNS;
  }

  getHeight(): number {
    return GAMEBOARD_CELL_SIZE * GAMEBOARD_ROWS;
  }

  private canPieceMoveSide(position: GameCellPosition, offset: GameCellPosition, mapWithAddedPiece: GameCell[][]): IPieceMoveResult {
    let wasCollision = false;
    if (mapWithAddedPiece[position.x][position.y].canMoveRight()) {
      if (position.x + offset.x >= 0 && position.x + offset.x < mapWithAddedPiece.length) {
        if (mapWithAddedPiece[position.x + offset.x][position.y + offset.y].isReplaceable()) {
          mapWithAddedPiece[position.x + offset.x][position.y + offset.y] = this.movingCellFactory.clone(mapWithAddedPiece[position.x][position.y]);
          mapWithAddedPiece[position.x][position.y] = new GameCell();
        } else {
          wasCollision = true;
        }
      } else {
        wasCollision = true;
      }
    }
    return {
      wasCollision,
      mapWithAddedPiece,
    };
  }

  private canPieceMoveDown(): IPieceMoveResult {
    let wasCollision = false;
    const mapWithAddedPiece = cloneDeep(this.gameState.map);
    for (let y = mapWithAddedPiece[0].length - 1; y >= 0; y--) {
      for (let x = mapWithAddedPiece.length - 1; x >= 0; x--) {
        if (mapWithAddedPiece[x][y].canMoveDown()) {
          if (y + 1 < mapWithAddedPiece[0].length && mapWithAddedPiece[x][y + 1].isReplaceable()) {
            mapWithAddedPiece[x][y + 1] = this.movingCellFactory.clone(mapWithAddedPiece[x][y]);
            mapWithAddedPiece[x][y] = new GameCell();
          } else {
            wasCollision = true;
          }
        }
      }
    }
    return {
      wasCollision,
      mapWithAddedPiece,
    };
  }

  private removeLines(): void {
    const mapWithAddedPiece = cloneDeep(this.gameState.map);
    for (let y = 0; y < mapWithAddedPiece[0].length; y++) {
      const shouldBeRemoved = mapWithAddedPiece.reduce((prev: boolean, curr: GameCell[]) => {
        return prev && curr[y].canBeRemovedInline();
      }, true);

      if (shouldBeRemoved) {
        for (let x = 0; x < mapWithAddedPiece.length; x++) {
          mapWithAddedPiece[x].splice(y, 1);
          mapWithAddedPiece[x] = [new GameCell()].concat(mapWithAddedPiece[x]);
        }
        this.emit(LineRemovedEvent.EVENT_NAME);
      }
    }
    this.gameState.setNewMap(mapWithAddedPiece);
  }

  private canInsertNewPiece(nextPiece: number[][]): IPieceMoveResult {
    const mapWithAddedPiece = this.gameState.map;
    const middle = Math.floor(mapWithAddedPiece.length / 2);
    let wasCollision = false;
    for (let x = 0; x < nextPiece.length; x++) {
      for (let y = 0; y < nextPiece[0].length; y++) {
        if (!mapWithAddedPiece[middle + x][y].isReplaceable()) {
          wasCollision = true;
        }
        if (nextPiece[x][y] !== 0) {
          mapWithAddedPiece[middle + x][y] = this.movingCellFactory.createNewGameCell(nextPiece[x][y]);
        }
      }
    }
    return {
      wasCollision,
      mapWithAddedPiece,
    };
  }

  private clearMovingGameCells(gameBoard: GameCell[][]): GameCell[][] {
    // tslint:disable-next-line: prefer-for-of
    for (let x = 0; x < gameBoard.length; x++) {
      for (let y = 0; y < gameBoard[0].length; y++) {
        if (gameBoard[x][y].canRote()) {
          gameBoard[x][y] = new GameCell();
        }
      }
    }
    return gameBoard;
  }

  private getNextRandomPiece(): number[][] {
    const randomIndex = Math.floor(Math.random() * (4 - 0 + 1) + 0);
    return SHAPES[randomIndex];
  }

  private canCellBePutInNewPosition(rotatedPoint: GameCellPosition, mapWithAddedPiece2: GameCell[][]): boolean {
    return (
      rotatedPoint.x >= 0 &&
      rotatedPoint.y >= 0 &&
      rotatedPoint.x < mapWithAddedPiece2.length &&
      rotatedPoint.y < mapWithAddedPiece2[0].length &&
      mapWithAddedPiece2[rotatedPoint.x][rotatedPoint.y].constructor !== BlockGameCell
    );
  }

  private setNextPiece(): number[][] {
    let currentPiece;
    if (!this.nextPiece) {
      this.nextPiece = this.getNextRandomPiece();
      currentPiece = this.getNextRandomPiece();
    } else {
      currentPiece = cloneDeep(this.nextPiece);
      this.nextPiece = this.getNextRandomPiece();
    }
    return currentPiece;
  }
}
