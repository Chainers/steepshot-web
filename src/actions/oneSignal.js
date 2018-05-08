export function subscribe() {
	return dispatch => {
		console.log('test');
		var OneSignal = window.OneSignal || [];
		OneSignal.push(function() {
			window.OneSignal.registerForPushNotifications({
				modalPrompt: true
			});
		})
	}
}