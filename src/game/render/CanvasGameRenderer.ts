import {
  GAME_BOARD_LINE_WIDTH,
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
  private canvas: any;

  constructor(game: Game, canvas: any) {
    this.game = game;
    this.canvas = canvas;
  }

  renderGameBoard(): void {
    const ctx = this.canvas.getContext("2d");
    this.setShadow(ctx);
    for (let x = 0; x < this.game.GAMEBOARD_COLUMNS; x++) {
      for (let y = 0; y < this.game.GAMEBOARD_ROWS; y++) {
        const gameCellPosition = new GameCellPosition(x, y);
        this.renderGameBoardCell(ctx, gameCellPosition);
        this.renderGameBlock(ctx, gameCellPosition);
      }
    }
  }

  private setShadow(ctx: any) {
    ctx.shadowColor = GAME_BOARD_SHADOW_COLOR;
    ctx.shadowBlur = GAME_BOARD_SHADOW_BLUR;
    ctx.shadowOffsetX = GAME_BOARD_SHADOW_OFFSET_X;
    ctx.shadowOffsetY = GAME_BOARD_SHADOW_OFFSET_Y;
  }

  private renderGameBoardCell(ctx: any, gameCellPosition: GameCellPosition): void {
    ctx.beginPath();
    ctx.strokeStyle = GAME_BOARD_STROKE_COLOR;
    ctx.lineWidth = GAME_BOARD_LINE_WIDTH;
    ctx.rect(
      gameCellPosition.x * this.game.GAMEBOARD_CELL_SIZE,
      gameCellPosition.y * this.game.GAMEBOARD_CELL_SIZE,
      this.game.GAMEBOARD_CELL_SIZE,
      this.game.GAMEBOARD_CELL_SIZE,
    );
    ctx.stroke();
  }

  private renderGameBlock(ctx: any, gameCellPosition: GameCellPosition): void {
    this.game.gameState.getCell(gameCellPosition.x, gameCellPosition.y).render(ctx, gameCellPosition);
  }
}
