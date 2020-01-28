import React from "react";
import { connect } from "react-redux";
import { GAMEBOARD_CELL_SIZE, GAME_BLOCK_COLOR, MOVING_GAME_BLOCK_COLOR } from "../common/CanvasConstats";
import { GameCellPosition } from "../game/GameCellPosition";
import { MovingCellFactory } from "../game/MovingCellFactory";

class NextPiece extends React.Component {
  private movingGameCellFactory: MovingCellFactory;
  constructor(props: object) {
    super(props);
    this.movingGameCellFactory = new MovingCellFactory();
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
        <canvas style={{}} width={this.getWidth()} height={this.getHeight()} className="gameContainer__nextPieceCanvas" ref="nextPieceCanvas" />
      </div>
    );
  }

  renderGameBoard(nextPiece: number[][]): void {
    const canvas: any = this.refs.nextPieceCanvas;
    const ctx = canvas.getContext("2d");
    for (let x = 0; x < nextPiece.length; x++) {
      for (let y = 0; y < nextPiece[0].length; y++) {
        const cell = this.movingGameCellFactory.createNewGameCell(nextPiece[x][y]);
        cell.render(ctx, new GameCellPosition(x, y));
      }
    }
  }

  private getWidth(): number {
    return GAMEBOARD_CELL_SIZE * 4;
  }

  private getHeight(): number {
    return GAMEBOARD_CELL_SIZE * 4;
  }
}

const mapStateToProps = (state: any) => ({
  nextPiece: state.game.nextPiece,
});

export default connect(mapStateToProps)(NextPiece);
