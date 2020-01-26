import {
  GAMEBOARD_CELL_SIZE,
  GAMEBOARD_COLUMNS,
  GAMEBOARD_ROWS,
  GAME_BOARD_LINE_WIDTH,
  GAME_BOARD_SHADOW_BLUR,
  GAME_BOARD_SHADOW_COLOR,
  GAME_BOARD_SHADOW_OFFSET_X,
  GAME_BOARD_SHADOW_OFFSET_Y,
  GAME_BOARD_STROKE_COLOR,
} from "../../common/CanvasConstats";
import { GameCellPosition } from "../GameCellPosition";
import { IGameState } from "../IGameState";
import { ICanvasGameRender } from "./ICanvasGameRender";

export class CanvasGameRenderer implements ICanvasGameRender {
  private gameState: IGameState;
  private ctx: CanvasRenderingContext2D;

  constructor(gameState: IGameState, ctx: CanvasRenderingContext2D) {
    this.gameState = gameState;
    this.ctx = ctx;
  }

  renderGameBoard(): void {
    this.setShadow();
    for (let x = 0; x < GAMEBOARD_COLUMNS; x++) {
      for (let y = 0; y < GAMEBOARD_ROWS; y++) {
        const gameCellPosition = new GameCellPosition(x, y);
        this.renderGameBoardCell(gameCellPosition);
        this.renderGameBlock(gameCellPosition);
      }
    }
  }

  private setShadow(): void {
    this.ctx.shadowColor = GAME_BOARD_SHADOW_COLOR;
    this.ctx.shadowBlur = GAME_BOARD_SHADOW_BLUR;
    this.ctx.shadowOffsetX = GAME_BOARD_SHADOW_OFFSET_X;
    this.ctx.shadowOffsetY = GAME_BOARD_SHADOW_OFFSET_Y;
  }

  private renderGameBoardCell(gameCellPosition: GameCellPosition): void {
    this.ctx.beginPath();
    this.ctx.strokeStyle = GAME_BOARD_STROKE_COLOR;
    this.ctx.lineWidth = GAME_BOARD_LINE_WIDTH;
    this.ctx.rect(gameCellPosition.x * GAMEBOARD_CELL_SIZE, gameCellPosition.y * GAMEBOARD_CELL_SIZE, GAMEBOARD_CELL_SIZE, GAMEBOARD_CELL_SIZE);
    this.ctx.stroke();
  }

  private renderGameBlock(gameCellPosition: GameCellPosition): void {
    this.gameState.getCell(gameCellPosition).render(this.ctx, gameCellPosition);
  }
}
