import constants from '../common/constants';
import { getStore } from '../store/configureStore';
import FormData from 'form-data';

const baseUrl = constants.URLS.baseUrl;

export function preparePost(message, transaction) {
  let form = new FormData();
  form.append('title', message[1].title);
  form.append('username', message[1].author);
  form.append('photo', message[1].body);
  form.append('trx', transaction);

  return fetch(`${baseUrl}/post/prepare`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    body: form
  }).then(response => {
    if (response.ok) {
      console.log(response);
      console.log(JSON.parse(response));
      return JSON.parse(response);
    }
  });
}