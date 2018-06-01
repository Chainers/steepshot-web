const initialState = {
	body: {}
};

export default function scroll(state = initialState, action) {
	switch (action.type) {
		case 'SCROLL_INIT':
			return {
				...state,
				[action.point]: {
					position: 0,
					scrollTop: 0,
					scrollHeight: 0,
					shouldUpdate: 0,
					dataUpdated: 0
				}
			};
		case 'SET_SCROLL_DATA':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					position: action.position,
					scrollTop: action.scrollTop,
					scrollHeight: action.scrollHeight
				}
			};
		case 'SCROLL_SHOULD_UPDATE':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					shouldUpdate: state[action.point].shouldUpdate + 1
				}
			};
		case 'SCROLL_DATA_UPDATED':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					dataUpdated: action.height
				}
			};
		default:
			return state;
	}
}
