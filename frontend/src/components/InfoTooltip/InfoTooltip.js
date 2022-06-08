import React from 'react';

function InfoTooltip(props) {
    return (
        <div className={`popup popup_transition ${props.isOpen && "popup_open"}`}>
            <div className="popup__container">
                <button type="button" className="popup__close"
                        onClick={props.onClose}>
                </button>
               <img className={"popup__img"} src={props.img} alt={'картинка'}/>
                <h2 className={`popup__title popup__title_${props.name}`}>{props.text}</h2>
            </div>
        </div>
    );
};

export default InfoTooltip;