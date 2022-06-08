import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import './App.css';
import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import PopupWithForm from '../PopupWithForm/PopupWithForm';
import ImagePopup from '../ImagePopup/ImagePopup';
import {api} from '../../utils/Api';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import EditProfilePopup from '../EditProfilePopup/EditProfilePopup';
import EditAvatarPopup from '../EditAvatarPopup/EditAvatarPopup';
import AddPlacePopup from '../AddPlacePopup/AddPlacePopup';
import Login from '../Login/Login';
import Register from '../Register/Register';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import { authorize, register, getContent } from '../../utils/AuthMesto.js'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import success from '../images/success.svg';
import fail from '../images/fail.svg';



function App() {
    const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] =React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [userData, setUserData] = React.useState(null);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [infoToolOpen, setInfoToolOpen] = React.useState(false);
    const [notification, setNotification] = React.useState(false);
    const [cards, setCards] = React.useState([]);
    const [currentUser, setCurrentUser] = React.useState({});
    const history = useHistory();

    function closeAllPopups() {
        setEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setSelectedCard(null);
        setInfoToolOpen(false);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen)
    }
        
    function handleEditProfileClick() {
        setEditProfilePopupOpen(!isEditProfilePopupOpen);
    }
    
    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(!isAddPlacePopupOpen)
    }

    function handleCardClick(item) {
        setSelectedCard(item)
    }

    function handleUpdateUser({name, about}) {
        api.editProfile(name, about).then((res) => {
            setCurrentUser(res);
            closeAllPopups()
        }).catch((err) => {
            console.log(err);
        });
    }

    function handleAddPlaceSubmit({name, link}) {
        api.addCard({name, link}).then((res) => {
            console.log(res)
            setCards([res, ...cards]); 
            closeAllPopups();
        }).catch((err) => {
            console.log(err);
        });
    }

    function handleUpdateAvatar({avatar}) {
        api.updateAvatar(avatar).then((res) => {
            console.log('res', res)
            setCurrentUser(res);
            closeAllPopups()
        }).catch((err) => {
            console.log(err);
        });
    }

    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        }).catch((err) => {
            console.log(err);
        });
    }

    function handleCardDelete(card) {
        const isMyCard = card.owner._id === currentUser._id;
        if (isMyCard) api.deleteCard(card._id).then(() => {
            setCards((state) => state.filter((x) => x._id !== card._id))
        }).catch((err) => {
            console.log(err);
        })
    }

    React.useEffect(() => {
        checkToken();
    }, []);

    React.useEffect(() => {
        if (loggedIn) {
            history.push('/');
            Promise.all([api.getInitialCards(), api.getProfile()])
                .then(([cardInfo, userInfo]) => {
                    setCards(cardInfo);
                    setCurrentUser(userInfo);
                })
                .catch((err) => console.log(err))
                return
        }
    }, [loggedIn])

    const handleLogin = (password, email) => {
        return authorize(email, password)
            .then((data) => {
                if (!data.token) {
                    return;
                }
                localStorage.setItem('token', data.token);
                setUserData({
                    email
                });
                setLoggedIn(true)
            })
            .catch(() => {
                setNotification(false);
                setInfoToolOpen(true);
            })
    }

    const handleRegister = (email, password) => {
        return register(email, password)
            .then((res) => {
                if (res) {
                    setNotification(true);
                    history.push('/sign-in');
                }
            })
            .catch(() => setNotification(false))
            .finally(() => {
                console.log('qqq')
                setInfoToolOpen(true)
            })
    }

    const checkToken = () => {
        const jwt = localStorage.getItem('token');
        if (jwt){
            getContent(jwt)
            .then((res) => {
                if (res){
                    setUserData({
                        email: res.data.email
                    });
                    setLoggedIn(true);
                }
            });
        }
    }

    const handleSignOut = () => {
        localStorage.removeItem('token');
        setLoggedIn(false);
    }

  return (
    <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
        <Header
            userEmail={userData}
            handleSignOut={handleSignOut}
        />
    <Switch>
        
    <ProtectedRoute exact={true} path="/" loggedIn={loggedIn}>
        <Main 
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            />
        <Footer/>
       
    </ProtectedRoute>

    <Route path="/sign-up">
        <Register
            buttonText={'Зарегистрироваться'}
            buttonHeader={'Войти'}
            header={'Регистрация'}
            buttonForm={'Уже зарегистрированы? Войти'}
            handleRegister={handleRegister}
        >  
        </Register>
 
    </Route>

    <Route path="/sign-in">
        <Login
            buttonText={'Войти'}
            buttonHeader={'Регистрация'}
            header={'Вход'}
            handleLogin={handleLogin}
        >
        </Login>

  </Route>

    </Switch>

    <InfoTooltip
                onClose={closeAllPopups}
                isOpen={infoToolOpen}
                name={'info-tool'}
                img={notification ? success : fail}
                text={notification ?
                    'Вы успешно зарегистрировались!'
                    : 'Что-то пошло не так! Попробуйте ещё раз.'}
            />

    <EditProfilePopup 
        opened={isEditProfilePopupOpen} 
        onClose={closeAllPopups} 
        onUpdateUser={handleUpdateUser}
    />

    <AddPlacePopup 
        opened={isAddPlacePopupOpen} 
        onClose={closeAllPopups} 
        onAddCard={handleAddPlaceSubmit}
    />
    <PopupWithForm 
        buttonText={'Да'} 
        name={'delete-confirm'} 
        title={'Вы уверены?'}
    >
        <button className="popup__button popup__button_delete">Да</button>
    </PopupWithForm>
    <EditAvatarPopup 
        opened={isEditAvatarPopupOpen} 
        onClose={closeAllPopups} 
        onUpdateAvatar={handleUpdateAvatar}
    />
    <ImagePopup 
        opened={!!selectedCard}
        card={selectedCard}
        onClose={closeAllPopups}/>

    </div>
    </CurrentUserContext.Provider>
);
}

export default App;