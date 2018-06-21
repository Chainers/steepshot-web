import {getStore} from "../store/configureStore";
import AuthService from "../services/authService";
import ChainService from "../services/chainService";

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
		ChainService.getTransactionHistory(username, numberLastTransaction - 1)
			.then(response => {
				dispatch({
					type: 'GET_TRANSACTION_HISTORY_SUCCESS',
					transactions: response
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