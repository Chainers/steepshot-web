const initialState = {
	body: {
		shouldFetch: 0
	},
	likes: {
		shouldFetch: 0
	},
	flags: {
		shouldFetch: 0
	}
};

export default function scroll(state = initialState, action) {
	switch (action.type) {
		case 'SCROLL_SHOULD_FETCH':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					shouldFetch: state[action.point].shouldFetch + 1
				}
			};
		default:
			return state;
	}
}
