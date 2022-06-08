import React from "react";
import logo from '../images/logo.svg';
import { Link } from 'react-router-dom';
import { Switch, Route } from "react-router-dom";

function Header(props) {
    const { email } = props.userEmail || {};
    return <header className="header">
            <img className="header__logo" src={logo} alt="логотип" />
            <div>
                <Switch>
                    <Route exact path="/">
                        <div className="header__out-block">
                            <p className="header__out-block_mail">{email}</p>
                            <button className="header__out-block_out" onClick={props.handleSignOut}>Выйти</button>
                        </div> 
                    </Route>
                    <Route path="/sign-in">
                        <Link to="sign-up" className="header__button">Регистрация</Link>
                    </Route>
                    <Route path="/sign-up">
                        <Link to="sign-in" className="header__button">Вход</Link>
                    </Route>
                </Switch>
            </div>
        </header>
}

export default Header


//{location.pathname === '/' 
//? <div className="header__out-block">
//<p className="header__out-block_mail">{email}</p>
//<button className="header__out-block_out" onClick={props.handleSignOut}>Выйти</button>
//</div> 
//: location.pathname === '/sign-in'
//? <Link to="sign-up" className="header__button">Регистрация</Link>
//: location.pathname === '/sign-up'
//?<Link to="sign-in" className="header__button">Войти</Link>
//: '' 
//}