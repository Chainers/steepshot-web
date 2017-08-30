import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { login } from '../../actions/auth';
import { facebookLogin, twitterLogin, googleLogin, vkLogin, githubLogin } from '../../actions/oauth';
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
    this.setState({ [event.target.name]: event.target.value });
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

  render() {
    return (
      <div className="col-md-12 sing-container">
        <div className="col-md-4">
          <Messages messages={this.props.messages}/>
          <h2>SignIn</h2>
          <div className="form-group">
            <label htmlFor="email">Username</label>
            <input type="text" name="userName" id="userName" placeholder="userName" autoFocus className="form-control" value={this.state.userName} onChange={this.handleChange.bind(this)}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Posting key</label>
            <input type="password" name="postingKey" id="postingKey" placeholder="Posting key" className="form-control" value={this.state.postingKey} onChange={this.handleChange.bind(this)}/>
          </div>
          <button type="submit" onClick={this.handleLogin.bind(this)} className="btn btn-default">Log in</button>
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
