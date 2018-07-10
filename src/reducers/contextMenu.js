const initialState = {};

export default function contextMenu(state = initialState, action) {
	switch (action.type) {
		case 'OPEN_CONTEXT_MENU':
			return {
				[action.point]: {
					...state[action.point],
					show: true
				},
			};
		case 'CLOSE_CONTEXT_MENU':
			return initialState;
		default:
			return state;
	}
}
