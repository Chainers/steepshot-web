import {getStore} from "../store/configureStore";
import Constants from "../common/constants";
import {addNotificationTags, removeNotificationTags, setSubscribeConfiguration} from "../services/oneSignal";
import storage from "../utils/Storage";

let OneSignal = window.OneSignal;

export function loadSubscribeData() {
	OneSignal.on('subscriptionChange', subscribeListener);
	return async dispatch => {
		let playerId = await OneSignal.getUserId();
		let notificationPermission = await OneSignal.getNotificationPermission();
		let isNotificationsEnabled = await OneSignal.isPushNotificationsEnabled();
		if ((notificationPermission === Constants.ONE_SIGNAL.STATES.DEFAULT) && !storage.shownSubscribe) {
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

function setSubscription(isNotificationsEnabled) {
	return {
		type: 'SET_ONE_SIGNAL_DATA',
		isNotificationsEnabled
	}
}

export function subscribe() {
	return dispatch => {
		dispatch(setSubscription(true));
		const playerId = getStore().getState().oneSignal.playerId;
		if (playerId != null) {
			OneSignal.setSubscription(true);
		} else {
			OneSignal.registerForPushNotifications({
				modalPrompt: true
			});
			storage.shownSubscribe = true;
		}
	}
}

export function unsubscribe() {

	return dispatch => {
		OneSignal.setSubscription(false);
		dispatch(setSubscription(false));
	}
}

async function subscribeListener(isSubscribed) {
	console.log(isSubscribed);
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
	store.dispatch({
		type: 'SUBSCRIBE_SUCCESS'
	});
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

export function subscribeOnUser(user) {
	return {
		type: 'SUBSCRIBE_ON_USER',
		user
	}
}

export function unsubscribeOnUser(user) {
	return {
		type: 'UNSUBSCRIBE_FROM_USER',
		user
	}
}