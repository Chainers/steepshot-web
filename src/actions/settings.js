import Constants from "../common/constants";

export function getSettings() {
	return JSON.parse(localStorage.getItem('settings'))
		|| {
			[Constants.SETTINGS.show_low_rated]: Constants.SETTINGS.default.show_low_rated,
			[Constants.SETTINGS.show_nsfw]: Constants.SETTINGS.default.show_nsfw
		}
}

function updateSettingsInLocalStorage(lowRated, nsfw) {
	let settings = {
		[Constants.SETTINGS.show_low_rated]: lowRated,
		[Constants.SETTINGS.show_nsfw]: nsfw
	};
	localStorage.removeItem('settings');
	localStorage.setItem('settings', JSON.stringify(settings));
}

export function updateSettings(lowRated, nsfw) {
	updateSettingsInLocalStorage(lowRated, nsfw);
	return {
		type: 'UPDATE_SETTINGS',
		[Constants.SETTINGS.show_low_rated]: lowRated,
		[Constants.SETTINGS.show_nsfw]: nsfw
	}
}

export function toggleLowRated() {
	return {
		type: 'TOGGLE_LOW_RATED_BTN'
	}
}

export function toggleNsfw() {
	return {
		type: 'TOGGLE_NSFW_BTN'
	}
}

export function setOldSettings() {
	return {
		type: 'SET_OLD_SETTINGS'
	}
}