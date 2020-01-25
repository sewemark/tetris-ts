import { GameCellPosition } from "./GameCellPosition";
import { Game } from "./Game";

export interface ICanvasGameRender {
  renderGameBoard(): void;
}

export class CanvasGameRenderer implements ICanvasGameRender {
  private game: Game;
  private canvas: any;

  constructor(game: Game, canvas: any) {
    this.game = game;
    this.canvas = canvas;
  }

  renderGameBoard() {
    const ctx = this.canvas.getContext("2d");
    this.setShadow(ctx);
    for (let i = 0; i < this.game.GAMEBOARD_COLUMNS; i++) {
      for (let j = 0; j < this.game.GAMEBOARD_ROWS; j++) {
        ctx.beginPath();
        ctx.strokeStyle = "#A8D0E6";
        ctx.lineWidth = "0.1";
        ctx.rect(i * this.game.GAMEBOARD_CELL_SIZE, j * this.game.GAMEBOARD_CELL_SIZE, this.game.GAMEBOARD_CELL_SIZE, this.game.GAMEBOARD_CELL_SIZE);
        ctx.stroke();
        this.setShadow(ctx);
        this.game.gameState.getCell(i, j).render(ctx, new GameCellPosition(i, j));
      }
    }
  }
  setShadow(ctx: any) {
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 51;
    ctx.shadowOffsetX = 9;
    ctx.shadowOffsetY = 28;
  }
}
