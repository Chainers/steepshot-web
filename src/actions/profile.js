import RequestService from '../services/requestService';

/// <summary>
///     Examples:
///     1) GET https://steepshot.org/api/v1/user/joseph.kalu/info HTTP/1.1
/// </summary>

export function getUserProfile(userName) {
  const url = RequestService.handleRequestUserInfo(`user/${userName}/info`);

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
    offset: offset,
    limit: 20
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

export function getFollowing(userName, offset) {
  const options = {
    offset: offset,
    limit: 20
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
