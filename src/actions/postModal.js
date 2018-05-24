import {openModal} from './modal';
import {getStore} from '../store/configureStore';
import {getPostsList} from './postsList';

export function initPostModal(point, index) {
	return {
		type: 'INIT_POST_MODAL',
		options: {
			point,
			currentIndex: index,
		}
	}
}

export function openPostModal(point, index, options) {
	return (dispatch) => {
		dispatch(initPostModal(point, index));
		dispatch(openModal(point, options));
	}
}

export function setPostModalOptions(options) {
	return (dispatch) => {
		dispatch({
			type: 'SET_POST_MODAL_OPTIONS',
			options
		});
	}
}

function swapPostModal(index, isLoading) {
  let state = getStore().getState(), previousStyle = state.postModal.style;
  if (Object.keys(state.postModal.style).length < 1) {
    previousStyle = state.postModal.previousStyle;
	}
	return {
		type: 'SWAP_POST_MODAL',
		index,
		isLoading,
		previousStyle
	}
}

export function nextPostModal(index, isLoading) {
	let state = getStore().getState();
	if (Object.keys(state.modals).length >= 2) {
		return {
			type: 'CONFIRM_ACTION_IN_MODAL'
		}
	}
	let point = state.postModal.point;
	let postsList = state.postsList[point].posts;
	let positionPost = postsList.indexOf(index);
	return dispatch => {
		if (positionPost === postsList.length - 6) {
			dispatch(getPostsList(point));
		}
		if (positionPost === postsList.length - 1) {
			if (!state.postsList[point].hasMore) {
				dispatch({type: 'THE_POST_IS_LAST'})
			}
			if (state.postsList[point].loading) {
				dispatch({type: 'WAIT_NEXT_POSTS'});
			}
		} else {
			let newIndex = postsList[positionPost + 1];
			dispatch(swapPostModal(newIndex, isLoading))
		}
	}
}

export function previousPostModal(index, isLoading) {
	let state = getStore().getState();
	if (Object.keys(state.modals).length >= 2) {
		return {
			type: 'CONFIRM_ACTION_IN_MODAL'
		}
	}
	let point = state.postModal.point;
	let postsList = state.postsList[point].posts;
	let positionPost = postsList.indexOf(index);
	if (positionPost === 0) {
		return {
			type: 'THE_POST_IS_FIRST'
		}
	}
	return (dispatch) => {
		let newIndex = postsList[positionPost - 1];
		dispatch(swapPostModal(newIndex, isLoading))
	}
}

export function setFullScreen(isOpen, timeoutID) {
	return (dispatch) => {
		dispatch({
			type: 'SET_FULL_SCREEN',
			isOpen,
			timeoutID
		});
	}
}

export function setFSNavigation(isVisible, timeoutID) {
	return (dispatch) => {
		dispatch({
			type: 'SET_FULL_SCREEN_NAVIGATION',
			isVisible,
			timeoutID
		})
	}
}

export function setPostOffset(offset) {
	return (dispatch) => {
		dispatch({
			type: 'SET_POST_OFFSET',
			postOffset: offset
		})
	}
}

export function setNewImageLoading(isLoading) {
	return {
		type: 'SET_NEW_IMAGE_LOADING',
		newImageLoading: isLoading
	}
}