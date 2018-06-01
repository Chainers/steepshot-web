const initialState = {
	position: 0
};

export default function body(state = initialState, action) {
	switch (action.type) {
		case 'SCROLLING_BODY':
			return {
				...state,
				position: action.position
			};
		default:
			return state;
	}
}
