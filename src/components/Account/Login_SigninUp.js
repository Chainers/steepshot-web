import React from 'react';
import { Link } from 'react-router';
import LocalizedStrings from './../Localization/index.js';
import Login from './Login';

const localizedStrings = LocalizedStrings.getInstance();

const userActive = {
  login: 1,
  signup: 2
};

class LoginSigninUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: userActive.login
    };
  }

  changeToLogin() {
    this.setState({ activeTab: userActive.login });
  }

  changeToSignUp() {
    this.setState({ activeTab: userActive.signup });
  }

  render() {
    let activeTab = <div className="work-block">
      <Login />
    </div>;

    if (this.state.activeTab === userActive.signup) {
      activeTab = <div className="work-block">
        <div className="link-to-sign-page"><Link to="/singup-user">Пользователь</Link></div>
        <div className="link-to-sign-page"><Link to="/signup-club">Клуб</Link></div>
        <div className="link-to-sign-page"><Link to="/signup-trainer">Тренер</Link></div>
        <div className="link-to-sign-page"><Link to="/signup-sho">СОО</Link></div>
      </div>;
    }

    return (
      <div className="login-signup-page">
        <div className="image">
        </div>
        <div className="login-signup-page-block">
          <div className="buttons">
            <button onClick={this.changeToLogin.bind(this)}>Вход</button>
            <button onClick={this.changeToSignUp.bind(this)}>Регистрация</button>
          </div>
          {activeTab}
        </div>
      </div>
    );
  }
}

export default LoginSigninUp;
