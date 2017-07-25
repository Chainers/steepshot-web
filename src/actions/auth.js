import moment from 'moment';
import cookie from 'react-cookie';
import { browserHistory } from 'react-router';
import fakeAuth from '../components/Routes/fakeAuth';
import constants from '../common/constants';
import steem from 'steem';

const baseUrl = constants.URLS.baseUrl;

export function login(username, postingKey, history, dispatch) {
  const account = null;
  steem.api.getAccounts([username], function(err, result) {
    if (err || !steem.auth.isWif(postingKey)) {
      return {
        type: 'LOGIN_FAILURE',
        messages: "Not valid user name or posting key"
      };
    } else if (result && steem.auth.isWif(postingKey)){
      localStorage.setItem('user', JSON.stringify(username));
      localStorage.setItem('postingKey', JSON.stringify(postingKey));
      dispatch({
        type: 'LOGIN_SUCCESS',
        postingKey: postingKey,
        user: username
      });
      fakeAuth.authenticate(() => history.push('/feed'));
    }
  });
}

export function logout(history, dispatch) {
  localStorage.removeItem('user');
  localStorage.removeItem('postingKey');
  dispatch({
    type: 'LOGOUT_SUCCESS'
  });
  fakeAuth.signout(() => history.push('/browse'));
}

export function updateProfile(state, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/account', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email: state.email,
        name: state.name,
        gender: state.gender,
        location: state.location,
        website: state.website
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'UPDATE_PROFILE_SUCCESS',
            messages: [json]
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'UPDATE_PROFILE_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function changePassword(password, confirm, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/account', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        password: password,
        confirm: confirm
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'CHANGE_PASSWORD_SUCCESS',
            messages: [json]
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'CHANGE_PASSWORD_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function deleteAccount(token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/account', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(logout());
          dispatch({
            type: 'DELETE_ACCOUNT_SUCCESS',
            messages: [json]
          });
        });
      }
    });
  };
}
