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
    let rightNav = (
      <ul className="nav navbar-nav navbar-right">
         <li><Link to="/signin">Sign In</Link></li>
      </ul>
    );
    let searchBlock = <div></div>;
    let browse;

    if (isUserAuth) {
      rightNav = (
        <ul className="nav navbar-nav navbar-right">
          <li className="dropdown">
            <a href="#" data-toggle="dropdown" className="navbar-avatar dropdown-toggle">
              <img src={this.props.user.picture || this.props.user.gravatar}/>
              {' '}{this.props.user}{' '}
              <i className="caret"></i>
            </a>
            <ul className="dropdown-menu">
              <li>
                <Link to="/profile">
                  <i className='glyphicon glyphicon-list-alt'></i>
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  <i className='glyphicon glyphicon-cog'></i>
                  Settings
                </Link>
              </li>
              <li className="divider"></li>
              <li>
                <a href="#" onClick={this.handleLogout.bind(this)}>
                  <i className='glyphicon glyphicon-log-out'></i>
                  Logout
                </a>
              </li>
            </ul>
          </li>
          <li className="add-block">
            <Link to="/post">
              <span className="add-icon glyphicon glyphicon-plus-sign"></span>
            </Link>
          </li>
        </ul>
      )
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
              <div className="section controls">
                <div className="wrap-controls">
                  <a href="#" className="btn-control settings"></a>
                  <a href="#" className="btn-control logout"></a>
                </div>
              </div>
              <div className="section create">
                <div className="wrap-create">
                  <button type="button" className="btn btn-primary btn-xs btn-create">
                    <Link to="post">Create post</Link>
                  </button>
                  <button type="button" className="btn btn-primary btn-create-mob"></button>
                </div>
              </div>
              <div className="section user">
                <div className="wrap-user">
                  <a href="#" className="user-link clearfix">
                    <div className="photo">
                      <img src="src/images/tmp/user-photo-small.jpg" alt="user" />
                    </div>
                    <div className="name">{this.props.user}</div>
                  </a>
                </div>
              </div>
              <div className="section logo">
                <a href="/" className="wrap-logo">
                  <img src="src/images/logo.svg" alt="logo" />
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
