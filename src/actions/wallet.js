import {getStore} from '../store/configureStore';
import {actionLock, actionUnlock} from './session';
import WalletService from '../services/WalletService';
import storage from '../utils/Storage';
import {hideBodyLoader, showBodyLoader} from './bodyLoader';
import {closeModal} from './modal';
import {pushMessage} from './pushMessage';
import Constants from '../common/constants';
import {inputError, stopTransferWithError} from './transfer';

export function setErrorWithPushNotification(field, error) {
  return dispatch => {
    dispatch(inputError(field, error));
    dispatch(pushMessage(error));
  }
}

export function isValidAmountTokens(tokensAmount, balance, transactionAction) {
	return dispatch => {
		const tokensAmountNumber = +tokensAmount;
    if (isNaN(tokensAmountNumber)) {
      return dispatch(setErrorWithPushNotification('amountError', Constants.PROMOTE.INPUT_ERROR));
    }
  	if (tokensAmountNumber > balance) {
      return dispatch(setErrorWithPushNotification('amountError', Constants.ERROR_MESSAGES.NOT_ENOUGH_TOKENS));
		}
		transactionAction();
	}
}

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

    if (storage.accessToken) {
      WalletService.powerUpSteemConnect(amount)
        .then(() => {
          dispatch(actionUnlock());
          dispatch(hideBodyLoader());
        })
        .catch(error => {
          dispatch(stopTransferWithError(error));
        });
      return;
    }

		WalletService.powerUp(activeKey || storage.activeKey, amount)
			.then(() => {
				dispatch(actionUnlock());
				dispatch(hideBodyLoader());
				dispatch(closeModal("powerUp"));
        if (saveKey && !storage.activeKey) storage.activeKey = activeKey;
				dispatch(pushMessage(Constants.WALLET.POWER_UP_SUCCESS));
			})
			.catch(error => {
        dispatch(stopTransferWithError(error));
			})
	}
}

export function powerDown() {
	let state = getStore().getState();
	if (state.session.actionLocked) {
		return {
			type: 'ACTION_LOCKED_POWER_DOWN'
		}
	}
	return dispatch => {
		let amountString = state.wallet.amount.toString();
    amountString = amountString.match(/\d+(\.\d+)?/);
		if (amountString[0] !== amountString.input) {
      return dispatch(setErrorWithPushNotification('amountError', Constants.PROMOTE.INPUT_ERROR));
		}
    if (state.userProfile.profile.total_steem_power_steem - state.wallet.amount
			< Constants.TRANSFER.MIN_LEAVE_STEEM_POWER) {
      return dispatch(setErrorWithPushNotification('amountError',
				`You should leave not less than ${Constants.TRANSFER.MIN_LEAVE_STEEM_POWER} steem power.`))
    }
		dispatch(actionLock());
		dispatch(showBodyLoader());
		const {amount} = state.wallet;
		const {total_steem_power_steem, total_steem_power_vests} = state.userProfile.profile;
		const amountVests = (amount / total_steem_power_steem) * total_steem_power_vests;
		const {activeKey, saveKey} = state.activeKey;

    if (storage.accessToken) {
      WalletService.powerDownSteemConnect(amountVests)
        .then(() => {
          dispatch(actionUnlock());
          dispatch(hideBodyLoader());
        })
        .catch(error => {
          dispatch(stopTransferWithError(error));
        });
      return;
    }

		WalletService.powerDown(activeKey || storage.activeKey, amountVests)
			.then(() => {
				dispatch(actionUnlock());
				dispatch(hideBodyLoader());
				dispatch(closeModal("powerDown"));
        if (saveKey && !storage.activeKey) storage.activeKey = activeKey;
				dispatch(pushMessage(Constants.WALLET.POWER_DOWN_SUCCESS));
			})
			.catch(error => {
        dispatch(stopTransferWithError(error));
			})
	}
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