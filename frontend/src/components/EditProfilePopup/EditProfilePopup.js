import React from "react";
import PopupWithForm from "../PopupWithForm/PopupWithForm";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

function EditProfilePopup(props) {

    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');

    function handleName(e) {
        setName(e.target.value);
    }

    function handleDescription(e) {
        setDescription(e.target.value);
    }

    // Подписка на контекст
    const currentUser = React.useContext(CurrentUserContext);

    // После загрузки текущего пользователя из API
    // его данные будут использованы в управляемых компонентах.
    React.useEffect(() => {
        if (currentUser) {
            setName(currentUser.name || '');
            setDescription(currentUser.about || 's');
        }
    }, [currentUser, props.opened]);

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();
      
        // Передаём значения управляемых компонентов во внешний обработчик
        props.onUpdateUser({
          name,
          about: description,
        });
      } 

    return (
    <PopupWithForm buttonText={'Сохранить'} name='edit-profile' title='Редактировать профиль' opened={props.opened} onClose={props.onClose} onSubmit={handleSubmit}>
        <input onChange={handleName} value={name || ''} className="popup__input popup__input_type_name" type="text" name="name" placeholder="Введите имя" required minLength="2" maxLength="40" id="input_name" />
        <span id="input_name-error" className="popup__error"></span>
        <input onChange={handleDescription} value={description || ''} className="popup__input popup__input_type_profession" type="text" name="profession" placeholder="Введите род деятельности" required minLength="2" maxLength="200" id="input_profession" />
        <span id="input_profession-error" className="popup__error"></span>
    </PopupWithForm>
    )
}

export default EditProfilePopup