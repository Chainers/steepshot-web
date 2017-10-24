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
import LoadingSpinner from '../LoadingSpinner';
import steemconnect from 'steemconnect';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      postingKey: '',
      userNameError: false,
      postingKeyError: false,
      needsLoader: false
    };
  }

  handleChange(event) {
    this.setState({ 
      [event.target.name]: event.target.value,
      userNameError: false,
      postingKeyError: false 
    });
  }

  validate() {
    let valid = true;
    if (this.state.userName == '') {
      this.setState({
        userNameError : true
      });
      valid = false;
    }
    if (this.state.postingKey == '') {
      this.setState({
        postingKeyError : true
      });
      valid = false;
    }
    return valid;
  }

  handleLogin(event) {
    event.preventDefault();
    if (!this.validate()) return false;
    this.setState({
      needsLoader : true
    }, () => {

      const callback = (message) => {
        this.setState({
          needsLoader : false
        }, () => {
          jqApp.pushMessage.open(message);
        });
      }
      
      login(this.state.userName, this.state.postingKey, this.props.history, this.props.dispatch, callback);
    });
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
    let mainContainerClassName = "col-xs-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3";
    if (this.state.needsLoader) {
      mainContainerClassName = mainContainerClassName + " blur-blocker";
    }
    return (
      <div className="container-fluid">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3 lead">Sign in to Steepshot</div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row position--relative">
            {
              this.state.needsLoader
              ?
              <LoadingSpinner />
              :
              null
            }
            <div className={mainContainerClassName}>
              <form className="form-login form-horizontal">
                <div className={this.state.userNameError ? "has-error" : null}>
                  <div className="form-group">
                    <div className="input-container col-xs-12">
                      <input type="text"
                        name="userName"
                        id="userName"
                        className="form-control"
                        value={this.state.userName}
                        onChange={this.handleChange.bind(this)}
                      />
                      <label for="formNAME" className="name">Name</label>
                      <div className="help-block">
                        {
                          this.state.userNameError
                          ?
                            <div className="help-block__notice">Username is required</div>
                          :
                            null
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className={this.state.postingKeyError ? "has-error" : null}>
                  <div className="form-group">
                    <div className="input-container col-xs-12">
                      <input type="password"
                        name="postingKey"
                        id="postingKey"
                        autoFocus
                        className="form-control"
                        value={this.state.postingKey}
                        onChange={this.handleChange.bind(this)}
                      />
                      <label for="formPOSTKEY" className="name">Posting Key</label>
                      <div className="help-block">
                        {
                          this.state.postingKeyError
                          ?
                            <div className="help-block__notice">Posting key is required</div>
                          :
                            null
                        }
                      </div>
                    </div>
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
          </div>
        </div>
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
