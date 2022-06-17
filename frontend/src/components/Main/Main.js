import React from "react";
import Card from "../Card/Card";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";



function Main(props) {

    const currentUser = React.useContext(CurrentUserContext);  
    
    return <main className="content">
    <section className="profile">
        <button className="profile__avatar-button" onClick={props.onEditAvatar}>
        <img className="profile__avatar" src={currentUser && currentUser.avatar} /* style={{ backgroundImage: `url(${userAvatar})` }}*/ alt="аватар" />
        <div className="profile__avatar profile__avatar_hover"></div>
    </button>
        <div className="profile__info">
            <h1 className="profile__name">{currentUser && currentUser.name/*userProfile.name*/}</h1>
            <button className="profile__edit-button" onClick={props.onEditProfile} type="button" aria-label="Редактировать"></button>
            <p className="profile__profession">{currentUser && currentUser.about/*userProfile.about*/}</p>
        </div>
        <button className="profile__add-button" onClick={props.onAddPlace}  type="button"></button>
    </section>
    <section className="elements">

        {
            props.cards.map(item => {
                return(
                <Card
                key={item._id}
                card={item}
                onClick={props.onCardClick}
                onCardLike={props.onCardLike}
                onCardDelete={props.onCardDelete}
                ></Card>)
            })
        }
    </section>

</main>
}

export default Main