import React from 'react';
import {connect} from 'react-redux';
import {pushMessage} from "../../actions/pushMessage";
import './follow.css';
import ShowIf from "../Common/ShowIf";
import {changeFollow} from "../../actions/userProfile";

class Follow extends React.Component {

	render() {

		return (
			<div className="container_follow">
				<ShowIf show={this.props.changeFollow}>
					<div className='saving_follow'>
						Pending
						<span> .</span>
						<span> .</span>
						<span> .</span>
					</div>
				</ShowIf>
				<ShowIf show={!this.props.changeFollow}>
					<div className={this.props.isFollowed ? 'unfollow-button_follow' : 'follow-button_follow'}
							 onClick={this.props.changeFollowFunc}>
						{this.props.isFollowed ? 'Unfollow' : 'Follow'}
					</div>
				</ShowIf>
				<div className={''}/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const profile = state.userProfile.profile || {};
	return {
		username: state.auth.user,
		postingKey: state.auth.postingKey,
		isFollowed: profile['has_followed'],
		isSubscribed: profile['is_subscribed'],
		profileUserName: profile.username,
		changeFollow: state.userProfile.changeFollow
	};
};


const mapDispatchToProps = (dispatch) => {
	return {
		changeFollowFunc: () => {
			dispatch(changeFollow())
		},
		pushMessage: (message) => {
			dispatch(pushMessage(message))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Follow);
