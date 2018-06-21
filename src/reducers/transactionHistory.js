const initialState = {
	loading: false,
	transactions: []
};

export default function transactionHistory(state = initialState, action) {
	switch (action.type) {
		case 'GET_TRANSACTION_HISTORY_REQUEST':
			return {
				...state,
				loading: true
			};
		case 'GET_TRANSACTION_HISTORY_SUCCESS':
			return {
				...state,
				transactions: [...action.transactions, ...state.transactions],
				loading: false
			};
		case 'GET_TRANSACTION_HISTORY_ERROR':
			return {
				...state,
				loading: false
			};
		default:
			return state;
	}
}
