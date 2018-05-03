import Constants from "../common/constants";
import {getSettings} from "../actions/settings";

const initialState = {
	[Constants.SETTINGS.show_low_rated]: getSettings()[Constants.SETTINGS.show_low_rated],
	[Constants.SETTINGS.show_nsfw]: getSettings()[Constants.SETTINGS.show_nsfw],
	lowRatedBtn: getSettings()[Constants.SETTINGS.show_low_rated],
	nsfwBth: getSettings()[Constants.SETTINGS.show_nsfw]
};

export default function settings(state = initialState, action) {
	switch (action.type) {
		case 'UPDATE_SETTINGS':
			return {
				...state,
				[Constants.SETTINGS.show_low_rated]: action[Constants.SETTINGS.show_low_rated],
				[Constants.SETTINGS.show_nsfw]: action[Constants.SETTINGS.show_nsfw]
			};
		case 'TOGGLE_LOW_RATED_BTN':
			return {
				...state,
				lowRatedBtn: !state.lowRatedBtn
			};
		case 'TOGGLE_NSFW_BTN':
			return {
				...state,
				nsfwBth: !state.nsfwBth
			};
		case 'SET_OLD_SETTINGS':
			return {
				...state,
				lowRatedBtn: getSettings()[Constants.SETTINGS.show_low_rated],
				nsfwBth: getSettings()[Constants.SETTINGS.show_nsfw]
			};
		default:
			return state;
	}
}
