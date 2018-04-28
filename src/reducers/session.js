const initialState = {
	voteLocked: false
};

export default function session(state = initialState, action) {
	switch (action.type) {
		case 'VOTE_LOCK':
			return {
				...state,
				voteLocked: true
			};
		case 'VOTE_UNLOCK':
			return {
				...state,
				voteLocked: false
			};
		default:
			return state;
	}
}
