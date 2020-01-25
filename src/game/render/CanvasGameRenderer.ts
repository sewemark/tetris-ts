import {
  GAME_BOARD_LINE_WIDTH,
  GAMEBOARD_CELL_SIZE,
  GAMEBOARD_COLUMNS,
  GAMEBOARD_ROWS,
  GAME_BOARD_SHADOW_BLUR,
  GAME_BOARD_SHADOW_COLOR,
  GAME_BOARD_SHADOW_OFFSET_X,
  GAME_BOARD_SHADOW_OFFSET_Y,
  GAME_BOARD_STROKE_COLOR,
} from "../../common/CanvasConstats";
import { Game } from "../Game";
import { GameCellPosition } from "../GameCellPosition";
import { ICanvasGameRender } from "./ICanvasGameRender";

export class CanvasGameRenderer implements ICanvasGameRender {
  private game: Game;
  private ctx: CanvasRenderingContext2D;

  constructor(game: Game, ctx: CanvasRenderingContext2D) {
    this.game = game;
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
    console.log(this.ctx);
    this.ctx.beginPath();
    this.ctx.strokeStyle = GAME_BOARD_STROKE_COLOR;
    this.ctx.lineWidth = GAME_BOARD_LINE_WIDTH;
    this.ctx.rect(gameCellPosition.x * GAMEBOARD_CELL_SIZE, gameCellPosition.y * GAMEBOARD_CELL_SIZE, GAMEBOARD_CELL_SIZE, GAMEBOARD_CELL_SIZE);
    this.ctx.stroke();
  }

  private renderGameBlock(gameCellPosition: GameCellPosition): void {
    this.game.gameState.getCell(gameCellPosition.x, gameCellPosition.y).render(this.ctx, gameCellPosition);
  }
}
