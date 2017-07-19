import moment from 'moment';
import cookie from 'react-cookie';
import { browserHistory } from 'react-router';
import fakeAuth from '../components/Routes/fakeAuth';
import constants from '../common/constants';

const baseUrl = constants.URLS.baseUrl;


// User Auth  
// console.log(steem.auth.isWif(wif));

// console.log(steem.utils.validateAccountName(username));
// or
// steem.api.getAccounts([username], function(err, result) {
//   console.log(err, result);
// });


export function login(username, postingKey) {
    const url = `${baseUrl}/login-with-posting`;
    const bodyObject = {
      'username': username,
      'password': postingKey 
    };
    
    return fetch(url, {
      method: 'post',
      body: JSON.stringify(bodyObject),
      headers: { 
        'Content-Type': 'application/json' 
      }
    })
      .then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          localStorage.setItem('user', JSON.stringify(username));
          localStorage.setItem('postingKey', JSON.stringify(postingKey));
          fakeAuth.authenticate(() => history.push('/feed'));
          return {
            type: 'LOGIN_SUCCESS',
            postingKey: postingKey,
            user: username
          };
        });
      } else {
        response.json().then((json) => {
          return {
            type: 'LOGIN_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          };
        });
      }
    });
}

export function logout(history) {
  localStorage.removeItem('user');
  localStorage.removeItem('postingKey');
  fakeAuth.signout(() => history.push('/'));
  return {
    type: 'LOGOUT_SUCCESS'
  };
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
