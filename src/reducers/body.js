const initialState = {
	position: 0,
	shouldUpdate: 0,
	scrollTop: 0,
	scrollHeight: 0
};

export default function body(state = initialState, action) {
	switch (action.type) {
		case 'SCROLLING_BODY':
			return {
				...state,
				position: action.position,
				scrollTop: action.scrollTop,
				scrollHeight: action.scrollHeight
			};
		case 'BODY_SHOULD_UPDATE':
			return {
				...state,
				shouldUpdate: state.shouldUpdate + 1
			};
		default:
			return state;
	}
}
