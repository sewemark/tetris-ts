import { BLOCKED_GAME_BLOCK_COLOR } from "../../common/CanvasConstats";
import { GameCellPosition } from "../GameCellPosition";
import { GameCell } from "./GameCell";
import { ICanvasRenderableElement } from "./ICanvasRenderableElement";

export class BlockGameCell extends GameCell implements ICanvasRenderableElement {
  protected color: string = BLOCKED_GAME_BLOCK_COLOR;

  render(ctx: CanvasRenderingContext2D, gameCell: GameCellPosition) {
    this.drawCell(ctx, gameCell);
  }

  isReplaceable() {
    return false;
  }

  canBeRemovedInline() {
    return true;
  }
}
