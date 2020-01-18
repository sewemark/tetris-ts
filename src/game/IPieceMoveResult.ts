import { GameCell } from "./cells/GameCell";

export interface IPieceMoveResult {
    wasCollision: boolean;
    mapWithAddedPiece: GameCell[][];
}
