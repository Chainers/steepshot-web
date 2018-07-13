import ChainService from "./ChainService";
import Utils from "../utils/Utils";

class WalletService {

	static transfer(activeKey, amount, token, to, memo) {
		if (Utils.isEmptyString(activeKey)) {
			return Promise.reject(new Error('Active key can\'t be empty.'))
		}
		if (parseFloat(amount) < 0.001) {
			return Promise.reject(new Error('Amount can\'t be less then 0.001.'))
		}
		if (Utils.isEmptyString(token)) {
			return Promise.reject(new Error('Amount can\'t be empty.'))
		}
		if (Utils.isEmptyString(to)) {
			return Promise.reject(new Error('Recipient can\'t be empty.'))
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

}

export default WalletService;