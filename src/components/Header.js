import React from 'react';
import { Link } from 'react-router';
import LocalizedStrings from './Localization/index.js';
import { getLanguage, getAllLanguages } from '../actions/localization';
import { connect } from 'react-redux';

let localizedStrings = LocalizedStrings.getInstance();

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localize: LocalizedStrings.getInstance()
    };
  }

  handleLogout(event) {
    event.preventDefault();
    this.props.dispatch(logout());
  }

  _changeLanguageEn() {
    event.preventDefault();
    LocalizedStrings.setNewLanguage('en');
    this._dispatch();
    this.forceUpdate();
  }

  _changeLanguageIt() {
    event.preventDefault();
    LocalizedStrings.setNewLanguage('ru');
    this._dispatch();
    this.forceUpdate();
  }

  _dispatch() {
    this.props.dispatch({
      type: 'CHANGE'
    });
  }

  render() {
    return (
      <div>
        <nav id="navigation-panel" className="navbar navbar-toggleable-md navbar-light bg-faded">
          <button className="navbar-toggler navbar-toggler-right nav-bar-buttons" type="button" data-toggle="collapse"
                  data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                  aria-label="Toggle navigation">
            <img src="/src/images/50.jpg" alt=""/>
          </button>
          <div className="collapse navbar-collapse " id="navbarNavDropdown">
            <button className="nav-bar-buttons show-on-small-screen" type="button">
              <img className="" src="/src/images/search.png"/>
            </button>
            <ul className="navbar-nav show-search-on-big-screen">
              <li className="nav-item">
                <a id="search-button" className="nav-link" href="#">1</a>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item">
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/">browse</a>
              </li>
            </ul>
            <ul className="show-on-big-screen navbar-nav">
              <li className="">
                <a className="navbar-brand" href="/">
                  <img src="/src/images/steepshotLogo.png" alt=""/>
                </a>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li>
                <a className="nav-link sign-in-link">Sign In</a>
              </li>
              <li>
                <a className="nav-link">Sign Up</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user,
    localization: state.localization
  };
};

export default connect(mapStateToProps)(Header);
