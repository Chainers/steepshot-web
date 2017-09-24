import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {
  connect
} from 'react-redux'
import {
  login
} from '../../actions/auth';
import {
  facebookLogin,
  twitterLogin,
  googleLogin,
  vkLogin,
  githubLogin
} from '../../actions/oauth';
import Messages from '../Messages';
import steemconnect from 'steemconnect';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      postingKey: '' 
    };
  }

  handleChange(event) {
    this.setState({ 
      [event.target.name]: event.target.value 
    });
  }

  handleLogin(event) {
    event.preventDefault();
    login(this.state.userName, this.state.postingKey, this.props.history, this.props.dispatch)
  }

  handleFacebook() {
    this.props.dispatch(facebookLogin())
  }

  handleTwitter() {
    this.props.dispatch(twitterLogin())
  }

  handleGoogle() {
    this.props.dispatch(googleLogin())
  }

  handleVk() {
    this.props.dispatch(vkLogin())
  }

  handleGithub() {
    this.props.dispatch(githubLogin())
  }

  openRegisterSite() {
    window.open('https://steemit.com/pick_account');
  }

  render() {
    return (
      <div className="col-xs-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
        <div className="lead">Sign in to Steepshot</div>
        <form className="form-login form-horizontal">
          <div className="form-group">
            <div className="input-container col-xs-12">
              <input type="text"
                name="userName"
                id="userName"
                placeholder="userName"
                className="form-control"
                value={this.state.userName}
                onChange={this.handleChange.bind(this)}
              />
              <label for="formNAME" className="name">Name</label>
            </div>
          </div>
          <div className="form-group">
            <div className="input-container col-xs-12">
              <input type="password"
                name="postingKey"
                id="postingKey"
                placeholder="Posting key"
                autoFocus
                className="form-control"
                value={this.state.postingKey}
                onChange={this.handleChange.bind(this)}
              />
              <label for="formPOSTKEY" className="name">Posting Key</label>
            </div>
          </div>
          <div className="form-group">
            <div className="buttons-container col-xs-12">
              <a onClick={this.openRegisterSite} className="btn btn-index">Registration</a>
              <button onClick={this.handleLogin.bind(this)} type="submit" className="btn btn-default">Sign In</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    messages: state.messages
  };
};
export default withRouter(connect(mapStateToProps)(Login));
