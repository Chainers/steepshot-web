import {getStore} from '../store/configureStore';
import {actionLock, actionUnlock} from './session';
import WalletService from '../services/WalletService';
import storage from '../utils/Storage';
import {hideBodyLoader, showBodyLoader} from './bodyLoader';
import {closeModal} from './modal';
import {pushErrorMessage, pushMessage} from './pushMessage';
import Constants from '../common/constants';
import {inputError, stopTransferWithError} from './transfer';
import ChainService from '../services/ChainService';
import AuthService from '../services/AuthService';
import SteemService from '../services/SteemService';

function addDataToWallet(data) {
	return {
		type: 'ADD_DATA_TO_WALLET',
		data
	}
}

function updateAccountBalance() {
	return dispatch => {
		ChainService.getAccounts(AuthService.getUsername())
			.then(response => {
				const data = response[0];
				dispatch({
					type: 'UPDATE_ACCOUNT_BALANCE',
					newBalance: {
						balance: parseFloat(data.balance.split(' ')[0]),
						sbd_balance: parseFloat(data.sbd_balance.split(' ')[0]),
						total_steem_power_steem: SteemService.vestsToSp(data.vesting_shares),
						total_steem_power_vests: parseFloat(data.vesting_shares.split(' ')[0])
					}
				})
			})
			.catch(error => {
				dispatch({
					type: 'UPDATE_ACCOUNT_ERROR',
					error
				})
			})
	}
}

export function getAccountsSelectiveData() {
  return dispatch => {
    if (global.isServerSide) {
      return;
    }
    ChainService.getAccounts(AuthService.getUsername())
      .then(response => {
        const data = response[0];
        const sbdRewards = parseFloat(data['reward_sbd_balance'].split(' ')[0]);
        const steemRewards = parseFloat(data['reward_steem_balance'].split(' ')[0]);
        const steemPowerRewards = parseFloat(data['reward_vesting_steem'].split(' ')[0]);
        const steemPowerRewardsInVests = parseFloat(data['reward_vesting_balance'].split(' ')[0]);
        let noRewards = true;
        if (sbdRewards || steemRewards || steemPowerRewards) {
        	noRewards = false;
				}
        const selectiveData = {
          noRewards,
          next_power_down: data['next_vesting_withdrawal'],
          sbd_rewards: sbdRewards,
          steem_rewards: steemRewards,
          steem_power_rewards: steemPowerRewards,
          steem_power_rewards_in_vests: steemPowerRewardsInVests
        };
        dispatch(addDataToWallet(selectiveData));
      })
      .catch(error => {
        dispatch({
          type: 'GET_ACCOUNTS_SELECTIVE_DATA_ERROR',
          error
        })
      });
  }
}

export function claimAccountRewards(liquid_tokens, not_liquid_tokens, power_tokens) {
	return dispatch => {
    dispatch(actionLock());
    dispatch(showBodyLoader());
		ChainService.claimRewards(liquid_tokens || '0.000 STEEM', not_liquid_tokens || '0.000 SBD',
			power_tokens || '0.000000 VESTS')
			.then(() => {
        dispatch(actionUnlock());
        dispatch(hideBodyLoader());
				dispatch(pushMessage(Constants.WALLET.CLAIM_REWARD_SUCCESSFULLY));
        dispatch(addDataToWallet({noRewards: true}));
        dispatch(updateAccountBalance());
			})
			.catch(error => {
				dispatch({
					type: 'CLAIM_REWARDS_ERROR'
				});
        dispatch(actionUnlock());
        dispatch(hideBodyLoader());
				dispatch(pushErrorMessage(error));
			});
	}
}

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