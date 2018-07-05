import ChainService from "./chainService";

class TransactionService {
	static getWalletTransaction(username, from, amount, operationTypes = []) {
		return ChainService.getTransactionHistory(username, from)
			.then(response => {
				const result = [];
				for (let i = response.length - 1; i > 0; i--) {
					if (result.length >= amount) {
						break;
					}
					let operationType = response[i][1].op[0];
					for (let type of operationTypes) {
						if (operationType === type) {
							result.unshift(response[i]);
							break;
						}
					}
				}
				return result;
			})
	}
}

export default TransactionService;