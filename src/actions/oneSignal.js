import {getStore} from "../store/configureStore";

let OneSignal = window.OneSignal;

export function loadSubscribeData() {
	OneSignal.on('subscriptionChange', subscribeListener);
	return async dispatch => {
		let playerId = await OneSignal.getUserId();
		let notificationPermission = await OneSignal.getNotificationPermission();
		let isNotificationsEnabled = await OneSignal.isPushNotificationsEnabled();
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

export async function subscribe() {
	if (await OneSignal.getUserId() != null) {
		OneSignal.setSubscription(true);
	}	else {
		OneSignal.registerForPushNotifications({
			modalPrompt: true
		});
	}
}

async function subscribeListener() {
	const store = getStore();
	let playerId = await OneSignal.getUserId();
	let notificationPermission = await OneSignal.getNotificationPermission();
	let isNotificationsEnabled = await OneSignal.isPushNotificationsEnabled();

	store.dispatch(setOneSignalData(playerId, notificationPermission, isNotificationsEnabled));
}