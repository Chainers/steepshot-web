import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {logout} from '../actions/auth';
import jqApp from "../libs/app.min";

class MobileNavigationComponent extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		setTimeout(() => {
			jqApp.mobileMenu.init();
		}, 0);
	}

	handleLogout(event) {
		event.preventDefault();
		this.handleClick();
		this.props.logout();
	}

	handleClick() {
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
							{isUserAuth
								?
								<ul className="list_level_1 list-reset js--nav-list">
									<li className="item_1" ref={this.props.urls.userProfileBase + this.props.user}>
										<Link
											to={this.props.urls.userProfileBase + this.props.user}
											onClick={this.handleClick.bind(this)}
										>
											{this.props.labels.profileLabel}
										</Link>
									</li>
									<li className="item_1" ref={this.props.urls.feed}>
										<Link
											to={this.props.urls.feed}
											onClick={this.handleClick.bind(this)}
										>
											{this.props.labels.feedLabel}
										</Link>
									</li>
									<li className="item_1" ref={this.props.urls.browse}>
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
		user: state.auth.user,
		postingKey: state.auth.postingKey,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		logout: () => {
			dispatch(logout());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileNavigationComponent);
