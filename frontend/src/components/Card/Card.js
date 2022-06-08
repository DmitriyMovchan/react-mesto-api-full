import React from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

function Card({card, onClick, onCardLike, onCardDelete}) {
    const currentUser = React.useContext(CurrentUserContext);

    function handleClick() {
        if (onClick) onClick(card);
    }
    function handleLikeClick() {
        if (onCardLike) onCardLike(card)
    }

    function handleDeleteClick() {
        if (onCardDelete) onCardDelete(card)
    }

    // Определяем, являемся ли мы владельцем текущей карточки
    const isOwn = currentUser && (card.owner._id === currentUser._id);

    // Создаём переменную, которую после зададим в `className` для кнопки удаления
    const cardDeleteButtonClassName = (
    `${isOwn ? 'element__delete' : 'element__delete_hide'}`
    );

    // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
    const isLiked = currentUser && card.likes.some(i => i._id === currentUser._id);

    // Создаём переменную, которую после зададим в `className` для кнопки лайка
    const cardLikeButtonClassName = (
        `${isLiked ? 'mask-group__group_heard mask-group__group_heard_black' : 'mask-group__group_heard'}`
    ); 
    
    return (
        <article className="element">
        <button className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
        <button className="element__button-image" type="submit">
            <img className="element__image" src={card && card.link} alt={card.name} onClick={handleClick}/>
        </button>
        <div className="mask-group"> 
            <h2 className="mask-group__description">{card && card.name}</h2>
            <div className="mask-group__group">
                <button className={cardLikeButtonClassName} type="submit" onClick={handleLikeClick}></button>
                <span className="mask-group__group_count">{card && card.likes.length}</span>
            </div>
        </div>
    </article>
    )
}

export default Card