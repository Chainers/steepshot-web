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

  try {
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
  catch {
    console.log('Something went wrong in getUserProfile methos');
    return null;
  }
}

export function getFollowers(userName, currentUser, offset) {
  const options = {
    offset: offset,
    username: currentUser
  }
  const url = RequestService.handleRequestPosts(`user/${userName}/followers`, options);

  try {
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
  catch {
    console.warn('Something went wrong in getFollowers methos');
    return null;
  }
}

export function getFollowing(userName, currentUser, offset) {
  const options = {
    offset: offset,
    username: currentUser
  }
  const url = RequestService.handleRequestPosts(`user/${userName}/following`, options);

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
