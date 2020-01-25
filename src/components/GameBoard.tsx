import React from "react";
import { connect } from "react-redux";
import { setGameScore, setGameState } from "../actions";
import { GAMEBOARD_CELL_SIZE, GAMEBOARD_COLUMNS, GAMEBOARD_ROWS } from "../common/CanvasConstats";
import { KeyCode } from "../common/KeyCodes";
import { GAME_STATE } from "../game/Game";
import { GameAdapter, IGameAdapter } from "../game/GameAdapter";
import PopupDialog from "./PopupDialog";

class GameBoard extends React.Component {
  private bindedOnArrowsKeyDownListener: EventListener;
  private gameAdapter: IGameAdapter;

  constructor(props: object) {
    super(props);
    this.bindedOnArrowsKeyDownListener = this.onArrowsKeyDownListener.bind(this);
  }

  componentDidMount() {
    this.gameAdapter = new GameAdapter(this.refs.canvas, (this.props as any).setGameScore, (this.props as any).setGameState);
    this.gameAdapter.start();
    document.addEventListener("keydown", this.bindedOnArrowsKeyDownListener, false);
  }

  onArrowsKeyDownListener(event: any): void {
    const keyCode = event.keyCode;
    if (keyCode >= KeyCode.left.value() && keyCode <= KeyCode.down.value()) {
      this.gameAdapter.triggerAction(keyCode);
    }
  }

  render() {
    const gameProps: any = (this.props as any).game;
    return (
      <div className="gameContainer__gameBoard">
        {gameProps.gameState === GAME_STATE.LOOSE ? (
          <PopupDialog setNewGame={() => this.setNewGame.call(this)} actionName="New game" title="You loose" />
        ) : (
          ""
        )}
        <canvas style={{}} className="gameContainer__gameCanvas" ref="canvas" width={this.getWidth()} height={this.getHeight()} />
      </div>
    );
  }

  private setNewGame() {
    (this.props as any).setGameState(GAME_STATE.NEW_GAME);
    this.gameAdapter.start();
  }

  private getWidth(): number {
    return GAMEBOARD_CELL_SIZE * GAMEBOARD_COLUMNS;
  }

  private getHeight(): number {
    return GAMEBOARD_CELL_SIZE * GAMEBOARD_ROWS;
  }
}

const mapStateToProps = (state: any) => ({
  game: state.game,
});

const mapDispatchToProps = (dispatch: any) => ({
  setGameScore: (addedGameScore: number) => dispatch(setGameScore(addedGameScore)),
  setGameState: (gameState: string) => dispatch(setGameState(gameState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);
