import { GameCellPosition } from "../GameCellPosition";

export interface ICanvasRenderableElement {
  render(ctx: CanvasRenderingContext2D, gameCellPosition: GameCellPosition): void;
}
