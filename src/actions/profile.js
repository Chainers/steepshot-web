import RequestService from '../services/requestService';

export function getUserProfile(userName) {
  const url = RequestService.handlev1_1RequestUserInfo(`user/${userName}/info`);

  return fetch(url, {
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

export function getFollowers(userName, offset) {
  const options = {
    offset: offset
  }
  const url = RequestService.handlev1_1BaseRequestPosts(`user/${userName}/followers`, options);

  return fetch(url, {
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

export function getFollowing(userName, offset) {
  const options = {
    offset: offset
  }
  const url = RequestService.handlev1_1BaseRequestPosts(`user/${userName}/following`, options);

  return fetch(url, {
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
