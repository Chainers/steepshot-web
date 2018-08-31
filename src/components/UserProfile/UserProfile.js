import React from 'react';
import {connect} from 'react-redux';
import Constants from '../../common/constants';
import Avatar from '../Common/Avatar';
import PostsList from '../PostsList/PostsList';
import UsersList from '../UsersList/UsersList';
import {push, replace} from 'react-router-redux';
import TabsBar from '../Common/TabsBar/TabsBar';
import Tab from '../Common/TabsBar/Tab/Tab';
import {getUserProfile, setUserProfileLoading} from '../../actions/userProfile';
import ShowIf from '../Common/ShowIf';
import LoadingSpinner from '../LoadingSpinner';
import './userProfile.css';
import {setActiveIndex} from '../../actions/tabsBar';
import Follow from '../Follow/Follow';
import AuthService from '../../services/AuthService';
import renderHTML from 'react-render-html';
import MarkdownParser from '../../utils/markdownParser';
import VotingPower from '../Common/VotingPower';

class UserProfile extends React.Component {

	constructor(props) {
		super();
		props.getUserProfile(props.username);
	}

	componentWillUnmount() {
		this.props.setUserProfileLoading(true);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.username !== this.props.username) {
			this.props.getUserProfile(nextProps.username);
			this.props.setActiveIndex('userProfile', 0);
		}
	}

	render() {
		if (this.props.loadingUserProfile || !this.props.profile) {
			return (
				<div className="con-spi_use-pro">
					<LoadingSpinner/>
				</div>);
		}
		let name = this.props.profile.name || `@${this.props.profile.username}`;
		let website = this.props.profile['website'];
		let location = this.props.profile.location;
		let balance = this.props.profile['estimated_balance'];
		return (
			<div className="container">
				<div className="g-content col-xs-12 clearfix" id="workspace">
					<div className="row">
						<div className="col-xs-12 col-md-4 col-lg-3">
							<div className="user-information">
								<div className="pic-wrap clearfix">
									<ShowIf show={this.props.isYourProfile}>
										<VotingPower src={this.props.profile['profile_image']}
										             sizes={Constants.USER_PROFILE_AVATAR_SIZE}/>
									</ShowIf>
									<ShowIf show={!this.props.isYourProfile}>
										<Avatar src={this.props.profile['profile_image']}
										        size={Constants.USER_PROFILE_AVATAR_SIZE}
										/>
										<ShowIf show={this.props.isAuth}>
											<Follow/>
										</ShowIf>
									</ShowIf>
								</div>
								<div className="name">{name}</div>
								<div className="location">{location}</div>
								<p
									className="word-wrap_brake-word">{renderHTML(MarkdownParser.parseTitle(this.props.profile.about))}</p>
								<p className="break--word">
									<a className="website_use-pro" href={website} target="_blank">{website}</a>
								</p>
								<div className="amount">
									<div className="balance_use-pro">$ {balance}</div>
									<ShowIf show={this.props.isYourProfile}>
										<div className="description">This is the current amount of
											funds in your account in the
											application.
										</div>
									</ShowIf>
									<ShowIf show={!this.props.isYourProfile}>
										<div className="description">This is the current amount of
											funds in user account in the
											application.
										</div>
									</ShowIf>
								</div>
							</div>
						</div>
						<div className="col-xs-12 col-md-8 col-lg-9 position--unset">
							<TabsBar point="userProfile" showLoader={false}>
								<Tab name={this.props.profile['post_count'] + ' ' + Constants.POSTS_FILTERS.POSTS_USER.label}>
									<PostsList
										point={insertUsername(Constants.POSTS_FILTERS.POSTS_USER.point, this.props.username)}
										wrapperModifier="posts-list clearfix type-2"
										clearPostHeader={true}
										isComponentVisible={this.props.activeIndex === 0}
									/>
								</Tab>
								<Tab name={this.props.profile['following_count'] + ' ' + Constants.USERS_FILTERS.FOLLOWING.label}>
									<UsersList
										point={insertUsername(Constants.USERS_FILTERS.FOLLOWING.point, this.props.username)}
										className="posts-list clearfix type-2"
										isComponentVisible={this.props.activeIndex === 1}
									/>
								</Tab>
								<Tab name={this.props.profile['followers_count'] + ' ' + Constants.USERS_FILTERS.FOLLOWERS.label}>
									<UsersList
										point={insertUsername(Constants.USERS_FILTERS.FOLLOWERS.point, this.props.username)}
										className="posts-list clearfix type-2"
										isComponentVisible={this.props.activeIndex === 2}
									/>
								</Tab>
							</TabsBar>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	const watcher = state.auth.user;
	const username = props.match.params.username || watcher;
	const location = state.router.location || props.location || {};
	return {
		username,
		isAuth: AuthService.isAuth(),
		profile: state.userProfile.profile,
		loadingUserProfile: state.userProfile.loadingUserProfile,
		pathname: location.pathname,
		isYourProfile: watcher === username,
		watcher,
		activeIndex: state.tabsBar.userProfile.activeIndex
	};
};

function insertUsername(point, userName) {
	if (userName === undefined) return point;
	let path = point.split('/');
	return `${path[0]}/${userName}/${path[1]}`;
}

const mapDispatchToProps = (dispatch) => {
	return {
		historyPush: path => {
			dispatch(push(path));
		},
		historyReplace: newPath => {
			dispatch(replace(newPath));
		},
		getUserProfile: userName => {
			dispatch(getUserProfile(userName));
		},
		setActiveIndex: (point, index) => {
			dispatch(setActiveIndex(point, index));
		},
		setUserProfileLoading: loadingUserProfile => {
			dispatch(setUserProfileLoading(loadingUserProfile));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
