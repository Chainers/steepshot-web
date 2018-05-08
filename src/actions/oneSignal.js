let OneSignal = window.OneSignal;

export function subscribe() {
	return dispatch => {
		OneSignal.registerForPushNotifications({
			modalPrompt: true
		});

		isPushNotificationsEnabledVerbose();
	}
}

function isPushNotificationsEnabledVerbose() {
	Promise.all([
		OneSignal.isPushNotificationsEnabled(),
		OneSignal.getUserId(),
		OneSignal.getRegistrationId(),
		OneSignal.getNotificationPermission(),
		OneSignal.isOptedOut(),
		OneSignal.context.serviceWorkerManager.getActiveState()
	])
		.then(([isSubscribed, userId, registrationId, notificationPermission, optedOut, serviceWorkerActive]) => {
			console.log('Is Completely Subscribed:', isSubscribed);
			console.log('');
			console.log('What is our OneSignal user ID?', userId);
			console.log('What is our push subscription token?', registrationId);
			console.log('What is the notification permission status?', notificationPermission);
			console.log('Are you manually opted out?', optedOut);
			console.log("Is a service worker registered and active? (should be false on Safari, otherwise should be 'Worker A (Main)')?", serviceWorkerActive);
			console.log("What environment does OneSignal think it's in?", OneSignal.sdkEnvironment.getWindowEnv());
		})
		.catch(e => {
			console.error("Issue determining whether push is enabled:", e);
		});
}