import React from 'react';
import {getStore} from '../store/configureStore';
import {closeModal, openModal} from './modal';
import SendBid from '../components/Modals/SendBid/SendBid';
import Constants from '../common/constants';
import {actionLock, actionUnlock} from './session';
import {pushErrorMessage, pushMessage} from './pushMessage';
import BotsService from '../services/BotsService';
import storage from '../utils/Storage';
import WalletService from '../services/WalletService';
import {hideBodyLoader, showBodyLoader} from './bodyLoader';
import {stopTransferWithError} from './transfer';
import {changeAmount} from './wallet';

function sendBotRequest(state) {
	return {
		type: 'SET_BOT_REQUEST',
		state
	}
}

function searchingNewBotError(error) {
	return {
		type: 'SEARCHING_NEW_BOR_ERROR',
		error
	}
}

export function clearPromoteModalInfo() {
	return dispatch => {
    dispatch(setPromoteInputError(''));
    dispatch(changeAmount(Constants.TRANSFER.MIN_AMOUNT));
	}
}

export function setRedTimer(param) {
	return {
		type: 'SET_RED_TIMER',
		param
	}
}

export function setBlockedTimer(param) {
	return {
		type: 'SET_BLOCKED_TIMER',
		param
	}
}

export function addPostIndex(postIndex) {
	return {
		type: 'ADD_POST_INDEX',
		postIndex
	}
}

export function setPromoteInputError(error) {
  return dispatch => {
		dispatch({
			type: 'SET_PROMOTE_INPUT_ERROR',
			error
		});
		if (error) dispatch(pushMessage(error));
	}
}

export function addBot(bot) {
	return {
		type: 'ADD_BOT',
		bot
	}
}

export function searchingBotRequest() {
	return dispatch => {
		dispatch(sendBotRequest(true));
		BotsService.getBotsList()
			.then(() => {
				let modalOption = {
					body: (<SendBid/>)
				};
				if (getStore().getState().modals["PromoteModal"]) {
          dispatch(openModal("SendBid", modalOption));
				}
				dispatch(sendBotRequest(false));
			})
			.catch(() => {
				dispatch(pushErrorMessage(Constants.PROMOTE.FIND_BOT_ERROR));
				dispatch(sendBotRequest(false));
			});
	}
}

export function searchingNewBot() {
	return dispatch => {
		dispatch(setBlockedTimer(true));
		BotsService.getBotsList()
			.then(() => {
				dispatch(setRedTimer(false));
				dispatch(setBlockedTimer(false));
			})
			.catch((error) => {
				dispatch(searchingNewBotError(error));
				dispatch(pushErrorMessage(Constants.PROMOTE.FIND_BOT_ERROR));
				dispatch(setRedTimer(false));
				dispatch(setBlockedTimer(false));
				dispatch(closeModal("SendBid"));
			});
	}
}

export function sendBid() {
  const state = getStore().getState();
  const {activeKey, saveKey} = state.activeKey;
	return dispatch => {
		if (state.session.actionLocked) {
			return;
		}
    const {postIndex, suitableBot} = state.promoteModal;
		const {amount, selectedToken} = state.wallet;
    const botName = suitableBot.name;
		const steemLink = `https://steemit.com${postIndex}`;
		const selectedTokenName = state.services.tokensNames[selectedToken];
		dispatch(actionLock());
		dispatch(showBodyLoader());
    if (storage.accessToken) {
      WalletService.steemConnectTransfer(amount, selectedTokenName, botName, steemLink)
        .then(() => {
          dispatch(actionUnlock());
          dispatch(hideBodyLoader());
        })
        .catch(error => {
          dispatch(stopTransferWithError(error));
        });
      return;
    }
		WalletService.transfer(activeKey || storage.activeKey, amount, selectedTokenName, botName, steemLink)
			.then(() => {
				dispatch(actionUnlock());
				dispatch(pushMessage(Constants.PROMOTE.BID_TO_BOT_SUCCESS));
				dispatch(hideBodyLoader());
        if (saveKey && !storage.activeKey) storage.activeKey = activeKey;
				dispatch(closeModal("SendBid"));
			})
			.catch(error => {
        dispatch(stopTransferWithError(error));
			});
	}
}