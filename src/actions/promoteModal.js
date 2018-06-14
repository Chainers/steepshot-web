import * as React from 'react';
import {getStore} from '../store/configureStore';
import UserService from '../services/userService';
import {openModal} from './modal';
import SendBidModal from '../components/PostModal/PromoteModal/SendBidModal/SendBidModal';
import Constants from '../common/constants';
import {actionLock} from './session';

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

function sendBidRequest(state) {
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
      .then( result => {
        dispatch(getAuthUserInfoSuccess(result));
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

export function searchingBotRequest(steemLink) {
  let state = getStore().getState();
  return dispatch => {
    /*if (state.session.actionLocked) {
      return;
    }
    dispatch(actionLock());*/
    dispatch(sendBotRequest(true));
    if (true) {
      let modalOption = {
        body: (<SendBidModal steemLink={steemLink}/>)
      };
      dispatch(openModal("SendBidModal", modalOption));
      dispatch(sendBotRequest(false));
    } else {
      this.props.pushMessage(Constants.PROMOTE.FIND_BOT_ERROR);
      dispatch(sendBotRequest(false));
    }
  }
}

export function sendBid(steemLink) {
  let state = getStore().getState();
  return dispatch => {
    /*if (state.session.actionLocked) {
      return;
    }
    dispatch(actionLock());*/
    dispatch(sendBidRequest(true));
  }
}