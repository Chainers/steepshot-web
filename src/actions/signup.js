// import moment from 'moment';
// import cookie from 'react-cookie';
import config from '../config';
import { browserHistory } from 'react-router';

export function clubSignUp(data) {
  return fetch(config.serverUrl + '/api/v1/login', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: userId
    })
  }).then((response) => {
    if (response.ok) {
      return response.json().then((json) => {
        return json;
      });
    } else {
      return [];
    }
  });
}
