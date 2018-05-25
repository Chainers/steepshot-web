import {blockchainErrorsList} from '../utils/blockchainErrorsList';

let index = 0;

export function pushErrorMessage(errorMessage) {
  let checkedError = blockchainErrorsList(errorMessage);
  return dispatch => {
		dispatch(pushMessage(checkedError));
	}
}

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
		}, 3700);
		setTimeout(() => {
			dispatch({
				type: 'REMOVE_PUSH_MESSAGE',
				index: currentIndex
			})
		}, 4700)
	}
}