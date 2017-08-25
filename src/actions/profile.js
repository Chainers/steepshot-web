import constants from '../common/constants';
import { getStore } from '../store/configureStore';

const baseUrl = constants.URLS.baseUrl;

function getUrl() {
  if (getStore().getState().auth.user){
    return baseUrl + '/' + getStore().getState().auth.user
  }

  return baseUrl;
}

/// <summary>
///     Examples:
///     1) GET https://steepshot.org/api/v1/user/joseph.kalu/info HTTP/1.1
/// </summary>

export function getUserProfile(userName) {
  return fetch(`${getUrl()}/user/${userName}/info`, {
    method: 'GET'
  }).then((response) => {
    if (response.ok) {
      return response.json().then((json) => {
        return json;
      });
    } else {
      return response.json().then(() => {
        return [];
      });
    }
  });
}
