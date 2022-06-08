import React from "react";

function PopupWithForm(props) {

    function onClick() {
        if (props.onClose && typeof props.onClose === 'function') props.onClose();
    }

    return <div className={`popup popup_transition popup_${props.name} ${props.opened && "popup_open"}`}>
    <div className="popup__container">
        <button className="popup__close" type="button" onClick={onClick}></button>
        <h2 className="popup__heading">{props.title}</h2>
        <form className={`popup__form popup__form_${props.name}`} name={props.name} onSubmit={props.onSubmit}>
            <fieldset className="popup__content">
                {props.children}
            </fieldset>
            <button className="popup__button" type="submit">
                    {props.buttonText}
                </button>
        </form>
    </div>
</div>
}

export default PopupWithForm 