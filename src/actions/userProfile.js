import {getStore} from '../store/configureStore';
import {pushMessage} from './pushMessage';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';

export function getUserProfileSuccess(result) {
	return {
		type: 'GET_USER_PROFILE_SUCCESS',
		profile: result
	}
}

export function setUserProfileLoading(loadingUserProfile) {
  return {
    type: 'SET_USER_PROFILE_LOADING',
    loadingUserProfile
  }
}

export function getUserProfile(userName = AuthService.getUsername()) {
	let settings = getStore().getState().settings;
	return dispatch => {
		dispatch({
			type: 'GET_USER_PROFILE_REQUEST'
		});
		UserService.getProfile(userName, settings.show_nsfw, settings.show_low_rated)
			.then(result => {
				dispatch(getUserProfileSuccess(result));
			})
			.catch(error => {
				dispatch({
					type: 'GET_USER_PROFILE_ERROR',
					error
				});
			});
	}
}

export function changeFollow(followingName, followed, component) {
	return dispatch => {
		dispatch({
			type: 'CHANGE_FOLLOW_REQUEST_' + component,
			author: followingName
		});
		UserService.changeFollow(followingName, followed)
			.then(response => {
				dispatch(pushMessage(`User has been successfully ${followed ? 'un' : ''}followed.`));
				dispatch({
					type: 'CHANGE_FOLLOW_SUCCESS',
					response,
					author: followingName
				})
			})
			.catch(error => {
				dispatch(pushMessage(error));
				dispatch({
					type: 'CHANGE_FOLLOW_ERROR',
					error,
					author: followingName
				})
			})
	}
}