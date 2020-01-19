import { GameCell } from "./GameCell";
import { ICanvasRenderableElement } from "./ICanvasRenderableElement";
import { GameCellPosition } from "../GameCellPosition";

export class BlockGameCell extends GameCell
  implements ICanvasRenderableElement {
  protected color: string = "#F8E9A1";

  public render(ctx: CanvasRenderingContext2D, gameCell: GameCellPosition) {
    this.drawCell(ctx, gameCell);
  }

  public isReplaceable() {
    return false;
  }

  public canBeRemovedInline() {
    return true;
  }
}
