import {getStore} from "../store/configureStore";
import Constants from "../common/constants";
import {addNotificationTags, removeNotificationTags, setSubscribeConfiguration} from "../services/oneSignal";

let OneSignal = window.OneSignal;

export function loadSubscribeData() {
	OneSignal.on('subscriptionChange', subscribeListener);
	return async dispatch => {
		let playerId = await OneSignal.getUserId();
		let notificationPermission = await OneSignal.getNotificationPermission();
		let isNotificationsEnabled = await OneSignal.isPushNotificationsEnabled();
		let shownSubscribe = localStorage.getItem('shownSubscribe');
		if ((notificationPermission === Constants.ONE_SIGNAL.STATES.DEFAULT) && !shownSubscribe) {
			subscribe();
		}
		dispatch(setOneSignalData(playerId, notificationPermission, isNotificationsEnabled));
	}
}

function setOneSignalData(playerId, notificationPermission, isNotificationsEnabled) {
	return {
		type: 'SET_ONE_SIGNAL_DATA',
		playerId,
		notificationPermission,
		isNotificationsEnabled
	}
}

export function subscribe() {
	OneSignal.getUserId().then(userId => {
		if (userId != null) {
			OneSignal.setSubscription(true);
		} else {
			OneSignal.registerForPushNotifications({
				modalPrompt: true
			});
		}
		localStorage.setItem('shownSubscribe', 'true');
	})
}

async function subscribeListener(isSubscribed) {
	const store = getStore();
	let playerId = await OneSignal.getUserId();
	let notificationPermission = await OneSignal.getNotificationPermission();
	let isNotificationsEnabled = await OneSignal.isPushNotificationsEnabled();
	let user = store.getState().auth.user;
	if (isSubscribed) {
		addNotificationTags(user, playerId);
	} else {
		removeNotificationTags();
	}
	store.dispatch(setOneSignalData(playerId, notificationPermission, isNotificationsEnabled));
}

export function setSubscribeConfigurationAction() {
	return async dispatch => {
		dispatch({
			type: 'SET_SUBSCRIPTION_CONFIGURATION_REQUEST'
		});
		try {
			let response = await setSubscribeConfiguration();
			dispatch({
				type: 'SET_SUBSCRIBE_CONFIGURATION_SUCCESS',
				response
			})
		} catch (error) {
			dispatch({
				type: 'SET_SUBSCRIBE_CONFIGURATION_ERROR',
				error
			})
		}
	}
}