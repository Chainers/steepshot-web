import {getStore} from "../store/configureStore";

export function updateSettings() {
	let settings = getStore().getState().settings;
	updateSettingsInLocalStorage(settings);
	return {
		type: 'UPDATE_SETTINGS',
		settings
	}
}

function updateSettingsInLocalStorage(settings) {
	localStorage.removeItem('settings');
	localStorage.setItem('settings', JSON.stringify(settings));
}
