export function subscribe() {
	return dispatch => {
		console.log('test');
		window.OneSignal.registerForPushNotifications();
	}
}