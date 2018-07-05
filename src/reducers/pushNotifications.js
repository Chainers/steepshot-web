const initialState = {};

export default function pushNotifications(state = initialState, action) {
	switch (action.type) {
		case 'OPEN_PUSH_NOTIFICATION':
			return {
				...state,
				[action.index]: {
					...action.pushNotBody
				}
			};

		case 'SET_PUSH_NOTIFICATION_TIMEOUT':
			return {
				...state,
				[action.index]: {
					pushNotBody: state[action.index].pushNotBody,
					pnTimeout: action.pnTimeout
				}
			};

		case 'CLOSE_PUSH_NOTIFICATION':
			let newState = {...state};
			delete newState[action.index];
			return newState;

		default:
			return state;
	}
}
