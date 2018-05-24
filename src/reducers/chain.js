const initialState = {
	current: null
};

export default function chain(state = initialState, action) {
	switch (action.type) {
		case 'INIT_CHAIN':
		case 'SET_CHAIN_SERVICE':
			return {
				...state,
				current: action.service
			};
		default:
			return state;
	}
}
