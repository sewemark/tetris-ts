import React from 'react';
import { Game } from './Game';

class GameBoard extends React.Component {
    private readonly game: Game;
    private intervalId: any;

    constructor(props: any) {
        super(props);
        this.game = new Game;
    }

    componentDidMount() {
        this.renderGameBoard();
        this.game.insertNewPiece();
        //setTimeout(() => this.game.insertNewPiece(), 2000);
        this.intervalId = setInterval(() => {
            this.renderGameBoard();
            this.game.animate();
             }, 500);
        const bindedKeyDownListener = this.escFunction.bind(this);
        document.addEventListener("keydown", bindedKeyDownListener, false);
    }

    escFunction(event: any): void {
        const keyCode = event.keyCode;
        if (keyCode >= 37 && keyCode <= 40) {
            this.game.movePiece(keyCode)
             this.renderGameBoard();
           // clearInterval(this.intervalId);
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
        return (
            <div>
                <canvas style={{ border: '1px solid black' }} ref="canvas" width={this.game.getWidth()} height={this.game.getHeight()} />
            </div>
        )
    }
}
export default GameBoard
    