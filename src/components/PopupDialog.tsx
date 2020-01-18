import * as React from 'react';

const PopupDialog = (props: any) => {
    return (<div className="popup-dialog">
        <div className="popup-dialog__content">
            <div className="popup-dialog__content--title">{props.title}</div>
            <button className="popup-dialog__content--button">{props.actionName}</button>
        </div>
    </div>
    )
};
export default PopupDialog;