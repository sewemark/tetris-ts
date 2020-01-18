import { GameCellPosition } from "../game/GameCellPosition";

export interface IMathUtil {
    rotatePoint(cx: number, cy: number, x: number, y: number, angle: number): GameCellPosition;
}
export class MathUtil implements IMathUtil {
    public rotatePoint(cx: number, cy: number, x: number, y: number, angle: number): GameCellPosition {
        var radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return new GameCellPosition(nx, ny);
    }
}