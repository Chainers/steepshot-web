const initialState = {};

export default function pushMessage(state = initialState, action) {
	switch (action.type) {
		case 'PUSH_MESSAGE':
			return {
				...state,
				[action.index]: {
					message: action.message,
					willClose: false,
					up: false
				}
			};
		case 'UP_PUSH_MESSAGE':
			return {
				...state,
				[action.index]: {
					...state[action.index],
					up: true
				}
			};
		case 'WILL_CLOSE_PUSH_MESSAGE':
			return {
				...state,
				[action.index]: {
					...state[action.index],
					willClose: true
				}
			};
		case 'REMOVE_PUSH_MESSAGE':
			let newState = {...state};
			delete newState[action.index];
			return newState;
		default:
			return state;
	}
}
