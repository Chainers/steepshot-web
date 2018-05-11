import {getStore} from "../store/configureStore";
import {setSubscribeConfigurationAction} from "./oneSignal";

export function updateSettings() {
	return dispatch => {
		let settings = getStore().getState().settingsFields;
		updateSettingsInLocalStorage(settings);
		dispatch(setSubscribeConfigurationAction());
		dispatch({
			type: 'UPDATE_SETTINGS',
			settings
		});
	}
}

function updateSettingsInLocalStorage(settings) {
	localStorage.removeItem('settings');
	localStorage.setItem('settings', JSON.stringify(settings));
}
