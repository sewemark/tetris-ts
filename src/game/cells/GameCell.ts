import { GAME_BLOCK_BORDER_WIDTH, GAME_BLOCK_COLOR, GAMEBOARD_CELL_SIZE } from "../../common/CanvasConstats";
import { GameCellPosition } from "../GameCellPosition";
import { ICanvasRenderableElement } from "./ICanvasRenderableElement";

export class GameCell implements ICanvasRenderableElement {
  protected color: string = GAME_BLOCK_COLOR;

  render(ctx: CanvasRenderingContext2D, gameCell: GameCellPosition) {
    this.drawCell(ctx, gameCell);
  }

  canMoveLeft() {
    return false;
  }

  canMoveRight() {
    return false;
  }

  canMoveDown() {
    return false;
  }

  canRote() {
    return false;
  }

  isReplaceable() {
    return true;
  }

  canBeRemovedInline() {
    return false;
  }

  protected drawCell(ctx: CanvasRenderingContext2D, gameCell: GameCellPosition) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(
      gameCell.x * GAMEBOARD_CELL_SIZE + GAME_BLOCK_BORDER_WIDTH,
      gameCell.y * GAMEBOARD_CELL_SIZE + GAME_BLOCK_BORDER_WIDTH,
      GAMEBOARD_CELL_SIZE - GAME_BLOCK_BORDER_WIDTH,
      GAMEBOARD_CELL_SIZE - GAME_BLOCK_BORDER_WIDTH,
    );
    ctx.stroke();
  }
}
