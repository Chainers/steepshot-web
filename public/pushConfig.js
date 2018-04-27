var OneSignal = window.OneSignal || [];
OneSignal.push(["init", {
	appId: "77fa644f-3280-4e87-9f14-1f0c7ddf8ca5",
	autoRegister: false,
	httpPermissionRequest: {
		enable: true
	},
	subdomainName: 'qa-second',
	welcomeNotification: {
		"title": "My Custom Title",
		"message": "Thanks for subscribing!",
		"url": "https://qa-second.alpha.steepshot.io/browse"
	},
	promptOptions: {
		actionMessage: "We'd like to show you notifications for the latest news and updates.",
		acceptButtonText: "ALLOW",
		cancelButtonText: "NO THANKS"
	}
}]);
OneSignal.push(function () {
	OneSignal.showHttpPrompt();
});