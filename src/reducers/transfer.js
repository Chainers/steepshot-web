const initialState = {
	token: 'SBD'
};

export default function transfer(state = initialState, action) {
	switch (action.type) {
		case 'TRANSFER_SET_TOKEN':
			return {
				...state,
				token: action.token
			};

		default:
			return state;
	}
}
