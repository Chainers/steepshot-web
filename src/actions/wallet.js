import {getStore} from "../store/configureStore";
import {actionLock, actionUnlock} from "./session";
import WalletService from "../services/WalletService";
import storage from "../utils/Storage";
import {hideBodyLoader, showBodyLoader} from "./bodyLoader";
import {closeModal} from "./modal";
import {pushMessage} from "./pushMessage";
import Constants from "../common/constants";
import {getErrorData, inputError} from "./transfer";

export function powerUp() {
	let state = getStore().getState();
	if (state.session.actionLocked) {
		return {
			type: 'ACTION_LOCKED_POWER_UP'
		}
	}
	return dispatch => {
		dispatch(actionLock());
		dispatch(showBodyLoader());
		const {amount} = state.wallet;
		const {activeKey, saveKey} = state.activeKey;
		if (saveKey) {
			storage.transferActiveKey = activeKey;
		} else {
			storage.transferActiveKey = null;
		}
		WalletService.powerUp(activeKey, amount)
			.then(() => {
				dispatch(actionUnlock());
				dispatch(hideBodyLoader());
				dispatch(closeModal("powerUp"));
				dispatch(pushMessage(Constants.WALLET.POWER_UP_SUCCESS));
			})
			.catch(error => {
				dispatch(actionUnlock());
				dispatch(hideBodyLoader());
				const {message, field} = getErrorData(error);
				if (field && message) {
					dispatch(inputError(field, message));
				}
				dispatch(pushMessage(message));
			})
	}
}

export function powerDown() {

}

export function changeAmount(value) {
	const validCharacters = /^[0-9.]*$/;
	if (validCharacters.test(value)) {
		return {
			type: 'WALLET_CHANGE_AMOUNT',
			value
		}
	} else {
		return {
			type: 'WALLET_CHANGE_ERROR',
			message: 'Incorrect amount.'
		}
	}
}

export function setToken(value) {
	return {
		type: 'WALLET_SET_TOKEN',
		value
	}
}