const initialState = {
	body: {},
	likes: {},
	flags: {}
};

export default function scroll(state = initialState, action) {
	switch (action.type) {
		case 'SCROLL_INIT':
			return {
				...state,
				[action.point]: {
					shouldUpdate: 0,
					shouldFetch: 0
				}
			};
		case 'SCROLL_SHOULD_FETCH':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					shouldFetch: state[action.point].shouldFetch + 1
				}
			};
		case 'SCROLL_SHOULD_UPDATE':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					shouldUpdate: state[action.point].shouldFetch
				}
			};
		default:
			return state;
	}
}
