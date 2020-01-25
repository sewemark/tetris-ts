import React from "react";
import { connect } from "react-redux";
import { setGameScore, setGameState } from "../actions";
import { KeyCode } from "../common/KeyCodes";
import { GAME_STATE } from "../game/Game";
import { GameCellPosition } from "../game/GameCellPosition";
import { GameInitializer } from "../game/GameInitializer";
import PopupDialog from "./PopupDialog";

class GameBoard extends React.Component {
  private bindedOnArrowsKeyDownListener: EventListener;
  private gameInitialize: GameInitializer;
  private readonly GAMEBOARD_ROWS = 15;
  private readonly GAMEBOARD_COLUMNS = 10;
  private readonly GAMEBOARD_CELL_SIZE = 50;

  constructor(props: object) {
    super(props);
    this.bindedOnArrowsKeyDownListener = this.onArrowsKeyDownListener.bind(this);
  }

  componentDidMount() {
    this.gameInitialize = new GameInitializer(this.refs.canvas, (this.props as any).setGameScore, (this.props as any).setGameState);
    this.gameInitialize.initGame();
    this.gameInitialize.startGame();
    document.addEventListener("keydown", this.bindedOnArrowsKeyDownListener, false);
  }

  onArrowsKeyDownListener(event: any): void {
    const keyCode = event.keyCode;
    if (keyCode >= KeyCode.left.value() && keyCode <= KeyCode.down.value()) {
      this.gameInitialize.triggerEvent(keyCode);
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
    this.gameInitialize.initGame();
    this.gameInitialize.startGame();
  }

  private getWidth(): number {
    return this.GAMEBOARD_CELL_SIZE * this.GAMEBOARD_COLUMNS;
  }

  private getHeight(): number {
    return this.GAMEBOARD_CELL_SIZE * this.GAMEBOARD_ROWS;
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
