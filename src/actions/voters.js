import RequestService from '../services/requestService';

export function getVoters(options, dispatch) {
    const url = RequestService.handlev1_1BaseRequestPosts(options.point, options.params);

    fetch(url, {
      method: 'GET'
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          return dispatch({ type : 'NEW_LIKES_INFO', voters : json });
        });
      } else {
        return response.json().then(() => {
          return dispatch({ type : 'NEW_LIKES_INFO', voters : {} });
        });
      }
    });
}
