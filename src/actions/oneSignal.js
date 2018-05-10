import {getStore} from "../store/configureStore";
import Constants from "../common/constants";

let OneSignal = window.OneSignal;

export function loadSubscribeSettings() {
	OneSignal.on('subscriptionChange', subscribe);
	return async dispatch => {
		let playerId = await OneSignal.getUserId();
		let notificationPermission = await OneSignal.getNotificationPermission();
		let isNotificationsEnabled = await OneSignal.isPushNotificationsEnabled();
		let settings = JSON.parse(localStorage.getItem(Constants.ONE_SIGNAL.LOCAL_STORAGE.SETTINGS))
			|| Object.values(Constants.ONE_SIGNAL.SUBSCRIPTION);

		dispatch(setOneSignalSettings(playerId, notificationPermission, isNotificationsEnabled, settings));
	}
}

function setOneSignalSettings(playerId, notificationPermission, isNotificationsEnabled, settings) {
	return {
		type: 'SET_ONE_SIGNAL_SETTINGS',
		playerId,
		notificationPermission,
		isNotificationsEnabled,
		settings
	}
}

export async function registerForPushNotifications() {
	if (await OneSignal.getUserId() != null) {
		OneSignal.setSubscription(true);
	}	else {
		OneSignal.registerForPushNotifications({
			modalPrompt: true
		});
	}
}

async function subscribe() {
	const store = getStore();
	let playerId = await OneSignal.getUserId();
	let settings = Object.values(Constants.ONE_SIGNAL.SUBSCRIPTION);
	let notificationPermission = await OneSignal.getNotificationPermission();
	let isNotificationsEnabled = await OneSignal.isPushNotificationsEnabled();

	saveOneSignalSettingsToLocalStorage(settings);
	store.dispatch(setOneSignalSettings(playerId, notificationPermission, isNotificationsEnabled, settings));
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
		dispatch(setOneSignalSettings(playerId, state, settings));
		saveOneSignalSettingsToLocalStorage(playerId, state, settings);
	}
}

function saveOneSignalSettingsToLocalStorage(settings) {
	localStorage.setItem(Constants.ONE_SIGNAL.LOCAL_STORAGE.SETTINGS, JSON.stringify(settings));
}