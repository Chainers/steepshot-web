import React from 'react';
import {connect} from 'react-redux';
import styled, {keyframes} from 'styled-components';
import is from 'styled-is';
import './follow.css';
import ShowIf from '../Common/ShowIf';
import {pushMessage} from '../../actions/pushMessage';
import {changeUserSubscribe} from '../../actions/oneSignal';
import {loadingEllipsis} from '../../utils/loadingEllipsis';
import {changeFollowProfile} from '../../actions/userProfile';

const WrapperFollow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: flex-start;
	
	@media (min-width: 1023px) {
		flex-direction: column;
	}
`;

const bellVibration = keyframes`
  0% {
		transform: rotate(10grad);
	}
	50% {
		transform: rotate(-20grad);
	}
	100% {
		transform: rotate(10grad);
	}
`;

const SubscribingBell = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	margin-left: 10px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	background-size: 16px 18px;
	border: solid 1px #e7e7e7;
	background: url('/images/userProfile/subscribe.svg') no-repeat 10px 10px;
	
	${is('isSubscribed')`
		background: url('/images/userProfile/subscribed.svg') no-repeat 9px 10px;
	`}
	
	${is('changeSubscribe')`
		animation-name: ${bellVibration};
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
	`}
	
	@media (min-width: 1023px) {
		margin: 10px 0 0 0;
	}
`;

class Follow extends React.Component {
	render() {
    const {changingFollowProfile, profileUserName, isFollowed, notificationEnabled,
			changeSubscribe, isSubscribed, changeFollowFunc, changeSubscribeFunc} = this.props;

		return (
			<WrapperFollow>
				<ShowIf show={changingFollowProfile}>
					{loadingEllipsis('Pending', 'saving_follow')}
				</ShowIf>
				<ShowIf show={!changingFollowProfile}>
					<div className={isFollowed ? 'btn btn-cancel' : 'btn btn-default'}
					     onClick={() => changeFollowFunc(profileUserName, isFollowed)}>
						{isFollowed ? 'Unfollow' : 'Follow'}
					</div>
				</ShowIf>
				<ShowIf show={notificationEnabled}>
					<ShowIf show={!changeSubscribe}>
						<SubscribingBell isSubscribed={isSubscribed}
														 changeSubscribe={changeSubscribe}
														 onClick={changeSubscribeFunc}/>
					</ShowIf>
					<ShowIf show={changeSubscribe}>
						<SubscribingBell isSubscribed={isSubscribed}
														 changeSubscribe={changeSubscribe}/>
					</ShowIf>
				</ShowIf>
			</WrapperFollow>
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
    changingFollowProfile: state.userProfile.changingFollowProfile,
		notificationEnabled: !state.oneSignal.error && state.oneSignal.notificationPermission && state.oneSignal.isNotificationsEnabled,
		changeSubscribe: state.userProfile.changeSubscribe
	};
};

const mapDispatchToProps = dispatch => {
	return {
		changeFollowFunc: (followingName, followed) => {
			dispatch(changeFollowProfile(followingName, followed))
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
