import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {
  connect
} from 'react-redux';
import PropTypes from 'prop-types';
import {
  logout
} from '../actions/auth';

class MobileNavigationComponent extends React.Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {
        setTimeout(() => { 
            jqApp.mobileMenu.init();
            if (this.refs[this.props.location.pathname]) $(this.refs[this.props.location.pathname]).addClass('active')
        }, 0);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.location.pathname == nextProps.location.pathname) return false;    
        if (this.refs[this.props.location.pathname]) $(this.refs[this.props.location.pathname]).removeClass('active');
        if (this.refs[nextProps.location.pathname]) $(this.refs[nextProps.location.pathname]).addClass('active');
        return true;
    }

    handleLogout(event) {
        event.preventDefault();
        jqApp.mobileMenu._menuHide();
        logout(this.props.history, this.props.dispatch);
    }

    handleClick(event) {
        jqApp.mobileMenu._menuHide();
    }

    render() {
        const isUserAuth = this.props.user && this.props.postingKey;
        return (
            <div className="mm">
                <div className="mm-backdrop">
                </div>
                <div className="mm-wrap">
                    <div className="mm-inner">
                        <div className="menu-mobile">
                            { isUserAuth 
                            ?
                                <ul className="list_level_1 list-reset js--nav-list">
                                    <li className="item_1" ref={this.props.urls.userProfileBase + this.props.user} >
                                        <Link 
                                            to={this.props.urls.userProfileBase + this.props.user}
                                            onClick={this.handleClick.bind(this)}
                                        >
                                            {this.props.labels.profileLabel}
                                        </Link>
                                    </li>
                                    <li className="item_1" ref={this.props.urls.feed} > 
                                        <Link 
                                            to={this.props.urls.feed}
                                            onClick={this.handleClick.bind(this)}
                                        >
                                            {this.props.labels.feedLabel}
                                        </Link>
                                    </li>
                                    <li className="item_1" ref={this.props.urls.browse} >
                                        <Link 
                                            to={this.props.urls.browse}
                                            onClick={this.handleClick.bind(this)}
                                        >
                                            {this.props.labels.browseLabel}
                                        </Link>
                                    </li>
                                    <li className="item_1" ref={this.props.urls.settings}>
                                        <Link 
                                            to={this.props.urls.settings}
                                            onClick={this.handleClick.bind(this)}
                                        >
                                            {this.props.labels.settingsLabel}
                                        </Link>
                                    </li>
                                    <li className="item_1">
                                        <a onClick={this.handleLogout.bind(this)}>
                                            {this.props.labels.logoutLabel}
                                        </a>
                                    </li>
                                </ul> 
                            :
                                null
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

MobileNavigationComponent.defaultProps = {
    labels : {
        profileLabel : "Profile",
        feedLabel : "Feed",
        browseLabel : "Browse",
        settingsLabel : "Settings",
        logoutLabel : "Logout",
        loginLabel : "Sign in"
    },
    urls : {
        feed : "/feed",
        userProfileBase : "/@",
        settings : "/settings",
        login : "/signin",
        browse : "/browse"
    }
}

MobileNavigationComponent.propTypes = {
    history: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization,
    user: state.auth.user,
    postingKey: state.auth.postingKey,
  };
};

export default withRouter(connect(mapStateToProps)(MobileNavigationComponent));