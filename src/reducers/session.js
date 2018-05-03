const initialState = {
	actionLocked: false
};

export default function session(state = initialState, action) {
	switch (action.type) {
		case 'ACTION_LOCK':
			return {
				...state,
				actionLocked: true
			};
		case 'ACTION_UNLOCK':
			return {
				...state,
				actionLocked: false
			};
		default:
			return state;
	}
}
