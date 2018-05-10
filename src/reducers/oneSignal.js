const initialState = {
	appId: null,
	playerId: null,
	settings: null,
	state: null
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
