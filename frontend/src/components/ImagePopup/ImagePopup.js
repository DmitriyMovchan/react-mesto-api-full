import React from "react";

function ImagePopup(props) {
    return <div className={`popup popup_big popup_transition ${props.opened ? "popup_open" : ''}`}>
        <div className="popup__container popup__container_image">
            <button className="popup__close popup__close_big-image" type="button" onClick={props.onClose}></button>
            <img className="popup__image" src={props.card && props.card.link} alt={props.card && props.card.name} />
            <p className="popup__title">{props.card && props.card.name}</p>
        </div>
    </div>
}

export default ImagePopup