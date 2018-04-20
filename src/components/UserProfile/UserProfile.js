import React from 'react';
import {getFollowers, getFollowing} from '../../services/posts';
import {connect} from 'react-redux';
import FollowComponent from '../Posts/FollowComponent';
import Constants from '../../common/constants';
import Avatar from '../Common/Avatar/Avatar';
import PostsList from '../PostsList/PostsList';
import UsersList from '../UsersList/UsersList';
import {UserLinkFunc} from '../Common/UserLinkFunc';
import {withWrapper} from "create-react-server/wrapper";
import {addMetaTags, getDefaultTags} from "../../actions/metaTags";
import {push, replace} from 'react-router-redux';
import TabsBar from "../Common/TabsBar/TabsBar";
import Tab from "../Common/TabsBar/Tab/Tab";
import {getUserProfile} from "../../actions/userProfile";
import ShowIf from "../Common/ShowIf";
import LoadingSpinner from "../LoadingSpinner";
import './userProfile.css';

class UserProfile extends React.Component {

	static async getInitialProps({location, req, res, store}) {
		if (!req || !location || !store) {
			return {};
		}
		await store.dispatch(addMetaTags(getDefaultTags(req.hostname, location.pathname)));
		return {};
	}

	constructor(props) {
		super(props);
		this.props.getUserProfile(props.username);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.username !== this.props.username) {
			this.props.getUserProfile(nextProps.username);
		}
	}

	render() {
		if (global.isServerSide) {
			return null;
		}
		if (this.props.loading || !this.props.profile) {
			return (
				<div className="con-spi_use-pro">
					<LoadingSpinner/>
				</div>);
		}

		let name = this.props.profile.name || `@${this.props.profile.username}`;
		let website = this.props.profile['website'];
		let about = UserLinkFunc(null, this.props.profile.about);
		let location = this.props.profile.location;
		let balance = this.props.profile['estimated_balance'];
		let avatar = this.props.profile['profile_image'];
		return (
			<div className="g-main_i container">
				<div className="g-content col-xs-12 clearfix" id="workspace">
					<div className="row">
						<div className="col-xs-12 col-md-4 col-lg-3">
							<div className="user-information">
								<div className="pic-wrap clearfix">
									<Avatar src={avatar}
													powerIndicator={this.props.isYourProfile}
									/>
									<ShowIf show={!this.props.isYourProfile}>
										<FollowComponent item={this.props.profile}/>
									</ShowIf>
								</div>
								<div className="name">{name}</div>
								<div className="location">{location}</div>
								<p>{about}</p>
								<p className="break--word">
									<a href={website} target="_blank">{website}</a>
								</p>
								<div className="amount">
									<div className="count">$ {balance}</div>
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
											className="posts-list clearfix type-2"
											wrapperModifier="clearfix"
											clearPostHeader={true}
										/>
								</Tab>
								<Tab name={this.props.profile['following_count'] + ' ' + Constants.USERS_FILTERS.FOLLOWING.label}>
										<UsersList
											point={insertUsername(Constants.USERS_FILTERS.FOLLOWING.point, this.props.username)}
											className="posts-list clearfix type-2"
											getUsers={getFollowers}
										/>
								</Tab>
								<Tab name={this.props.profile['followers_count'] + ' ' + Constants.USERS_FILTERS.FOLLOWERS.label}>
										<UsersList
											point={insertUsername(Constants.USERS_FILTERS.FOLLOWERS.point, this.props.username)}
											className="posts-list clearfix type-2"
											getUsers={getFollowing}
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
		profile: state.userProfile.profile,
		loading: state.userProfile.loading,
		pathname: location.pathname,
		isYourProfile: watcher === username,
		watcher
	};
};

function insertUsername(point, userName) {
	if (userName === undefined) return point;
	let path = point.split('/');
	return `${path[0]}/${userName}/${path[1]}`;
}

const mapDispatchToProps = (dispatch) => {
	return {
		historyPush: (path) => {
			dispatch(push(path))
		},
		historyReplace: (newPath) => {
			dispatch(replace(newPath))
		},
		getUserProfile: (userName) => {
			dispatch(getUserProfile(userName));
		}
	}
};

export default withWrapper(connect(mapStateToProps, mapDispatchToProps)(UserProfile));
