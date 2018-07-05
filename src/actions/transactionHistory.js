import {getStore} from "../store/configureStore";
import AuthService from "../services/authService";
import TransactionService from "../services/transactionService";

const COUNT_TRANSACTION = 20;

export function getTransactionHistory(changedFilter = false) {
	const transactionHistory = getStore().getState().transactionHistory;
	if (transactionHistory.loading) {
		return {
			type: "EMPTY_GET_TRANSACTION_HISTORY"
		}
	}
	const operationTypes = transactionHistory.operationTypes[transactionHistory.currentOperation];
	const lastId = changedFilter ? 0 : transactionHistory.lastId;
	const username = AuthService.getUsername();
	return dispatch => {
		dispatch({
			type: 'GET_TRANSACTION_HISTORY_REQUEST',
			username
		});
		TransactionService.getWalletTransaction(username, lastId - 1, COUNT_TRANSACTION, operationTypes)
			.then(response => {
				dispatch({
					type: 'GET_TRANSACTION_HISTORY_SUCCESS',
					transactions: response,
					hasMore: response.length === COUNT_TRANSACTION,
					changedFilter
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
