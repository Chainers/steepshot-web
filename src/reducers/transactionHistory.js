const initialState = {
	loading: false,
	transactions: [],
	hasMore: true,
	operationTypes: ['all', 'transfer', 'claim_reward_balance'],
	indexOperation: 0,
	lastId: 0
};

export default function transactionHistory(state = initialState, action) {
	switch (action.type) {
		case 'GET_TRANSACTION_HISTORY_REQUEST':
			return {
				...state,
				loading: true
			};
		case 'GET_TRANSACTION_HISTORY_SUCCESS':
			const newTransactions = action.transactions.reverse();
			const transactions = action.changedFilter ? newTransactions : state.transactions.concat(newTransactions);
			return {
				...state,
				transactions,
				loading: false,
				hasMore: action.hasMore,
				lastId: transactions.length ? transactions[transactions.length - 1][0] : 0
			};
		case 'CHANGE_TRANSACTION_FILTER':
			return {
				...state,
				indexOperation: action.indexOperation,
				hasMore: true
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
