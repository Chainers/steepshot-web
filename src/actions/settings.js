import constants from '../common/constants';
import { getStore } from '../store/configureStore';

const baseUrl = constants.URLS.baseUrl;

function getUrl() {
    if (getStore().getState().auth.user){
      return baseUrl + '/' + getStore().getState().auth.user
    }
  
    return baseUrl;
  }

export function getNSFW() {
    return fetch(`${getUrl()}/user/nsfw`, {
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

export function getLowRated() {
    return fetch(`${getUrl()}/user/low-rated`, {
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

export function updateLowRated(lowRated) {
    return fetch(`${getUrl()}/user/low-rated`, {
        method: 'POST',
        data: JSON.stringify({
            show_low_rated: lowRated
        })
      }).then((response) => {
        if (response.ok) {
          return response.json().then((json) => {
            return json;
          });
        } else {
          return undefined;
        }
      });
}

export function updateNSFW(nsfw) {
    return fetch(`${getUrl()}/user/nsfw`, {
        method: 'POST',
        data: JSON.stringify({
            show_nsfw: nsfw
        })
      }).then((response) => {
        if (response.ok) {
          return response.json().then((json) => {
            return json;
          });
        } else {
          return undefined;
        }
      });
}