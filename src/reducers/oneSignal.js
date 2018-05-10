import Constants from "../common/constants";

const initialState = {
	appId: Constants.ONE_SIGNAL.APP_ID,
	playerId: null,
	settings: null,
	notificationPermission: null,
	isNotificationsEnabled: null
};

export default function oneSignal(state = initialState, action) {
	switch (action.type) {
		case 'SET_ONE_SIGNAL_SETTINGS':
			return {
				...state,
				playerId: action.playerId,
				settings: action.settings,
				notificationPermission: action.notificationPermission,
				isNotificationsEnabled: action.isNotificationsEnabled
			};

		default:
			return state;
	}
}
