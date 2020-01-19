import { GameCellPosition } from "../game/GameCellPosition";

export interface IMathUtil {
  rotatePoint(
    cx: number,
    cy: number,
    x: number,
    y: number,
    angle: number,
  ): GameCellPosition;
}

export class MathUtil implements IMathUtil {
  rotatePoint(
    cx: number,
    cy: number,
    x: number,
    y: number,
    angle: number,
  ): GameCellPosition {
    const radians = (Math.PI / 180) * angle;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const nx = cos * (x - cx) + sin * (y - cy) + cx;
    const ny = cos * (y - cy) - sin * (x - cx) + cy;
    return new GameCellPosition(nx, ny);
  }
}
