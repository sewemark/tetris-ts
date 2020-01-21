import React from "react";
import { connect } from "react-redux";
import { setGameScore, setGameState } from "../actions";
import { GameLooseEvent } from "../events/GameLooseEvent";
import { LineRemovedEvent } from "../events/LineRemovedEvent";
import { Game, GAME_STATE } from "../game/Game";
import { GameCellPosition } from "../game/GameCellPosition";
import { MovingCellFactory } from "../game/MovingCellFactory";
import { MathUtil } from "../utils/MathUtil";
import PopupDialog from "./PopupDialog";

const LINE_REMOVED_SCORE = 1;
const GAME_BOARD_RENDER_INTERVAL_MS = 500;

class GameBoard extends React.Component {
  private game: Game;
  private intervalId: any;
  private bindedOnArrowsKeyDownListener: EventListener;

  constructor(props: object) {
    super(props);
    this.game = new Game(new MathUtil(), new MovingCellFactory());
    this.bindedOnArrowsKeyDownListener = this.onArrowsKeyDownListener.bind(this);
    this.initGame();
  }

  componentDidMount() {
    this.startGame();
    document.addEventListener("keydown", this.bindedOnArrowsKeyDownListener, false);
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
    this.setShadow(ctx);
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
        this.setShadow(ctx);
        this.game.gameState
          .getCell(i, j)
          .render(ctx, new GameCellPosition(i, j));
      }
    }
  }
  setShadow(ctx: any) {
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 51;
    ctx.shadowOffsetX = 9;
    ctx.shadowOffsetY = 28;
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
          className="gameContainer__gameCanvas"
          ref="canvas"
          width={this.game.getWidth()}
          height={this.game.getHeight()}
        />
      </div>
    );
  }

  private setNewGame() {
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
    }, GAME_BOARD_RENDER_INTERVAL_MS);
  }

  private initGame() {
    this.game = new Game(new MathUtil(), new MovingCellFactory());
    this.game.on(GameLooseEvent.EVENT_NAME, () => {
      (this.props as any).setGameState(GAME_STATE.LOOSE);
      this.renderGameBoard();
      clearInterval(this.intervalId);
    });
    this.game.on(LineRemovedEvent.EVENT_NAME, () => {
      (this.props as any).setGameScore(LINE_REMOVED_SCORE);
    });
  }
}

const mapStateToProps = (state: any) => ({
  game: state.game,
});

const mapDispatchToProps = (dispatch: any) => ({
  setGameScore: (addedGameScore: number) =>
    dispatch(setGameScore(addedGameScore)),
  setGameState: (gameState: string) => dispatch(setGameState(gameState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);
