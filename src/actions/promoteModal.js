import * as React from 'react';
import {getStore} from '../store/configureStore';
import UserService from '../services/userService';
import {openModal} from './modal';
import SendBidModal from '../components/PostModal/PromoteModal/SendBidModal/SendBidModal';
import Constants from '../common/constants';
import {actionLock, actionUnlock} from './session';
import ChainService from '../services/chainService';
import {pushErrorMessage, pushMessage} from './pushMessage';
import BotsService from '../services/botsService';

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

function setBidRequest(state) {
  return {
    type: 'SET_BID_REQUEST',
    state
  }
}

export function getAuthUserInfoSuccess(result) {
  return {
    type: 'GET_AUTH_USER_INFO_SUCCESS',
    result
  }
}

export function setTimerState(leftTime) {
  return {
    type: 'SET_TIMER_STATE',
    leftTime
  }
}

export function setPromoteInputError(error) {
  return {
    type: 'SET_PROMOTE_INPUT_ERROR',
    error
  }
}

export function setSelectError(error) {
  return {
    type: 'SET_SELECT_ERROR',
    error
  }
}

export function setPromoteValue(value) {
  return {
    type: 'SET_PROMOTE_VALUE',
    value
  }
}

export function setSelectedIndex(index) {
  let token = 0;
  if (index === 1) {
    token = 'STEEM';
  }
  if (index === 2) {
    token = 'SBD';
  }
  return {
    type: 'SET_SELECTED_INDEX',
    index,
    token
  }
}

export function getAuthUserInfo() {
  let state = getStore().getState();
  return dispatch => {
    dispatch(setAuthUserInfoLoading(true));
    UserService.getProfile(state.auth.user, state.settings.show_nsfw, state.settings.show_low_rated)
      .then(result => {
        dispatch(getAuthUserInfoSuccess({
          sbd_balance: result.sbd_balance,
          steem_balance: result.balance,
        }));
        dispatch(setAuthUserInfoLoading(false));
      })
      .catch(error => {
        dispatch({
          type: 'GET_AUTH_USER_INFO_ERROR',
          error
        })
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

export function searchingBotRequest(steemLink) {
  return dispatch => {
    dispatch(sendBotRequest(true));
    BotsService.getBotsList()
      .then(() => {
        let modalOption = {
          body: (<SendBidModal steemLink={steemLink}/>)
        };
        dispatch(openModal("SendBidModal", modalOption));
        dispatch(sendBotRequest(false));
      })
      .catch(error => {
        dispatch(pushErrorMessage(Constants.PROMOTE.FIND_BOT_ERROR));
        dispatch(sendBotRequest(false));
        console.log(error);
      });
  }
}

export function sendBid(steemLink, wif, botName) {
  let state = getStore().getState();
  let promoteModal = state.promoteModal;
  let activeKey = wif.replace(/\s+/g, '');
  let promoteAmount = promoteModal.promoteAmount.toString();
  promoteAmount = promoteAmount.replace(/^0+(\d+)/, '$1');
  if (/\./.test(promoteAmount)) {
    promoteAmount = promoteAmount + '000';
  } else {
    promoteAmount = promoteAmount + '.000';
  }
  promoteAmount = promoteAmount.replace(/(\d+\.\d{3})(\d*)/, '$1');
  let transferInfo = {
    wif: activeKey,
    recipient: botName,
    amount: promoteAmount + ' ' + promoteModal.selectedToken,
    postLink: steemLink
  };
  return dispatch => {
    if (state.session.actionLocked) {
      return;
    }
    dispatch(actionLock());
    dispatch(setBidRequest(true));
    ChainService.sendTransferTroughBlockchain(transferInfo)
      .then(response => {
        dispatch(actionUnlock());
        console.log(response);
        dispatch(pushMessage(Constants.PROMOTE.BID_TO_BOT_SUCCESS));
        dispatch(setBidRequest(false));
      })
      .catch(error => {
        dispatch(actionUnlock());
        dispatch(setBidRequest(false));
        if (!error.data && (error.actual === 128 || error.message === Constants.NON_BASE58_CHARACTER)) {
          dispatch(setActiveKeyError(Constants.PROMOTE.INVALID_ACTIVE_KEY));
          return dispatch(pushErrorMessage(Constants.PROMOTE.INVALID_ACTIVE_KEY));
        }
        dispatch(pushErrorMessage(error));
      });
  }
}