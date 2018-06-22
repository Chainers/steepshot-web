import {getStore} from "../store/configureStore";
import AuthService from "../services/authService";
import TransactionService from "../services/transactionService";

const COUNT_TRANSACTION = 20;

export function getTransactionHistory() {
	const transactionHistory = getStore().getState().transactionHistory;
	if (transactionHistory.loading) {
		return {
			type: "EMPTY_GET_TRANSACTION_HISTORY"
		}
	}
	const operationTypes = transactionHistory.operationTypes[transactionHistory.currentOperation];
	const numberLastTransaction = transactionHistory.transactions[0] ? transactionHistory.transactions[0][0] : 0;
	const username = AuthService.getUsername();
	return dispatch => {
		dispatch({
			type: 'GET_TRANSACTION_HISTORY_REQUEST',
			username
		});
		TransactionService.getWalletTransaction(username, numberLastTransaction - 1, COUNT_TRANSACTION, operationTypes)
			.then(response => {
				dispatch({
					type: 'GET_TRANSACTION_HISTORY_SUCCESS',
					transactions: response,
					hasMore: response.length < COUNT_TRANSACTION
				});
			})
			.catch(error => {
				dispatch({
					type: 'GET_TRANSACTION_HISTORY_ERROR',
					error
				});
			});
	}
}

export function changeTransactionFilter(currentOperation) {
	return {
		type: 'CHANGE_TRANSACTION_FILTER',
		currentOperation
	}
}

export function clearHistory() {
	return {
		type: 'CLEAR_TRANSACTION_HISTORY'
	}
}