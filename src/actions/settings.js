import {getStore} from '../store/configureStore';
import {setSubscribeOnBackend, subscribe} from './oneSignal';
import storage from '../utils/Storage';
import {utils} from '../utils/utils';
import {pushMessage} from './pushMessage';
import Constants from "../common/constants";

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
		let checkedChanges = utils.equalsObjects(settings, storage.settings);
		dispatch(pushMessage(checkedChanges ? Constants.SETTINGS_NOT_CHANGED_MESSAGE : Constants.SETTINGS_CHANGED_MESSAGE));
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
