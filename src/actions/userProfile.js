import {push} from "react-router-redux";
import {getStore} from "../store/configureStore";
import Steem from "../services/steem";
import {pushMessage} from "./pushMessage";
import UserService from "../services/userService";

export function getUserProfile(userName) {
	return dispatch => {
		dispatch({
			type: "GET_USER_PROFILE_REQUEST"
		});
		UserService.getProfile(userName).then((result) => {
			dispatch({
				type: 'GET_USER_PROFILE_SUCCESS',
				profile: result
			});
		}).catch(error => {
			dispatch({
				type: 'GET_USER_PROFILE_ERROR',
				error
			});
			dispatch(push('/search/' + userName));
		});
	}
}

export function changeFollow() {
	const state = getStore().getState();
	const followed = state.userProfile.profile['has_followed'];
	const postingKey = state.auth.postingKey;
	const followerName = state.auth.user;
	const followingName = state.userProfile.profile.username;
	return dispatch => {
		dispatch({
			type: 'CHANGE_FOLLOW_REQUEST'
		});
		Steem.followUnfollowUser(postingKey, followerName, followingName, followed).then(() => {
			dispatch(pushMessage(`User has been successfully ${followed ? 'un' : ''}followed`));
			dispatch({
				type: 'CHANGE_FOLLOW_SUCCESS'
			})
		}).catch(error => {
			dispatch(pushMessage(error));
			dispatch({
				type: 'CHANGE_FOLLOW_ERROR',
				error
			})
		})

	}
}