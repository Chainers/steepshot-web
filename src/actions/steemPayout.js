import constants from '../common/constants';
import { getStore } from '../store/configureStore';

const baseUrl = constants.URLS.baseUrl;

function getUrl() {
  if (getStore().getState().auth.user){
    return baseUrl + '/' + getStore().getState().auth.user
  }

  return baseUrl;
}

export function preparePost(message, object) {
  return fetch(`${getUrl()}/post/prepare`, {
    method: 'POST',
    data: JSON.stringify({
        
    })
  }).then(response => {
        return JSON.parse(response);
  });
}