import React from "react";
import PopupWithForm from "../PopupWithForm/PopupWithForm";

function AddPlacePopup(props) {

    const [name, setName] = React.useState('');
    const [link, setLink] = React.useState('');

    function handleName(e) {
        setName(e.target.value);
    }

    function handleLink(e) {
        setLink(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.onAddCard({
            name,
            link
        })
    }

    return (
        <PopupWithForm onSubmit={handleSubmit} buttonText={'Сохранить'} name='add-element' title='Новое место' opened={props.opened} onClose={props.onClose}>
        <input onChange={handleName} value={name} className="popup__input popup__input_type_title" type="text" name="name" placeholder="Название" required minLength="2" maxLength="30" id="input_title" />
        <span id="input_title-error" className="popup__error"></span>
        <input onChange={handleLink} value={link} className="popup__input popup__input_type_link" type="url" name="description" placeholder="Ссылка на картинку" required id="input_link" />
        <span id="input_link-error" className="popup__error"></span>
    </PopupWithForm>
    )
}

export default AddPlacePopup;