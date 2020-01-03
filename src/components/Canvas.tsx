import React from 'react';
import { Game, GAME_STATE } from './Game';
import PopupDialog from './PopupDialog';
import { connect } from 'react-redux'
import { setGameState } from '../actions'

class GameBoard extends React.Component {
    private readonly game: Game;
    private intervalId: any;

    constructor(props: object) {
        super(props);
        this.game = new Game();
        this.game.on('GameLoose', ()=> {
            (this.props as any).setGameState(GAME_STATE.LOOSE);
            this.renderGameBoard();
            clearInterval(this.intervalId);
        })
    }

    componentDidMount() {
        this.renderGameBoard();
        this.game.insertNewPiece();
        this.intervalId = setInterval(() => {
            this.renderGameBoard();
            this.game.animate();
        }, 500);
        const bindedOnArrowsKeyDownListener = this.onArrowsKeyDownListener.bind(this);
        document.addEventListener("keydown", bindedOnArrowsKeyDownListener, false);
    }

    onArrowsKeyDownListener(event: any): void {
        const keyCode = event.keyCode;
        if (keyCode >= 37 && keyCode <= 40) {
            this.game.movePiece(keyCode)
            this.renderGameBoard();
        }
    }

    renderGameBoard() {
        const canvas = this.refs.canvas as any;
        const ctx = canvas.getContext("2d");
        for (let i = 0; i < this.game.GAMEBOARD_COLUMNS; i++) {
            for (let j = 0; j < this.game.GAMEBOARD_ROWS; j++) {
                ctx.beginPath();
                ctx.strokeStyle = "green";
                ctx.lineWidth = "6";
                ctx.rect(i * this.game.GAMEBOARD_CELL_SIZE, j * this.game.GAMEBOARD_CELL_SIZE, this.game.GAMEBOARD_CELL_SIZE, this.game.GAMEBOARD_CELL_SIZE);
                ctx.stroke();
                this.game.gameState.getCell(i, j).render(ctx, i, j);
            }
        }
    }

    render() {
        const gameProps: any = (this.props as any).game;
        return (
            <div>
                {gameProps.gameState === GAME_STATE.LOOSE ? <PopupDialog /> : ''}
                <canvas style={{ border: '1px solid black' }} ref="canvas" width={this.game.getWidth()} height={this.game.getHeight()} />
            </div>
        )
    }
}

const mapStateToProps = (state: any) => ({
    game: state.game,
})
const mapDispatchToProps = (dispatch: any) => ({
    setGameState: (gameState: string) => dispatch(setGameState(gameState))
})

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);
