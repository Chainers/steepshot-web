import {getStore} from '../store/configureStore';
import {setPostOffset} from './postModal';

export function openModal(index, options) {
	return {
		type: 'OPEN_MODAL',
		index,
		options
	}
}

export function setModalOptions(index, options) {
	return {
		type: 'SET_MODAL_OPTIONS',
		index,
		options
	}
}

export function closeModal(index) {
	let modal = getStore().getState().modals[index];
	let postModal = getStore().getState().postModal;
	if (!modal) {
		return {
			type: 'EMPTY_CLOSE_MODAL'
		}
	}
	return (dispatch) => {
		dispatch({
			type: 'WILL_CLOSE_MODAL',
			index
		});
		setTimeout(() => {
			dispatch({
				type: 'CLOSE_MODAL',
				index
			});
		}, 250);
		dispatch(scrollToLastSeen(postModal));
	}
}

function scrollToLastSeen(postModal) {
	const state = getStore().getState();
	return (dispatch) => {
		if (postModal.postOffset) {
			let alpha = window.pageYOffset - postModal.postOffset;
			let delta = Math.abs(alpha) < document.documentElement.clientHeight / 2;
			if (delta) {
				return;
			}
			const HEADER_HEIGHT = 60, DISTANCE_BETWEEN_POSTS = 20;
			let headersCount = 1, location = state.router.location.pathname;
			if (!state.advertising.advertisingStatus) {
				headersCount = 2;
			}
			let correctionPostOffset = postModal.postOffset - headersCount * HEADER_HEIGHT;
			if (location.match(/\/@[\w-.]+/)) {
				correctionPostOffset = correctionPostOffset + 120 - DISTANCE_BETWEEN_POSTS;
			}
			window.scrollTo(0, correctionPostOffset);
			dispatch(setPostOffset(null));
		}
	}
}

export function closeAllModals() {
	return {
		type: 'CLOSE_ALL_MODALS'
	}
}
