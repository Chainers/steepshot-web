import React from 'react';
import { Link } from 'react-router';
import LocalizedStrings from './Localization/index.js';
import Search from './Search/index.js';
import { getLanguage, getAllLanguages } from '../actions/localization';
import { connect } from 'react-redux';

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

  searchClick() {
    this.setState({isSearchOpen: !this.state.isSearchOpen})
  }

  render() {
    let searchBlock = <div></div>;
    let browse;

    if (this.state.isSearchOpen || !!this.props.search.value) {
      searchBlock = <Search />;
    } else {
      browse = <ul className="nav navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">browse</Link>
        </li>
      </ul>
    }


    return (
      <nav className="navbar navbar-default header-block">
        <div className="container-fluid">
          <div className="navbar-header header-block">
            <button type="button" className="navbar-toggle nav-bar-toggle-button" data-toggle="collapse"
                    data-target="#myNavbar">
              <img width="60%" src="/src/images/50.1.jpg" alt=""/>
            </button>
            <Link to="/" className="navbar-brand">
              <img width="130px" src="/src/images/steepshotLogo.png" alt=""/>
            </Link>
          </div>
          <div className="collapse navbar-collapse" id="myNavbar">
            <ul className="nav navbar-nav">
              <li className="nav-item">
                <button className="navbar-brand nav-bar-buttons search-image-block" type="button"
                        onClick={this.searchClick.bind(this)}>
                  <img className="search-image" width="100%" src="/src/images/search.png"/>
                </button>
                {searchBlock}
              </li>
            </ul>
            {browse}
            <ul className="nav navbar-nav navbar-right">
              <li><Link to="/signin">Sign In</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user,
    localization: state.localization,
    search: state.search
  };
};

export default connect(mapStateToProps)(Header);
