import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import { signup } from '../../actions/auth';
import { facebookLogin, twitterLogin, googleLogin, vkLogin, githubLogin } from '../../actions/oauth';
import Messages from '../Messages';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      poskingKey: '',
      password: ''
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSignup(event) {
    event.preventDefault();
    // this.props.dispatch(signup(this.state.userName, this.state.poskingKey, this.state.password));
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
          <h2>SignUp</h2>
          <div className="form-group">
            <label htmlFor="email">Username</label>
            <input type="text" name="userName" id="userName" placeholder="userName" autoFocus className="form-control" value={this.state.userName} onChange={this.handleChange.bind(this)}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" placeholder="Password" className="form-control" value={this.state.password} onChange={this.handleChange.bind(this)}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Posting Key</label>
            <input type="password" name="poskingKey" id="poskingKey" placeholder="Posting Key" className="form-control" value={this.state.poskingKey} onChange={this.handleChange.bind(this)}/>
          </div>
          <button type="submit" onClick={this.handleSignup.bind(this)} className="btn btn-default">Sign up</button>
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

export default connect(mapStateToProps)(Signup);
