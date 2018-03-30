import React from 'react';
import {getUserProfile} from '../../actions/profile';
import {getFollowers, getFollowing} from '../../services/posts';
import {connect} from 'react-redux';
import FollowComponent from '../Posts/FollowComponent';
import Constants from '../../common/constants';
import TabsFilterComponent from '../Filters/TabsFilterComponent';
import TabsWrapper from '../Wrappers/TabsWrapper';
import Avatar from '../Common/Avatar/Avatar';
import PostsList from '../PostsList/PostsList';
import UsersList from '../UsersList/UsersList';
import {UserLinkFunc} from '../Common/UserLinkFunc';
import {updateVotingPower} from '../../actions/auth';
import {withWrapper} from "create-react-server/wrapper";
import {addMetaTags, getDefaultTags} from "../../actions/metaTags";
import {push, replace} from 'react-router-redux';

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
		this.state = {
			watcher: props.user,
			authorName: props.username,
			profile: null,
			showFollow: props.showFollow || true,
			itemsPoint: this.insertUsername(Constants.POSTS_FILTERS.POSTS_USER.point,
				props.username),
			followingPoint: this.insertUsername(
				Constants.USERS_FILTERS.FOLLOWING.point, props.username),
			followersPoint: this.insertUsername(
				Constants.USERS_FILTERS.FOLLOWERS.point, props.username),
			yourOrNot: false,
			keys: [
				{label: Constants.POSTS_FILTERS.POSTS_USER.label},
				{label: Constants.USERS_FILTERS.FOLLOWERS.label},
				{label: Constants.USERS_FILTERS.FOLLOWING.label},
			],
			activeItemIndex: 0,
		};
	}

	componentDidMount() {
		this.getUserProfile();
		this.props.updateVotingPower(this.props.user);
	}

	updateActiveTab(index) {
		this.setState({
			activeItemIndex: index,
		});
	}

	getUserProfile(userName) {
		this.setState({
			wrongProfile: false,
			profile: undefined,
		}, () => {
			let showFollow = true;
			userName = userName || this.state.authorName;
			getUserProfile(userName).then((result) => {
				if (result.length === 0) {
					this.props.historyPush('*');
					return;
				}
				if (this.state.watcher === userName || this.state.watcher === undefined) {
					showFollow = false;
				}
				this.setState({
					showFollow: showFollow,
					profile: result,
					avatar: result['profile_image'],
					keys: [
						{label: `${result['post_count']} ${Constants.POSTS_FILTERS.POSTS_USER.label}`},
						{label: `${result['followers_count']} ${Constants.USERS_FILTERS.FOLLOWERS.label}`},
						{label: `${result['following_count']} ${Constants.USERS_FILTERS.FOLLOWING.label}`},
					],
					needsForceRefresh: true,
				}, () => {
					this.filterNav.switchFilter(0);
					this.setState({
						needsForceRefresh: false,
					});
				});
			});
		});
		this.correctText();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.username === this.state.authorName) {
			return;
		}
		this.setState({
			avatar: Constants.NO_AVATAR,
			authorName: nextProps.username,
			itemsPoint: this.insertUsername(Constants.POSTS_FILTERS.POSTS_USER.point,
				nextProps.username),
			followingPoint: this.insertUsername(
				Constants.USERS_FILTERS.FOLLOWING.point, nextProps.username),
			followersPoint: this.insertUsername(
				Constants.USERS_FILTERS.FOLLOWERS.point, nextProps.username)
		});

		this.getUserProfile(nextProps.username);
	}

	insertUsername(point, userName) {
		if (userName === undefined) return point;
		let path = point.split('/');
		return `${path[0]}/${userName}/${path[1]}`;
	}

	correctText() {
		if (window.localStorage.user === undefined || this.props.pathname === undefined) {
			this.setState({yourOrNot: false});
		} else {
			if (window.localStorage.user.replace(/"/g, '') === this.props.pathname.replace('/@', '')) {
				this.setState({yourOrNot: true});
			} else {
				this.setState({yourOrNot: false});
			}
		}
	}

	render() {
		let profileImageSrc = this.state.avatar || Constants.NO_AVATAR;
		let name = '';
		let website = '';
		let about = '';
		let location = '';
		let balance = 0;
		let currentPage = document.location.pathname.replace(/\/@/, '');

		if (this.state.profile) {
			name = this.state.profile.name;
			if (name === undefined || name === '') name = `@${this.state.profile.username}`;
			website = this.state.profile['website'];
			about = <div>
				{UserLinkFunc(null, this.state.profile.about)}
			</div>;
			location = this.state.profile.location;
			balance = this.state.profile['estimated_balance'];
		}
		return (
			<div className="g-main_i container">
				<div className="g-content col-xs-12 clearfix" id="workspace">
					<div className="row">
						<div className="col-xs-12 col-md-4 col-lg-3">
							<div className="user-information">
								<div className="pic-wrap clearfix">
									<Avatar src={profileImageSrc}
													powerIndicator={currentPage === this.props.user}
									/>
									{this.state.showFollow ? <FollowComponent item={this.state.profile}/> : null}
								</div>
								<div className="name">{name}</div>
								<div className="location">{location}</div>
								<p>{about}</p>
								<p className="break--word">
									<a href={website} target="_blank">{website}</a>
								</p>
								<div className="amount">
									<div className="count">$ {balance}</div>
									{
										this.state.yourOrNot
										?
										<div className="description">This is the current amount of
											funds in your account in the
											application.</div>
										:
										<div className="description">This is the current amount of
											funds in user account in the
											application.</div>
									}
								</div>
							</div>
						</div>
						<div className="col-xs-12 col-md-8 col-lg-9 position--unset">
							<div className="user-tabs">
								<TabsFilterComponent
									ref={ref => this.filterNav = ref}
									keys={this.state.keys}
									activeItemIndex={this.state.activeItemIndex}
									updateCallback={this.updateActiveTab.bind(this)}
								/>
								{
									this.state.profile === undefined
										? null
										: <TabsWrapper
											activeTab={this.state.activeItemIndex}
										>
											<PostsList
												point={this.state.itemsPoint}
												className="posts-list clearfix type-2"
												wrapperModifier="clearfix"
												clearPostHeader={true}
											/>
											<UsersList
												point={this.state.followersPoint}
												className="posts-list clearfix type-2"
												getUsers={getFollowers}
											/>
											<UsersList
												point={this.state.followingPoint}
												className="posts-list clearfix type-2"
												getUsers={getFollowing}
											/>
										</TabsWrapper>
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	let postsInfo = state.postsList[Object.keys(state.postsList)[5]];
	console.log(state.auth.settings);
	return {
		pathname: state.router.location.pathname,
		user: state.auth.user,
		postsNumber: postsInfo ? postsInfo.length : 0
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateVotingPower: (username) => {
			dispatch(updateVotingPower(username));
		},
		historyPush: (path) => {
			dispatch(push(path))
		},
		historyReplace: (newPath) => {
			dispatch(replace(newPath))
		}
	}
};

export default withWrapper(connect(mapStateToProps, mapDispatchToProps)(UserProfile));
