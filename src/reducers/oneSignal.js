import Constants from "../common/constants";

const initialState = {
	appId: Constants.ONE_SIGNAL.APP_ID,
	playerId: null,
	notificationPermission: null,
	isNotificationsEnabled: null,
	loaded: false
};

export default function oneSignal(state = initialState, action) {
	switch (action.type) {
		case 'SET_ONE_SIGNAL_DATA':
			return {
				...state,
				playerId: action.playerId,
				notificationPermission: action.notificationPermission,
				isNotificationsEnabled: action.isNotificationsEnabled,
				loaded: true
			};

		default:
			return state;
	}
}
