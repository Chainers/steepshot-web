const initialState = {
	scrollHeight: 0
};

export default function infinityScroll(state = initialState, action) {
	switch (action.type) {
		case 'SET_SCROLL_HEIGHT_FOR_FETCH':
			return {
				...state,
				scrollHeight: action.height
			};
		default:
			return state;
	}
}
