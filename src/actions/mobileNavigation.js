import {getStore} from "../store/configureStore";

export function openMobileNavigation() {
	return {
		type: 'OPEN_MOBILE_NAVIGATION'
	}
}

export function closeMobileNavigation() {
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