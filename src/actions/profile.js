import RequestService from '../services/requestService';

/// <summary>
///     Examples:
///     1) GET https://steepshot.org/api/v1/user/joseph.kalu/info HTTP/1.1
/// </summary>

export function getUserProfile(userName, currentUser) {
  const options = {
    username: currentUser
  }
  const url = RequestService.handleRequestUserInfo(`user/${userName}/info`, options);

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

export function getFollowers(userName, currentUser, offset) {
  const options = {
    offset: offset,
    username: currentUser
  }
  const url = RequestService.handleBaseRequestPosts(`user/${userName}/followers`, options);

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

export function getFollowing(userName, currentUser, offset) {
  const options = {
    offset: offset,
    username: currentUser
  }
  const url = RequestService.handleBaseRequestPosts(`user/${userName}/following`, options);

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
