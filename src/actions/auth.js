import fakeAuth from '../components/Routes/fakeAuth';
import steem from 'steem';
import Constants from '../common/constants';
import {logLogin} from './logging';
import {getUserProfile} from './profile';
import {baseBrowseFilter} from "../routes";
import {push} from 'react-router-redux';

export function login(username, postingKey, dispatch, callback) {

	steem.api.getAccounts([username], function (err, result) {
		if (err) {
			callback('Something went wrong, please, try again later');
			const data = JSON.stringify({
				username: username,
				error: err
			});
			logLogin(data);
			return false;
		}
		if (result.length === 0) {
			callback('Such user doesn\'t exist');
			return false;
		}
		let pubWif = result[0].posting.key_auths[0][0];
		let isValid = false;
		try {
			isValid = steem.auth.wifIsValid(postingKey, pubWif);
		}
		catch (e) {
			console.log('login failure: ', e);
		}
		if (!isValid) {
			callback('Invalid username or posting key');
			return {
				type: 'LOGIN_FAILURE',
				messages: 'Not valid username or posting key'
			};
		} else {
			const data = JSON.stringify({
				username: username,
				error: ''
			});
			logLogin(data);

			let welcomeName = username;
			let metadata;
			localStorage.setItem('user', JSON.stringify(username));
			localStorage.setItem('postingKey', JSON.stringify(postingKey));
			localStorage.setItem('settings', JSON.stringify({
				[Constants.SETTINGS.show_low_rated]: false,
				[Constants.SETTINGS.show_nsfw]: false
			}));
			localStorage.setItem('like_power', '100');
			let avatar = null;
			if (result[0])
				if (result[0].json_metadata !== "" && result[0].json_metadata !== undefined) {
					metadata = JSON.parse(result[0].json_metadata);
					if (metadata.profile)
						if (metadata.profile['profile_image'] !== "" && metadata.profile['profile_image'] !== undefined) {
							avatar = metadata.profile['profile_image'];
						}
				}
			localStorage.setItem('avatar', JSON.stringify(avatar));

			if (metadata)
				if (metadata.profile)
					if (metadata.profile.name) {
						welcomeName = metadata.profile.name;
					}

			let settings = {
				[Constants.SETTINGS.show_low_rated]: false,
				[Constants.SETTINGS.show_nsfw]: false
			};
			callback('Welcome to Steepshot, ' + welcomeName + '!');
			dispatch({
				type: 'LOGIN_SUCCESS',
				postingKey: postingKey,
				user: username,
				avatar: avatar,
				settings: settings,
				like_power: 100
			});
			let clearTimeout = setInterval(() => {
				getUserProfile(username).then((result) => {
					dispatch({
						type: 'UPDATE_VOTING_POWER',
						voting_power: result.voting_power
					})
				});
			}, 30000);
			getUserProfile(username).then((result) => {
				dispatch({
					type: 'UPDATE_VOTING_POWER',
					voting_power: result.voting_power
				})
			});
			dispatch({
				type: 'VOTING_POWER_TIMEOUT',
				vpTimeout: clearTimeout
			});
			setTimeout(function () {
				fakeAuth.authenticate(() => dispatch(push('/feed')));
			}, 1);
		}
	});
}

function logoutUser() {
	return {
		type: 'LOGOUT_SUCCESS'
	}
}

export function logout() {
	return (dispatch) => {
		localStorage.removeItem('user');
		localStorage.removeItem('postingKey');
		localStorage.removeItem('settings');
		localStorage.removeItem('avatar');
		localStorage.removeItem('like_power');
		dispatch(logoutUser());
		fakeAuth.signout(() => dispatch(push(`/browse/${baseBrowseFilter()}`)));
	}
}

export function updateVotingPower(username) {
	return (dispatch) => {
		getUserProfile(username).then((result) => {
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
		localStorage.setItem('like_power', JSON.stringify(likePower));
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