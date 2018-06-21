import ChainService from "./chainService";

class TransactionService {
	static getWalletTransaction(username, from, amount) {
		return ChainService.getTransactionHistory(username, from)
			.then(response => {
				const result = [];
				for(let i = response.length - 1; i > 0; i--) {
					if (result.length >= amount) {
						break;
					}
					let operationType = response[i][1].op[0];
					if (operationType === 'transfer' || operationType === 'fill_vesting_withdraw' || operationType === 'claim_reward_balance') {
						result.unshift(response[i])
					}
				}
				return result;
			})
	}
}

export default TransactionService;