import React from 'react';
import {connect} from 'react-redux';
import {pushMessage} from '../../actions/pushMessage';
import './follow.css';
import ShowIf from '../Common/ShowIf';
import {changeFollow} from '../../actions/userProfile';
import {changeUserSubscribe} from '../../actions/oneSignal';
import {loadingEllipsis} from '../../utils/loadingEllipsis';

class Follow extends React.Component {

	render() {
		return (
			<div className="container_follow">
				<ShowIf show={this.props.changeFollow}>
					{loadingEllipsis('Pending', 'saving_follow')}
				</ShowIf>
				<ShowIf show={!this.props.changeFollow}>
					<div className={this.props.isFollowed ? 'btn btn-cancel' : 'btn btn-default'}
					     onClick={() => this.props.changeFollowFunc(this.props.profileUserName, this.props.isFollowed)}>
						{this.props.isFollowed ? 'Unfollow' : 'Follow'}
					</div>
				</ShowIf>
				<ShowIf show={this.props.notificationEnabled}>
					<ShowIf show={!this.props.changeSubscribe}>
						<div className={this.props.isSubscribed ? 'unsubscribe_follow' : 'subscribe_follow'}
						     onClick={this.props.changeSubscribeFunc}/>
					</ShowIf>
					<ShowIf show={this.props.changeSubscribe}>
						<div className="subscribing_follow"/>
					</ShowIf>
				</ShowIf>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const profile = state.userProfile.profile || {};
	return {
		username: state.auth.user,
		isFollowed: profile['has_followed'],
		isSubscribed: profile['is_subscribed'],
		profileUserName: profile.username,
		changeFollow: state.userProfile.changeFollow,
		notificationEnabled: !state.oneSignal.error && state.oneSignal.notificationPermission && state.oneSignal.isNotificationsEnabled,
		changeSubscribe: state.userProfile.changeSubscribe
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		changeFollowFunc: (followingName, followed) => {
			dispatch(changeFollow(followingName, followed))
		},
		pushMessage: (message) => {
			dispatch(pushMessage(message))
		},
		changeSubscribeFunc: () => {
			dispatch(changeUserSubscribe())
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Follow);
