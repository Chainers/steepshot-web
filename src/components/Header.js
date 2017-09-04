import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import LocalizedStrings from './Localization/index.js';
import Search from './Search/index.js';
import { getLanguage, getAllLanguages } from '../actions/localization';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../actions/auth';

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
              <li><Link to="/blog"><i className='glyphicon glyphicon-list-alt'></i> Blog</Link></li>
              <li><Link to="/settings"><i className='glyphicon glyphicon-cog'></i> Settings</Link></li>
              <li className="divider"></li>
              <li><a href="#" onClick={this.handleLogout.bind(this)}><i className='glyphicon glyphicon-log-out'></i> Logout</a></li>
            </ul>
          </li>
          <li className="add-block">
            <Link to="/post"><span className="add-icon glyphicon glyphicon-plus-sign"></span></Link>
          </li>
        </ul>
      )
    }

    if (this.state.isSearchOpen || !!this.props.search.value) {
      searchBlock = <Search />;
    } else {
      browse = <ul className="nav navbar-nav">
        {
          (isUserAuth) ? (
            <li className="nav-item">
              <Link to="/feed" className="nav-link">feed</Link>
            </li>
          ) : null
        }
        <li className="nav-item">
          <Link to="/browse" className="nav-link">browse</Link>
        </li>
      </ul>
    }

    return (
      <nav className="navbar navbar-default header-block">
        <div className="container-fluid">
          <div className="navbar-header header-block">
            <button type="button" className="navbar-toggle nav-bar-toggle-button" data-toggle="collapse"
                    data-target="#myNavbar">
              <img width="60%" src="src/images/50.jpg" alt=""/>
            </button>
            <Link to="/" className="navbar-brand">
              <img width="130px" src="src/images/steepshotLogo.png" alt=""/>
            </Link>
          </div>
          <div className="collapse navbar-collapse" id="myNavbar">
            <ul className="nav navbar-nav">
              <li className="nav-item">
                <button className="navbar-brand nav-bar-buttons search-image-block" type="button"
                        onClick={this.searchClick.bind(this)}>
                  <img className="search-image" width="100%" src="src/images/search.png"/>
                </button>
                {searchBlock}
              </li>
            </ul>
            {browse}
            {rightNav}
          </div>
        </div>
      </nav>
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
