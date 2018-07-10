import ChainService from "../services/chainService";

export function setToken(token) {
	return {
		type: 'TRANSFER_SET_TOKEN',
		token
	}
}

export function showMemo() {
	return {
		type: 'TRANSFER_SHOW_MEMO'
	}
}

export function changeUsername(value) {
	const validCharacters = /^[-a-zA-Z0-9.]*$/;
	if (validCharacters.test(value)) {
		return {
			type: 'TRANSFER_CHANGE_USERNAME',
			value
		}
	} else {
		return {
			type: 'TRANSFER_ERROR',
			message: 'Incorrect username.'
		}
	}
}

export function changeAmount(value) {
	const validCharacters = /^[0-9.]*$/;
	if (validCharacters.test(value)) {
		return {
			type: 'TRANSFER_CHANGE_AMOUNT',
			value
		}
	} else {
		return {
			type: 'TRANSFER_ERROR',
			message: 'Incorrect amount.'
		}
	}
}

export function changeMemo(value) {
	return {
		type: 'TRANSFER_CHANGE_MEMO',
		value
	}
}

export function changeActiveKey(value) {
	return {
		type: 'TRANSFER_CHANGE_ACTIVE_KEY',
		value
	}
}

export function changeSaveKey() {
	return {
		type: 'TRANSFER_CHANGE_SAVE_KEY'
	}
}

export function clearTransfer() {
	return {
		type: 'TRANSFER_CLEAR'
	}
}

export function transfer(activeKey, amount, token, to, memo) {
	let transferInfo = {
		wif: activeKey,
		recipient: to,
		amount: amount + ' ' + token,
		memo: memo
	};
	ChainService.sendTransferTroughBlockchain(transferInfo)
}