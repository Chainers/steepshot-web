let index = 0;

export function pushMessage(message) {
	let currentIndex = ++index;
	return dispatch => {
		dispatch({
			type: 'PUSH_MESSAGE',
			message,
			index: currentIndex
		});

		setTimeout(() => {
			dispatch({
				type: 'UP_PUSH_MESSAGE',
				index: currentIndex
			});
		}, 10);

		setTimeout(() => {
			dispatch({
				type: 'WILL_CLOSE_PUSH_MESSAGE',
				index: currentIndex
			})
		}, 3000);
		setTimeout(() => {
			dispatch({
				type: 'REMOVE_PUSH_MESSAGE',
				index: currentIndex
			})
		}, 4000)
	}
}