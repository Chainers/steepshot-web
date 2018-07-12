const initialState = {
	amount: ''
};

export default function power(state = initialState, action) {
	switch (action.type) {
		case 'POWER_CHANGE_AMOUNT':
			return {
				...state,
				amount: action.value
			};
		default:
			return state;
	}
}
