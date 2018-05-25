const initialState = {
	serviceName: null
};

export default function services(state = initialState, action) {
	switch (action.type) {
		case 'SET_SERVICE':
			return {
				...state,
				name: action.serviceName
			};
		default:
			return state;
	}
}
