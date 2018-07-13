import {getStore} from "../store/configureStore";
import {actionLock, actionUnlock} from "./session";
import WalletService from "../services/WalletService";
import Constants from "../common/constants";
import {pushErrorMessage, pushMessage} from "./pushMessage";
import {closeModal} from "./modal";
import {hideBodyLoader, showBodyLoader} from "./bodyLoader";
import storage from "../utils/Storage";

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

export function changeMemo(value) {
	return {
		type: 'TRANSFER_CHANGE_MEMO',
		value
	}
}

export function clearTransfer() {
	return {
		type: 'TRANSFER_CLEAR'
	}
}

export function transfer() {
	let state = getStore().getState();

	return dispatch => {
		if (state.session.actionLocked) {
			return;
		}
		const {to, memo} = state.transfer;
		const {amount} = state.wallet;
		const {activeKey, saveKey} = state.activeKey;
		const selectedToken = state.services.tokensNames[state.wallet.selectedToken];
		if (saveKey) {
			storage.transferActiveKey = activeKey;
		} else {
			storage.transferActiveKey = null;
		}
		dispatch(actionLock());
		dispatch(showBodyLoader());
		WalletService.transfer(activeKey,
			amount,
			selectedToken,
			to,
			memo)
			.then(() => {
				dispatch(actionUnlock());
				dispatch(hideBodyLoader());
				dispatch(pushMessage(Constants.TRANSFER.BID_TO_BOT_SUCCESS));
				dispatch(closeModal("transfer"));
			})
			.catch(error => {
				dispatch(actionUnlock());
				dispatch(hideBodyLoader());
				if (!error.data && (error.actual === 128 || error.message === Constants.NON_BASE58_CHARACTER)) {
					return dispatch(pushErrorMessage(Constants.TRANSFER.INVALID_ACTIVE_KEY));
				}
				dispatch(pushErrorMessage(error.data ? error : error.message));
			});
	}
}