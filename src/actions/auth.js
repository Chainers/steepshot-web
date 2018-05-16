import steem from 'steem';
import {logLogin} from '../services/logging';
import {push} from 'react-router-redux';
import {getProfile} from "../services/userProfile";
import {pushMessage} from "./pushMessage";
import {hideBodyLoader, showBodyLoader} from "./bodyLoader";
import {checkSubscribeAndUpdateSettings, removeSettings} from "./settings";
import {addNotificationTags, removeNotificationTags} from "../services/oneSignal";
import storage from "../utils/Storage";
import {unsubscribe} from "./oneSignal";

function showMessage(message) {
	return dispatch => {
		dispatch(pushMessage(message));
		dispatch(hideBodyLoader());
	}
}

export function login(username, postingKey) {
	return dispatch => {
		dispatch(showBodyLoader());
		steem.api.getAccounts([username], function (err, result) {
			if (err) {
				dispatch(showMessage('Something went wrong, please, try again later'));

				return false;
			}
			if (result.length === 0) {
				dispatch(showMessage('Such user doesn\'t exist'));
				return false;
			}
			let pubWif = result[0].posting.key_auths[0][0];
			let isValid = false;
			try {
				isValid = steem.auth.wifIsValid(postingKey, pubWif);
			} catch (e) {
				console.log('login failure: ', e);
			}
			if (!isValid) {
				dispatch(showMessage('Invalid username or posting key'));
				return {
					type: 'LOGIN_FAILURE',
					messages: 'Not valid username or posting key'
				};
			}
			const data = JSON.stringify({
				username: username,
				error: ''
			});
			logLogin(data);

			let avatar = getAvatar(result[0]);

			storage.user = username;
			storage.postingKey = postingKey;
			storage.like_power = 100;
			storage.avatar = avatar;
			addNotificationTags(username);
			dispatch(checkSubscribeAndUpdateSettings());
			dispatch({
				type: 'LOGIN_SUCCESS',
				postingKey: postingKey,
				user: username,
				avatar: avatar,
				like_power: 100
			});
			dispatch({
				type: 'UPDATE_VOTING_POWER',
				voting_power: result[0].voting_power / 100
			});
			dispatch(push('/feed'));
			let parseResult = JSON.parse(result[0].json_metadata);
			dispatch(showMessage('Welcome to Steepshot, ' + (parseResult.profile.name || username) + '!'));
		});
	}
}

function getAvatar(profileData) {
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
		storage.user = null;
		storage.postingKey = null;
		storage.settings = null;
		storage.avatar = null;
		storage.like_power = null;
		removeNotificationTags();
		dispatch(logoutUser());
		dispatch(push(`/browse`));
	}
}

export function updateVotingPower(username) {
	return (dispatch) => {
		getProfile(username).then((result) => {
			dispatch({
				type: 'UPDATE_VOTING_POWER',
				voting_power: result.voting_power
			})
		});
	}
}

export function clearVPTimeout(vpTimeout) {
	return (dispatch) => {
		dispatch({
			type: 'VOTING_POWER_TIMEOUT',
			vpTimeout: vpTimeout
		})
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