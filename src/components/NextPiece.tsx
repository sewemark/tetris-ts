import React from "react";
import { connect } from "react-redux";
import {
  GAME_BLOCK_BORDER_WIDTH,
  GAME_BLOCK_COLOR,
  GAME_BOARD_LINE_WIDTH,
  GAME_BOARD_STROKE_COLOR,
  GAMEBOARD_CELL_SIZE,
  MOVING_GAME_BLOCK_COLOR,
} from "../common/CanvasConstats";
import { GameCellPosition } from "../game/GameCellPosition";

class NextPiece extends React.Component {
  constructor(props: object) {
    super(props);
  }

  componentDidUpdate() {
    if ((this.props as any).nextPiece) {
      this.renderGameBoard((this.props as any).nextPiece);
    }
  }

  render() {
    return (
      <div className="gameContainer__nextPiece">
        <h3 className="heading-3">Next piece</h3>
        <canvas style={{}} className="gameContainer__nextPieceCanvas" ref="nextPieceCanvas" />
      </div>
    );
  }

  renderGameBoard(nextPiece: number[][]): void {
    for (let x = 0; x < nextPiece.length; x++) {
      for (let y = 0; y < nextPiece[0].length; y++) {
        const gameCellPosition = new GameCellPosition(x, y);
        this.renderGameBoardCell(gameCellPosition);
        this.drawCell(gameCellPosition, nextPiece[x][y]);
      }
    }
  }

  private renderGameBoardCell(gameCellPosition: GameCellPosition): void {
    const canvas: any = this.refs.nextPieceCanvas;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.strokeStyle = GAME_BOARD_STROKE_COLOR;
    ctx.lineWidth = GAME_BOARD_LINE_WIDTH;
    ctx.rect(gameCellPosition.x * GAMEBOARD_CELL_SIZE, gameCellPosition.y * GAMEBOARD_CELL_SIZE, GAMEBOARD_CELL_SIZE, GAMEBOARD_CELL_SIZE);
    ctx.stroke();
  }

  private drawCell(gameCell: GameCellPosition, value: number): void {
    const canvas: any = this.refs.nextPieceCanvas;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.fillStyle = this.getColor(value);
    ctx.fillRect(
      gameCell.x * GAMEBOARD_CELL_SIZE + GAME_BLOCK_BORDER_WIDTH,
      gameCell.y * GAMEBOARD_CELL_SIZE + GAME_BLOCK_BORDER_WIDTH,
      GAMEBOARD_CELL_SIZE - GAME_BLOCK_BORDER_WIDTH,
      GAMEBOARD_CELL_SIZE - GAME_BLOCK_BORDER_WIDTH,
    );
    ctx.stroke();
  }

  private getColor(value: number): string {
    return value !== 0 ? MOVING_GAME_BLOCK_COLOR : GAME_BLOCK_COLOR;
  }
}

const mapStateToProps = (state: any) => ({
  nextPiece: state.game.nextPiece,
});

export default connect(mapStateToProps)(NextPiece);
