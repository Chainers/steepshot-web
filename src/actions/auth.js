import {push} from 'react-router-redux';
import {pushErrorMessage, pushMessage} from './pushMessage';
import {hideBodyLoader, showBodyLoader} from './bodyLoader';
import {checkSubscribeAndUpdateSettings, removeSettings} from './settings';
import storage from '../utils/Storage';
import {unsubscribe} from './oneSignal';
import UserService from '../services/userService';
import OneSignalService from '../services/oneSignalService';
import LoggingService from '../services/loggingService';
import ChainService from '../services/chainService';
import {setPostingKeyErrorMessage, setUsernameErrorMessage} from './login';
import {getStore} from '../store/configureStore';
import Constants from '../common/constants';
import StorageSerive from '../services/storageService';

export function showMessage(message) {
	return dispatch => {
		dispatch(pushMessage(message));
		dispatch(hideBodyLoader());
	}
}

function loginError(error) {
	return dispatch => {
		dispatch(pushErrorMessage(error));
		dispatch({
			type: 'LOGIN_ERROR',
			error
		});
		dispatch(hideBodyLoader());
	}
}

export function login(username, postingKey) {
	return dispatch => {
		dispatch(showBodyLoader());
		ChainService.getAccounts(username)
			.then(response => {
				if (response.length === 0) {
					dispatch(setUsernameErrorMessage(Constants.AUTH_WRONG_USER));
					return Promise.reject(Constants.AUTH_WRONG_USER);
				}
				let pubWif = response[0].posting.key_auths[0][0];
				return ChainService.wifIsValid(postingKey, pubWif)
					.then(isValid => {
						if (!isValid) {
							return Promise.reject(Constants.AUTH_WRONG_POSTING_KEY);
						}
						let avatar = getAvatar(response[0]);
						StorageSerive.setAuthData(username, postingKey, avatar, getStore().getState().services.name || Constants.SERVICES.steem.name);
						initOneSignalService(username, dispatch);
						dispatch({
							type: 'LOGIN_SUCCESS',
							postingKey,
							user: username,
							avatar,
							like_power: 100,
							voting_power: response[0].voting_power / 100
						});
						dispatch(push('/feed'));
						dispatch(showMessage(`Welcome to Steepshot, ${username}!`));
						LoggingService.logLogin();
					})
			})
			.catch(error => {
				StorageSerive.clearAuthData();
				if (!error.data && (error.actual === 128 || error.message === Constants.NON_BASE58_CHARACTER)) {
					dispatch(setPostingKeyErrorMessage(Constants.AUTH_WRONG_POSTING_KEY));
					return dispatch(loginError(Constants.AUTH_WRONG_POSTING_KEY));
				}
				dispatch(loginError(error));
			})
	}
}

export function getAvatar(profileData) {
	let avatar = null;
	try {
		const metadata = JSON.parse(profileData.json_metadata);
		avatar = metadata.profile['profile_image'];
	} catch (e) {
	}
	return avatar;
}

function logoutUser() {
	return {
		type: 'LOGOUT_SUCCESS'
	}
}

export function logout() {
	return (dispatch) => {
		dispatch(removeSettings());
		dispatch(unsubscribe());
		StorageSerive.clearAuthData();
		OneSignalService.removeNotificationTags();
		dispatch(logoutUser());
		dispatch(push(`/browse`));
	}
}

export function updateVotingPower(username) {
	return (dispatch) => {
		UserService.getProfile(username)
			.then(result => {
				dispatch({
					type: 'UPDATE_VOTING_POWER',
					voting_power: result.voting_power
				})
			})
			.catch(error => {
				dispatch({
					type: 'UPDATE_VOTING_POWER_ERROR',
					error
				})
			});
	}
}

export function setLikePower(likePower) {
	return (dispatch) => {
		storage.like_power = likePower;
		dispatch({
			type: 'SET_LIKE_POWER',
			like_power: likePower
		})
	}
}

export function setUserAuth() {
	return {
		type: 'SET_USER_AUTH'
	}
}

export function initOneSignalService(username, dispatch) {
	try {
		OneSignalService.addNotificationTags(username);
		dispatch(checkSubscribeAndUpdateSettings());
	} catch (error) {
		console.warn(error.name);
	}
}