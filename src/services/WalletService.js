import ChainService from "./ChainService";
import Utils from "../utils/Utils";

class WalletService {

	static transfer(activeKey, amount, token, to, memo) {
		const error = new Error();
		error.isCustom = true;
		if (Utils.isEmptyString(activeKey)) {
			error.message = 'Active key can\'t be empty.';
			error.field = 'activeKeyError';
			return Promise.reject(error)
		}
		if (Utils.isEmptyString(token)) {
			error.message = 'Amount can\'t be empty.';
			error.field = 'amountError';
			return Promise.reject(error)
		}
		if (parseFloat(amount) < 0.001) {
			error.message = 'Amount can\'t be less then 0.001.';
			error.field = 'amountError';
			return Promise.reject(error)
		}
		if (Utils.isEmptyString(to)) {
			error.message = 'Recipient can\'t be empty.';
			error.field = 'toError';
			return Promise.reject(error)
		}
		let validAmount = amount.toString();
		if (/\./.test(validAmount)) {
			validAmount = validAmount + '000';
		} else {
			validAmount = validAmount + '.000';
		}
		validAmount = validAmount.replace(/(\d+\.\d{3})(\d*)/, '$1');

		let transferInfo = {
			wif: activeKey,
			recipient: to,
			amount: validAmount + ' ' + token,
			memo: memo
		};
		return ChainService.sendTransferTroughBlockchain(transferInfo);
	}

	static powerUp(activeKey, amount) {
		if (Utils.isEmptyString(activeKey)) {
			return Promise.reject(new Error('Active key can\'t be empty.'))
		}
		if (Utils.isEmptyString(amount)) {
			return Promise.reject(new Error('Amount can\'t be empty.'))
		}
		if (parseFloat(amount) < 0.001) {
			return Promise.reject(new Error('Amount can\'t be less then 0.001.'))
		}
		const selectedToken = ChainService.usingGolos() ? 'GOLOS' : 'STEEM';
		return ChainService.powerUp(activeKey, amount + ' ' + selectedToken);
	}

}

export default WalletService;