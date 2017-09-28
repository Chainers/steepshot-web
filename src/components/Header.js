import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import LocalizedStrings from './Localization/index.js';
import Search from './Search/index.js';
import {
  getLanguage,
  getAllLanguages
} from '../actions/localization';
import {
  connect
} from 'react-redux';
import PropTypes from 'prop-types';
import {
  logout
} from '../actions/auth';

let localizedStrings = LocalizedStrings.getInstance();

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localize: LocalizedStrings.getInstance(),
      isSearchOpen: false
    };
  }

  componendDidMount() {
    this.setState({isSearchOpen: !!this.props.search.value});
  }

  handleLogout(event) {
    event.preventDefault();
    logout(this.props.history, this.props.dispatch);
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

  searchClick() {
    this.setState({isSearchOpen: !this.state.isSearchOpen})
  }

  render() {
    const active = { borderBottomColor: '#3f51b5' };
    const isUserAuth = this.props.user && this.props.postingKey;
    let searchBlock = <div></div>;
    let browse;
    let authorLink = '';


    let loginComponent = <div className="section login">
      <div className="wrap-login">
        <Link to="/signin" className="btn btn-default btn-xs">
          Sign in
        </Link>
      </div>
    </div>

    if (isUserAuth) {
      authorLink = `/userProfile/${this.props.user}`;
      loginComponent = <div className="section controls">
        <div className="wrap-controls">
          <Link to="/settings" className="btn-control settings"></Link>
          <a onClick={this.handleLogout.bind(this)} className="btn-control logout"></a>
        </div>
      </div>
    }

    if (this.state.isSearchOpen || !!this.props.search.value) {
      searchBlock = <Search />;
    } else {
      browse = <div className="section menu">
        <div className="wrap-menu">
        {
          (isUserAuth) ? (
          <div className="item active">
            <Link to="/feed">Feed</Link>
          </div>
          ) : null 
        }
          <div className="item">
            <Link to="/browse">Browse</Link>
          </div>
        </div>
      </div>
    }

    return (
      <div className="g-header">
        <div className="container">
          <div className="user-panel">
            <div className="wrap-panel clearfix">
              <div className="section hamburger">
                <div className="wrap-hamburger">
                  <button type="button" className="mm-opener">
                    <span className="ico"></span>
                  </button>
                </div>
              </div>
              {loginComponent}
              <div className="section create">
                <div className="wrap-create">
                  <Link to="/post" type="button" className="btn btn-primary btn-xs btn-create">
                    Create post
                  </Link>
                  <button type="button" className="btn btn-primary btn-create-mob"></button>
                </div>
              </div>
              <div className="section user">
                <div className="wrap-user">
                  <Link to={authorLink} className="user-link clearfix">
                    <div className="photo">
                      <img src="/static/images/person.png" alt="user" />
                    </div>
                    <div className="name">{this.props.user}</div>
                  </Link>
                </div>
              </div>
              <div className="section logo">
                <a href="/" className="wrap-logo">
                  <img src="/static/images/logo.svg" alt="logo" />
                </a>
              </div>
              <div className="section search">
                <div className="wrap-search">
                  <a href="#" className="lnk-search">Search</a>
                  <a href="#" className="lnk-search-mob"></a>
                </div>
              </div>
              {browse}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
    history: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    postingKey: state.auth.postingKey,
    user: state.auth.user,
    localization: state.localization,
    search: state.search
  };
};

export default withRouter(connect(mapStateToProps)(Header));
