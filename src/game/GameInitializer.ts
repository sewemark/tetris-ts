import { KeyCode } from "../common/KeyCodes";
import { GameLooseEvent } from "../events/GameLooseEvent";
import { LineRemovedEvent } from "../events/LineRemovedEvent";
import { MathUtil } from "../utils/MathUtil";
import { Game, GAME_STATE } from "./Game";
import { MovingCellFactory } from "./MovingCellFactory";
import { CanvasGameRenderer } from "./render/CanvasGameRenderer";
import { ICanvasGameRender } from "./render/ICanvasGameRender";

const LINE_REMOVED_SCORE = 1;
const GAME_BOARD_RENDER_INTERVAL_MS = 500;

export class GameInitializer {
  private game: Game;
  private intervalId: any;
  private pieceMovesAdapter: Map<number, () => void> = new Map();
  private canvasGameRenderes: ICanvasGameRender;
  setGameScore: any;
  setGameState: any;
  canvas: any;

  constructor(canvas: any, setGameScore: any, setGameState: any) {
    this.canvas = canvas;
    this.game = new Game(new MathUtil(), new MovingCellFactory());
    this.canvasGameRenderes = new CanvasGameRenderer(this.game, canvas);
    this.pieceMovesAdapter.set(KeyCode.left.value(), this.game.moveLeft.bind(this.game));
    this.pieceMovesAdapter.set(KeyCode.up.value(), this.game.rotate.bind(this.game));
    this.pieceMovesAdapter.set(KeyCode.right.value(), this.game.moveRight.bind(this.game));
    this.pieceMovesAdapter.set(KeyCode.down.value(), this.game.down.bind(this.game));
    this.setGameScore = setGameScore;
    this.setGameState = setGameState;
  }

  initGame() {
    this.game = new Game(new MathUtil(), new MovingCellFactory());
    this.canvasGameRenderes = new CanvasGameRenderer(this.game, this.canvas);
    this.pieceMovesAdapter.set(KeyCode.left.value(), this.game.moveLeft.bind(this.game));
    this.pieceMovesAdapter.set(KeyCode.up.value(), this.game.rotate.bind(this.game));
    this.pieceMovesAdapter.set(KeyCode.right.value(), this.game.moveRight.bind(this.game));
    this.pieceMovesAdapter.set(KeyCode.down.value(), this.game.down.bind(this.game));
    this.game.on(GameLooseEvent.EVENT_NAME, () => {
      this.setGameState(GAME_STATE.LOOSE);
      this.canvasGameRenderes.renderGameBoard();
      clearInterval(this.intervalId);
    });

    this.game.on(LineRemovedEvent.EVENT_NAME, () => {
      this.setGameScore(LINE_REMOVED_SCORE);
    });
  }

  startGame() {
    this.canvasGameRenderes.renderGameBoard();
    this.game.insertNewPiece();
    this.intervalId = setInterval(() => {
      this.canvasGameRenderes.renderGameBoard();
      this.game.animate();
    }, GAME_BOARD_RENDER_INTERVAL_MS);
  }

  triggerEvent(keyCode: number) {
    const delegate = this.pieceMovesAdapter.get(keyCode);
    if (delegate) {
      delegate();
    }
    this.canvasGameRenderes.renderGameBoard();
  }
}
