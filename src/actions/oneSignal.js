import Constants from "../common/constants";
import {getStore} from "../store/configureStore";

let OneSignal = window.OneSignal;

export function initSubscribe() {
	return async dispatch => {
		let playerId = localStorage.getItem(Constants.ONE_SIGNAL.LOCAL_STORAGE.USER_ID);
		let settings = JSON.parse(localStorage.getItem(Constants.ONE_SIGNAL.LOCAL_STORAGE.SETTINGS) || 'null');
		let state = localStorage.getItem(Constants.ONE_SIGNAL.LOCAL_STORAGE.STATE);
		if (!playerId || !settings || !state) {
			playerId = await OneSignal.getUserId();
			state = await OneSignal.getNotificationPermission();
			settings = Object.values(Constants.SUBSCRIPTION);
		}
		dispatch(setOneSignalSettings(playerId, state, settings))
	}
}

function setOneSignalSettings(playerId, state, settings) {
	return {
		type: 'SET_ONE_SIGNAL_SETTINGS',
		playerId,
		state,
		settings
	}
}

export function registerForPushNotifications() {
	let playerId = getStore().getState().oneSignal.playerId;
	return async dispatch => {
		if (!playerId) {
			await OneSignal.registerForPushNotifications({
				modalPrompt: true
			});
		}
		playerId = await OneSignal.getUserId();
		let state = await OneSignal.getNotificationPermission();
		let settings = [
			Constants.ONE_SIGNAL.SUBSCRIPTION.COMMENT,
			Constants.ONE_SIGNAL.SUBSCRIPTION.UPVOTE,
			Constants.ONE_SIGNAL.SUBSCRIPTION.UPVOTE_COMMENT,
			Constants.ONE_SIGNAL.SUBSCRIPTION.FOLLOW,
			Constants.ONE_SIGNAL.SUBSCRIPTION.POST
		];
		dispatch(setOneSignalSettings(playerId, state, settings));
		saveOneSignalSettingsToLocalStorage(playerId, state, settings);
	}
}

export function setSubscribeSettings(comment, upvote, upvoteComment, follow, post) {
	const store = getStore().getState();
	let playerId = store.oneSignal.playerId;
	return async dispatch => {
		if (!playerId) {
			playerId = await OneSignal.getUserId();
		}
		let settings = [];
		if (comment) {
			settings.push(Constants.ONE_SIGNAL.SUBSCRIPTION.COMMENT);
		}
		if (upvote) {
			settings.push(Constants.ONE_SIGNAL.SUBSCRIPTION.UPVOTE);
		}
		if (upvoteComment) {
			settings.push(Constants.ONE_SIGNAL.SUBSCRIPTION.UPVOTE_COMMENT);
		}
		if (follow) {
			settings.push(Constants.ONE_SIGNAL.SUBSCRIPTION.FOLLOW);
		}
		if (post) {
			settings.push(Constants.ONE_SIGNAL.SUBSCRIPTION.POST);
		}
		let state = Constants.ONE_SIGNAL.STATES.GRANTED;
		dispatch(setOneSignalSettings(playerId, state, settings))
		saveOneSignalSettingsToLocalStorage(playerId, state, settings);
	}
}

function saveOneSignalSettingsToLocalStorage(playerId, state, settings) {
	localStorage.setItem(Constants.ONE_SIGNAL.LOCAL_STORAGE.USER_ID, playerId);
	localStorage.setItem(Constants.ONE_SIGNAL.LOCAL_STORAGE.SETTINGS, settings);
	localStorage.setItem(Constants.ONE_SIGNAL.LOCAL_STORAGE.STATE, state);
}