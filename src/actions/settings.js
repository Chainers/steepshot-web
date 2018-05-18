import {getStore} from "../store/configureStore";
import {setSubscribeOnBackend, subscribe} from "./oneSignal";
import storage from "../utils/Storage";

export function checkSubscribeAndUpdateSettings() {
	return dispatch => {
		if (!storage.shownSubscribe) {
			dispatch(subscribe())
		} else {
			dispatch(updateSettings());
		}
	}
}

export function updateSettings() {
	return dispatch => {
		let settings = getStore().getState().settingsFields;
		storage.settings = settings;
		dispatch(setSubscribeOnBackend());
		dispatch({
			type: 'UPDATE_SETTINGS',
			settings
		});
	}
}

export function removeSettings() {
	return {
		type: 'REMOVE_SETTINGS'
	}
}
