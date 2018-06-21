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
	const numberLastTransaction = transactionHistory.transactions[0] ? transactionHistory.transactions[0][0] : 0;
	const username = AuthService.getUsername();
	return dispatch => {
		dispatch({
			type: 'GET_TRANSACTION_HISTORY_REQUEST',
			username
		});
		TransactionService.getWalletTransaction(username, numberLastTransaction - 1, COUNT_TRANSACTION)
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