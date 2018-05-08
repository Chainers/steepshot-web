export function subscribe() {
	return dispatch => {
		console.log('test');
		window.OneSignal.push(function() {
			window.OneSignal.showHttpPrompt();
		});
	}
}