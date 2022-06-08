import React from "react";
import { Link } from 'react-router-dom';

function Register(props) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    function handleEmail(e) {
        setEmail(e.target.value)
    }

    function handlePassword(e) {
        setPassword(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.handleRegister(
            password,
            email
        )

    }

    return (
        <div className="page">
            <div className="registration">
                <h2 className="registration__heading">{props.header}</h2>
                <form className="registration__form" onSubmit={handleSubmit}>
                    <fieldset className="registration__content">
                        <input className="registration__input" value={email || ''} onChange={handleEmail} type="text" name="email" placeholder="Email" required minLength="2" maxLength="40" id="input_name" />
                        <span id="input_name-error" className="popup__error"></span>
                        <input className="registration__input" value={password || ''} onChange={handlePassword} type="password" name="password" placeholder="Пароль" required minLength="2" maxLength="200" id="input_profession" />
                        <span id="input_profession-error" className="popup__error"></span>
                    </fieldset>
                    <button className="popup__button popup__button_registration" type="submit">
                            {props.buttonText}
                    </button>
                    <Link to="/sign-in" className="popup__button_log-in">
                            {props.buttonForm}
                    </Link>
                </form>
            </div>
        </div>
    )
}

export default Register;