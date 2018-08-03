import {getStore} from '../store/configureStore';
import {actionLock, actionUnlock} from './session';
import WalletService from '../services/WalletService';
import Constants from '../common/constants';
import {pushMessage} from './pushMessage';
import {closeModal} from './modal';
import {hideBodyLoader, showBodyLoader} from './bodyLoader';
import storage from '../utils/Storage';
import {blockchainErrorsList} from '../utils/blockchainErrorsList';

export function stopTransferWithError(error) {
	return dispatch => {
    dispatch(actionUnlock());
    dispatch(hideBodyLoader());
    const {message, field} = getErrorData(error);
    if (field && message) {
      dispatch(inputError(field, message));
    }
    dispatch(pushMessage(message));
	}
}

export function showMemo() {
	return {
		type: 'TRANSFER_SHOW_MEMO'
	}
}

export function changeUsername(value) {
	return dispatch => {
		dispatch({
			type: 'TRANSFER_CHANGE_USERNAME',
			value
		});
		const validCharacters = /^[-a-zA-Z0-9.]*$/;
		if (!validCharacters.test(value)) {
			dispatch(inputError('toError', 'Incorrect username.'));
		}
	}
}

export function changeMemo(value) {
	return {
		type: 'TRANSFER_CHANGE_MEMO',
		value
	}
}

export function inputError(field, message) {
	return {
		type: 'TRANSFER_ERROR',
		[field]: message
	}
}

export function transfer() {
	let state = getStore().getState();
	if (state.session.actionLocked) {
		return {
			type: 'ACTION_LOCKED_TRANSFER'
		}
	}
	return dispatch => {
		const {to, memo} = state.transfer;
		const {amount, selectedToken} = state.wallet;
		const {activeKey, saveKey} = state.activeKey;
		const selectedTokenName = state.services.tokensNames[selectedToken];
		dispatch(actionLock());
    dispatch(showBodyLoader());
		if (storage.accessToken) {
			WalletService.steemConnectTransfer(amount, selectedTokenName, to, memo)
				.then(() => {
          dispatch(actionUnlock());
          dispatch(hideBodyLoader());
				})
        .catch(error => {
          dispatch(stopTransferWithError(error));
        });
			return;
		}
		WalletService.transfer(activeKey || storage.activeKey, amount, selectedTokenName, to, memo)
			.then(() => {
				dispatch(actionUnlock());
				dispatch(hideBodyLoader());
				dispatch(pushMessage(Constants.TRANSFER.TRANSFER_SUCCESS));
        if (saveKey && !storage.activeKey) storage.activeKey = activeKey;
				dispatch(closeModal("transfer"));
			})
			.catch(error => {
        dispatch(stopTransferWithError(error));
			});
	}
}

export function getErrorData(error) {
	let message, field;
	if (error.isCustom) {
		field = error.field;
		message = error.message;
	} else {
		message = blockchainErrorsList(error);
		if (message === Constants.ERROR_MESSAGES.INVALID_ACTIVE_KEY) {
			field = 'activeKeyError';
		}
		if (message === Constants.ERROR_MESSAGES.NOT_ENOUGH_TOKENS) {
			field = 'amountError';
		}
		if (message === Constants.ERROR_MESSAGES.USER_NOT_FOUND) {
			field = 'toError';
		}
	}
	return {message, field}
}