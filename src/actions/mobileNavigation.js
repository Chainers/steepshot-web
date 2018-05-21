import {getStore} from '../store/configureStore';

export function openMobileNavigation() {
	document.body.classList.add('no-scroll_body');
	return {
		type: 'OPEN_MOBILE_NAVIGATION'
	}
}

export function closeMobileNavigation() {
	document.body.classList.remove('no-scroll_body');
	return {
		type: 'CLOSE_MOBILE_NAVIGATION'
	}
}

export function toggleMobileNavigation() {
	return dispatch => {
		if (getStore().getState().mobileNavigation.opened) {
			dispatch(closeMobileNavigation())
		} else {
			dispatch(openMobileNavigation())
		}
	}
}