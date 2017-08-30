import constants from '../common/constants';
import { getStore } from '../store/configureStore';
import FormData from 'form-data';

const baseUrl = constants.URLS.baseUrl;

export function preparePost(message, transaction) {
  let form = new FormData();
  form.append('title', message[1].title);
  form.append('username', message[1].author);
  form.append('photo', message[1].body);
  form.append('trx', JSON.stringify(transaction));

  return fetch(`${baseUrl}/post/prepare`, {
    method: 'POST',
    body: form
  }).then(response => {
    if (response.ok) {
      return response.json().then((json) => {
        return json;
      });
    }
  });
}