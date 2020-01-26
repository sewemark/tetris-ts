import { MOVING_GAME_BLOCK_COLOR } from "../../common/CanvasConstats";
import { GameCellPosition } from "../GameCellPosition";
import { GameCell } from "./GameCell";
import { ICanvasRenderableElement } from "./ICanvasRenderableElement";

export class MovingGameCell extends GameCell implements ICanvasRenderableElement {
  protected color: string = MOVING_GAME_BLOCK_COLOR;

  render(ctx: CanvasRenderingContext2D, gameCell: GameCellPosition) {
    this.drawCell(ctx, gameCell);
  }

  canMoveLeft() {
    return true;
  }

  canMoveRight() {
    return true;
  }

  canMoveDown() {
    return true;
  }

  canRote() {
    return true;
  }

  isReplaceable() {
    return false;
  }
}
