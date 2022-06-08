import React from "react";
import PopupWithForm from "../PopupWithForm/PopupWithForm";

function EditAvatarPopup(props) {

    const avatarInput = React.useRef();

    function handleSubmit(e) {
        e.preventDefault();
        props.onUpdateAvatar({
          avatar: avatarInput.current.value
        });
      }

    return (
        <PopupWithForm buttonText={'Сохранить'} name='edit-avatar' title='Обновить аватар' opened={props.opened} onClose={props.onClose} onSubmit={handleSubmit}>
        <input className="popup__input popup__input_type_avatar" ref={avatarInput} type="src" name="avatar" placeholder="Ссылка на картинку" required minLength="2" maxLength="200" id="input_avatar" />
        <span id="input_avatar-error" className="popup__error"></span>
    </PopupWithForm>
    )
}

export default EditAvatarPopup