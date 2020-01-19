import React from "react";
import { connect } from "react-redux";
import { setGameScore, setGameState } from "../actions";
import { Game, GAME_STATE } from "../game/Game";
import { GameCellPosition } from "../game/GameCellPosition";
import { MovingCellFactory } from "../game/MovingCellFactory";
import { MathUtil } from "../utils/MathUtil";
import PopupDialog from "./PopupDialog";

const LINE_REMOVED_SCORE = 1;

class GameBoard extends React.Component {
  private game: Game;
  private intervalId: any;

  constructor(props: object) {
    super(props);
    this.game = new Game(new MathUtil(), new MovingCellFactory());
    this.initGame();
  }

  componentDidMount() {
    this.startGame();
    const bindedOnArrowsKeyDownListener = this.onArrowsKeyDownListener.bind(
      this,
    );
    document.addEventListener("keydown", bindedOnArrowsKeyDownListener, false);
  }

  onArrowsKeyDownListener(event: any): void {
    const keyCode = event.keyCode;
    if (keyCode >= 37 && keyCode <= 40) {
      this.movePiece(keyCode);
      this.renderGameBoard();
    }
  }

  movePiece(direction: number) {
    switch (direction) {
      case 37:
        this.game.moveLeft();
        break;
      case 38:
        this.game.rotate();
        break;
      case 39:
        this.game.moveRight();
        break;
      case 40:
        this.game.down();
        break;
      default:
        break;
    }
  }

  renderGameBoard() {
    const canvas = this.refs.canvas as any;
    const ctx = canvas.getContext("2d");
    for (let i = 0; i < this.game.GAMEBOARD_COLUMNS; i++) {
      for (let j = 0; j < this.game.GAMEBOARD_ROWS; j++) {
        ctx.beginPath();
        ctx.strokeStyle = "#A8D0E6";
        ctx.lineWidth = "0.1";
        ctx.rect(
          i * this.game.GAMEBOARD_CELL_SIZE,
          j * this.game.GAMEBOARD_CELL_SIZE,
          this.game.GAMEBOARD_CELL_SIZE,
          this.game.GAMEBOARD_CELL_SIZE,
        );
        ctx.stroke();
        this.game.gameState
          .getCell(i, j)
          .render(ctx, new GameCellPosition(i, j));
      }
    }
  }

  render() {
    const gameProps: any = (this.props as any).game;
    return (
      <div className="gameContainer__gameBoard">
        {gameProps.gameState === GAME_STATE.LOOSE ? (
          <PopupDialog
            setNewGame={() => this.setNewGame.call(this)}
            actionName="New game"
            title="You loose"
          />
        ) : (
          ""
        )}
        <canvas
          style={{}}
          ref="canvas"
          width={this.game.getWidth()}
          height={this.game.getHeight()}
        />
      </div>
    );
  }

  private setNewGame() {
    console.log("setting new game");
    (this.props as any).setGameState(GAME_STATE.NEW_GAME);
    this.initGame();
    this.startGame();
  }

  private startGame() {
    this.renderGameBoard();
    this.game.insertNewPiece();
    this.intervalId = setInterval(() => {
      this.renderGameBoard();
      this.game.animate();
    }, 500);
  }

  private initGame() {
    this.game = new Game(new MathUtil(), new MovingCellFactory());
    this.game.on("GameLoose", () => {
      (this.props as any).setGameState(GAME_STATE.LOOSE);
      this.renderGameBoard();
      clearInterval(this.intervalId);
    });
    this.game.on("LineRemoved", () => {
      (this.props as any).setGameScore(LINE_REMOVED_SCORE);
    });
  }
}

const mapStateToProps = (state: any) => ({
  game: state.game,
});

const mapDispatchToProps = (dispatch: any) => ({
  setGameState: (gameState: string) => dispatch(setGameState(gameState)),
  setGameScore: (addedGameScore: number) =>
    dispatch(setGameScore(addedGameScore)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);
