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

export type SetGameScoreType = (lineRemoveScore: number) => void;
export type SetGameStateType = (gameState: string) => void;

export interface IKeyboardPressedListener {
  triggerAction(keyCode: number): void;
}

export interface IGameAdapter extends IKeyboardPressedListener {
  start(): void;
}

export class GameAdapter implements IGameAdapter {
  private game: Game;
  private intervalId: NodeJS.Timeout;
  private pieceMovesAdapter: Map<number, () => void> = new Map();
  private canvasGameRenderer: ICanvasGameRender;
  private setGameScore: SetGameScoreType;
  private setGameState: SetGameStateType;
  private canvas: any;

  constructor(canvas: any, setGameScore: SetGameScoreType, setGameState: SetGameStateType) {
    this.canvas = canvas;
    this.setGameScore = setGameScore;
    this.setGameState = setGameState;
  }

  start(): void {
    this.initDependency();
    this.game.on(GameLooseEvent.EVENT_NAME, () => {
      this.setGameState(GAME_STATE.LOOSE);
      this.canvasGameRenderer.renderGameBoard();
      clearInterval(this.intervalId);
    });

    this.game.on(LineRemovedEvent.EVENT_NAME, () => {
      this.setGameScore(LINE_REMOVED_SCORE);
    });
    this.startGame();
  }

  triggerAction(keyCode: number): void {
    const delegate = this.pieceMovesAdapter.get(keyCode);
    if (delegate) {
      delegate();
    }
    this.canvasGameRenderer.renderGameBoard();
  }

  private startGame() {
    this.canvasGameRenderer.renderGameBoard();
    this.game.insertNewPiece();
    this.intervalId = setInterval(() => {
      this.canvasGameRenderer.renderGameBoard();
      this.game.animate();
    }, GAME_BOARD_RENDER_INTERVAL_MS);
  }

  private initDependency() {
    this.game = new Game(new MathUtil(), new MovingCellFactory());
    this.canvasGameRenderer = new CanvasGameRenderer(this.game, this.canvas.getContext("2d"));
    this.pieceMovesAdapter.set(KeyCode.left.value(), this.game.moveLeft.bind(this.game));
    this.pieceMovesAdapter.set(KeyCode.up.value(), this.game.rotate.bind(this.game));
    this.pieceMovesAdapter.set(KeyCode.right.value(), this.game.moveRight.bind(this.game));
    this.pieceMovesAdapter.set(KeyCode.down.value(), this.game.down.bind(this.game));
  }
}
