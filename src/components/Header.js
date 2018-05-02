import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {clearVPTimeout, logout, setUserAuth, updateVotingPower} from '../actions/auth';
import Constants from '../common/constants';
import Avatar from './Common/Avatar/Avatar';
import jqApp from "../libs/app.min";
import {setSearchPanelState, setSearchValue} from "../actions/search";
import {baseBrowseFilter} from "../routes";
import {push} from "react-router-redux";

class Header extends React.Component {

	constructor(props) {
		super(props);
		if (!global.isServerSide) {
			props.setUserAuth();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isOpened) {
			this.searchInput.focus();
		}
	}

	handleLogout(event) {
		event.preventDefault();
		this.props.logout();
	}

	searchKeyPress(e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (e.target.value === '') {
				return;
			}
			this.props.historyPush(`/search/${this.props.searchValue}`);
			if (document.getElementsByTagName('body')[0].classList.value === 'mm-open') {
        jqApp.mobileMenu._menuHide();
			}
		}
	}

	searchHandleChange(e) {
		let value = e.target.value.toLowerCase();
		this.props.setSearchValue(value.replace(/[^\w-.]/g, ''));
	}

	render() {
		if (global.isServerSide) {
			return null;
		}
		const isUserAuth = this.props.user && this.props.postingKey;
		let browse;
		let authorLink = '';
		let authorImage = this.props.avatar || Constants.NO_AVATAR;
		let loginComponent = <div className="section login">
			<div className="wrap-login">
				<Link to="/signin" className="btn btn-default btn-xs">
					Sign in
				</Link>
			</div>
		</div>;

		if (isUserAuth) {
			authorLink = `/@${this.props.user}`;
			loginComponent = <div className="section controls">
				<div className="wrap-controls">
					<Link to="/settings" className="btn-control settings"/>
					<a onClick={this.handleLogout.bind(this)}
						 className="btn-control logout"> </a>
				</div>
			</div>;
		}

		browse = <div className="section menu">
			<div className="wrap-menu">
				{
					(isUserAuth) ? (
						<div className="item nav-item">
							<Link to="/feed">Feed</Link>
						</div>
					) : null
				}
				<div className="item nav-item">
					<Link to={`/browse/${baseBrowseFilter()}`}>Browse</Link>
				</div>
			</div>
		</div>;

		return (
			<header className="g-header">
				<div className="container">
					<div className={'user-panel ' + (this.props.isOpened ? 'closed' : 'open')}>
						<div className="wrap-panel clearfix">
							{
								isUserAuth
									? <div className="section hamburger">
										<div className="wrap-hamburger">
											<button type="button" className="mm-opener">
												<span className="ico"/>
											</button>
										</div>
									</div>
									: null
							}
							{loginComponent}
							<div className="section create">
								<div className="wrap-create">
									{
										isUserAuth
											? <div>
												<Link to="/editPost" type="button"
															className="btn btn-default btn-xs btn-create">
													Create post
												</Link>
												<Link to="/editPost" type="button"
															className="btn btn-default btn-create-mob"
															onClick={() => {
																jqApp.mobileMenu._menuHide();
															}}
												/>
											</div>
											: null
									}
								</div>
							</div>
							<div className="section user">
								{
									this.props.user
										? <Link to={authorLink} className="user-link clearfix">
											<div className="photo">
												<Avatar src={authorImage}
																powerIndicator={true}
																headerAvatar={true}
												/>
											</div>
											<div className="name">{this.props.user}</div>
										</Link>
										: null
								}
							</div>
							<div className="section logo">
								<a href="/" className="wrap-logo">
									<img src="/images/steepshotLogo@2x.svg" alt="logo"/>
								</a>
							</div>
							<div className="section search">
								<div className="wrap-search" onClick={() => {this.props.setSearchPanelState(true)}}>
									<span className="lnk-search">Search</span>
									<span className="lnk-search-mob"> </span>
								</div>
							</div>
							{browse}
						</div>
					</div>
					<div className={'search-panel ' + (this.props.isOpened ? 'open' : 'closed')}>
						<div className="wrap-panel container clearfix">
							<div className="wrap-btn">
								<button type="button" className="btn-close" onClick={() => {
									this.props.setSearchValue("");
									this.props.setSearchPanelState(false);
								}}/>
							</div>
							<div className="wrap-search">
								<form className="form-search">
									<input
										type="text"
										name="search"
										value={this.props.searchValue}
										ref={ref => this.searchInput = ref}
										onChange={this.searchHandleChange.bind(this)}
										required={true}
										placeholder={
											this.props.sizeParam
												? Constants.SEARCH_PLACEHOLDER_MIN
												: Constants.SEARCH_PLACEHOLDER
										}
										className="input-search"
										onKeyPress={this.searchKeyPress.bind(this)}
									/>
								</form>
							</div>
						</div>
					</div>
				</div>
			</header>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		logout: () => {
			dispatch(logout())
		},
		updateVotingPower: (username) => {
			dispatch(updateVotingPower(username));
		},
		clearVPTimeout: (vpTimeout) => {
			dispatch(clearVPTimeout(vpTimeout));
		},
		setUserAuth: () => {
			dispatch(setUserAuth());
		},
		setSearchValue: (value) => {
			dispatch(setSearchValue(value));
		},
		historyPush: (path) => {
			dispatch(push(path));
		},
		setSearchPanelState: (flag) => {
			dispatch(setSearchPanelState(flag));
		}
	}
};

const mapStateToProps = (state) => {
	return {
		sizeParam: document.body.clientWidth < 420,
		postingKey: state.auth.postingKey,
		user: state.auth.user,
		avatar: state.auth.avatar,
		vpTimeout: state.auth.vpTimeout,
		searchValue: state.search.value,
		isOpened: state.search.isOpened
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
