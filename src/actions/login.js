import {push} from "react-router-redux";
import {hideBodyLoader, showBodyLoader} from "./bodyLoader";
import LoggingService from "../services/loggingService";
import storage from "../utils/Storage";
import ChainService from "../services/chainService";
import {getAvatar, initOneSignalService, showMessage} from "./auth";
import {pushErrorMessage} from "./pushMessage";

export function setUsernameErrorMessage(message = '') {
	return {
		type: 'SET_USERNAME_ERROR_MESSAGE',
		message
	}
}

export function setPostingKeyErrorMessage(message = '') {
	return {
		type: 'SET_POSTING_KEY_ERROR_MESSAGE',
		message
	}
}

export function clearLoginErrors() {
	return {
		type: 'CLEAR_LOGIN_ERROR'
	}
}

export function loginWithSteemConnect(params) {
	const username = params.username;
	const expiresIn = params['expires_in'];
	const accessToken = params['access_token'];
	return dispatch => {
		dispatch(showBodyLoader());
		if (!username || !expiresIn || !accessToken) {
			dispatch(push('/login'));
			return {
				type: 'LOGIN_WITH_STEEM_CONNECT_ERROR',
				params
			};
		}
		ChainService.getAccounts(username)
			.then(response => {
				const service = '';
				let avatar = getAvatar(response[0]);
				storage.setSteemConnectData(username, expiresIn, accessToken, avatar, service);
				initOneSignalService(username, dispatch);
				let parseResult = JSON.parse(response[0].json_metadata);
				dispatch({
					type: 'LOGIN_WITH_STEEM_CONNECT_SUCCESS',
				});
				dispatch(push('/feed'));
				dispatch(showMessage('Welcome to Steepshot, ' + (parseResult.profile.name || username) + '!'));
				LoggingService.logLogin();
			})
			.catch( error => {
				storage.clearAuthData();
				dispatch(loginError(error));
			})
	}
}

function loginError(error) {
	return dispatch => {
		dispatch(pushErrorMessage(error));
		dispatch({
			type: 'LOGIN_WITH_STEEM_CONNECT_ERROR',
			error
		});
		dispatch(hideBodyLoader());
	}
}