import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import ShowIf from "../Common/ShowIf";
import {logout} from "../../actions/auth";
import './mobileNavigation.css';

class MobileNavigation extends React.Component {

	handleLogout(event) {
		event.preventDefault();
		this.handleClick();
		this.props.logout();
	}

	handleClick() {

	}

	render() {
		return (
			<ShowIf show={this.props.isUserAuth}>
				<div className="container_mobile">
					<ul className="menu_mobile">
						<li className="menu-item_mobile">
							<Link
								to={this.props.urls.userProfileBase + this.props.user}
								onClick={this.handleClick.bind(this)}
							>
								{this.props.labels.profileLabel}
							</Link>
						</li>
						<li className="menu-item_mobile">
							<Link
								to={this.props.urls.feed}
								onClick={this.handleClick.bind(this)}
							>
								{this.props.labels.feedLabel}
							</Link>
						</li>
						<li className="menu-item_mobile">
							<Link
								to={this.props.urls.browse}
								onClick={this.handleClick.bind(this)}
							>
								{this.props.labels.browseLabel}
							</Link>
						</li>
						<li className="menu-item_mobile">
							<Link
								to={this.props.urls.settings}
								onClick={this.handleClick.bind(this)}
							>
								{this.props.labels.settingsLabel}
							</Link>
						</li>
						<li className="menu-item_mobile">
							<a onClick={this.handleLogout.bind(this)}>
								{this.props.labels.logoutLabel}
							</a>
						</li>
					</ul>
				</div>
			</ShowIf>
		)
	}
}

MobileNavigationComponent.defaultProps = {
	labels: {
		profileLabel: "Profile",
		feedLabel: "Feed",
		browseLabel: "Browse",
		settingsLabel: "Settings",
		logoutLabel: "Logout",
		loginLabel: "Sign in"
	},
	urls: {
		feed: "/feed",
		userProfileBase: "/@",
		settings: "/settings",
		login: "/signin",
		browse: "/browse"
	}
};

const mapStateToProps = (state) => {
	return {
		isUserAuth: !!state.auth.user && !!state.auth.postingKey,
		user: state.auth.user
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		logout: () => {
			dispatch(logout());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileNavigation);
