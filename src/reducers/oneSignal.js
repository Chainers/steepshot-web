import Constants from "../common/constants";

const initialState = {
	appId: Constants.ONE_SIGNAL.APP_ID,
	playerId: localStorage.getItem(Constants.ONE_SIGNAL.LOCAL_STORAGE.USER_ID),
	settings: JSON.parse(localStorage.getItem(Constants.ONE_SIGNAL.LOCAL_STORAGE.SETTINGS) || 'null'),
	state: localStorage.getItem(Constants.ONE_SIGNAL.LOCAL_STORAGE.STATE)
};

export default function oneSignal(state = initialState, action) {
	switch (action.type) {
		case 'SET_ONE_SIGNAL_SETTINGS':
			return {
				...state,
				playerId: action.playerId,
				settings: action.settings,
				state: action.state
			};

		default:
			return state;
	}
}
