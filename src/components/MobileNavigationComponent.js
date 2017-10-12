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
        setTimeout(() => { jqApp.mobileMenu.init() }, 0);
    }

    handleLogout(event) {
        event.preventDefault();
        logout(this.props.history, this.props.dispatch);
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
                                    <li className="item_1" ref={"refer_" + this.props.urls.userProfileBase + this.props.user} >
                                        <Link to={this.props.urls.userProfileBase + this.props.user}>
                                            {this.props.labels.profileLabel}
                                        </Link>
                                    </li>
                                    <li className="item_1" ref={"refer_" + this.props.urls.feed} > 
                                        <Link to={this.props.urls.feed}>
                                            {this.props.labels.feedLabel}
                                        </Link>
                                    </li>
                                    <li className="item_1" ref={"refer_" + this.props.urls.browse} >
                                        <Link to={this.props.urls.browse}>
                                            {this.props.labels.browseLabel}
                                        </Link>
                                    </li>
                                    <li className="item_1" ref={"refer_" + this.props.urls.feed}>
                                        <Link to={this.props.urls.settings}>
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
        userProfileBase : "/userProfile/",
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