export interface IGameLogic {
  insertNewPiece(): void;
  animate(): void;
  moveDown(): void;
  rotate(): void;
  moveRight(): void;
  moveLeft(): void;
}
