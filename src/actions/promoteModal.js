import * as React from 'react';
import {getStore} from '../store/configureStore';
import UserService from '../services/UserService';
import {closeModal, openModal} from './modal';
import SendBid from '../components/Modals/SendBid/SendBid';
import Constants from '../common/constants';
import {actionLock, actionUnlock} from './session';
import {pushErrorMessage, pushMessage} from './pushMessage';
import BotsService from '../services/BotsService';
import storage from '../utils/Storage';
import WalletService from "../services/WalletService";
import {hideBodyLoader, showBodyLoader} from "./bodyLoader";
import {getUserProfileSuccess} from "./userProfile";
import {changeAmount} from "./wallet";

function setAuthUserInfoLoading(param) {
	return {
		type: 'SET_AUTH_USER_INFO_LOADING',
		loading: param
	}
}

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

export function getAuthUserInfoError(error) {
	return {
		type: 'GET_AUTH_USER_INFO_ERROR',
		error: error.statusText
	}

}

export function setActiveKeyInputSecurity(state) {
	return {
		type: 'SET_ACTIVE_KEY_INPUT_SECURITY',
		state: !state
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

export function setActiveKey(value) {
	let activeKey = value.replace(/\s+/g, '');
	return dispatch => {
		dispatch(setActiveKeyError(''));
		dispatch({
			type: 'SET_ACTIVE_KEY',
			key: activeKey
		})
	}
}

export function setPromoteInputError(error) {
	return {
		type: 'SET_PROMOTE_INPUT_ERROR',
		error
	}
}

export function getAuthUserInfo() {
	let state = getStore().getState();
	return dispatch => {
		dispatch(setAuthUserInfoLoading(true));
		dispatch(changeAmount(0.5));
		UserService.getProfile(state.auth.user, state.settings.show_nsfw, state.settings.show_low_rated)
			.then(result => {
				dispatch(getUserProfileSuccess(result));
				dispatch(setAuthUserInfoLoading(false));
			})
			.catch(error => {
				dispatch(getAuthUserInfoError(error));
			})
	}
}

export function setActiveKeyError(activeKeyError) {
	return {
		type: 'SET_ACTIVE_KEY_ERROR',
		activeKeyError
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
				dispatch(openModal("SendBid", modalOption));
				dispatch(sendBotRequest(false));
			})
			.catch((error) => {
				console.log(error);
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
	let state = getStore().getState();
	const {postIndex, activeKey, suitableBot} = state.promoteModal;
	const botName = suitableBot.name;
	return dispatch => {
		if (state.session.actionLocked) {
			return;
		}
		if (!activeKey) {
			setActiveKeyError(Constants.PROMOTE.EMPTY_KEY_INPUT);
			return;
		}
		const steemLink = `https://steemit.com${postIndex}`;
		const selectedToken = state.services.tokensNames[state.wallet.selectedToken];
		dispatch(actionLock());
		dispatch(showBodyLoader());
		WalletService.transfer(activeKey, state.wallet.amount, selectedToken, botName, steemLink)
			.then(() => {
				dispatch(actionUnlock());
				dispatch(pushMessage(Constants.PROMOTE.BID_TO_BOT_SUCCESS));
				dispatch(hideBodyLoader());
				storage.activeKey = state.promoteModal.activeKey;
				dispatch(closeModal("SendBid"));
			})
			.catch(error => {
				dispatch(actionUnlock());
				dispatch(hideBodyLoader());
				if (!error.data && (error.actual === 128 || error.message === Constants.NON_BASE58_CHARACTER)) {
					dispatch(setActiveKeyError(Constants.PROMOTE.INVALID_ACTIVE_KEY));
					return dispatch(pushErrorMessage(Constants.PROMOTE.INVALID_ACTIVE_KEY));
				}
				dispatch(pushErrorMessage(error));
			});
	}
}