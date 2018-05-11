import Constants from "../common/constants";

const initialState = JSON.parse(localStorage.getItem('settings')) || Constants.SETTINGS.DEFAULT;

export default function settings(state = initialState, action) {
	switch (action.type) {
		case 'UPDATE_SETTINGS':
			return {
				...state,
				...action.settings
			};
		default:
			return state;
	}
}
