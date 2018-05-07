const initialState = {
	player_id: null,
	app_id: Consta
};

export default function oneSignal(state = initialState, action) {
	switch (action.type) {
		case 'SET_AVATAR_TIP':
			return {
				...state
			};

		default:
			return state;
	}
}
