import './PopupDialog.scss';
import * as React from 'react';

const PopupDialog = (props: any) => {
    return (<div className="popup-dialog">
        <div className="popup-dialog__content">
            <div className="popup-dialog__content--title">You won</div>
            <button className="popup-dialog__content--button">New Game</button>
        </div>
    </div>
    )
};
export default PopupDialog;