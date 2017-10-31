import RequestService from '../services/requestService';
import Constants from '../common/constants';
import Promise from 'bluebird';

Promise.config({
  warnings: true,
  cancellation: true,
  monitoring: true
});

const makeCancellableRequest = url => 
  new Promise((resolve, reject, onCancel) => {
      let xhr = new XMLHttpRequest();
      xhr.onload = resolve;
      xhr.onerror = reject;
      xhr.open("GET", url, true);
      xhr.send(null);
      onCancel(function() {
          xhr.abort();
      });
  });

let requestPromises = {
  [Constants.PROMISES.GET_COMMENTS] : Promise.resolve(),
  [Constants.PROMISES.GET_POSTS] : Promise.resolve()
}

async function getItems(url, promiseName, where) {
  let a = requestPromises[promiseName];
  debugger;
  if (requestPromises[promiseName].isPending()) requestPromises[promiseName].cancel();
  try {
    requestPromises[promiseName] = await makeCancellableRequest(url).then(response => JSON.parse(response.target.response));
    return requestPromises[promiseName];
  }
  catch(e) {
    console.warn(where);
    console.log(e);
    return [];
  }
}

export function getPosts(options) {
  const url = RequestService.handlev1_1BaseRequestPosts(options.point, options.params);
  return getItems(url, Constants.PROMISES.GET_POSTS, 'getPosts');
}

export function getPostComments(author, authorUrl) {
  const url = RequestService.handlev1_1BaseRequestPosts(`post/${author}/${authorUrl}/comments`);
  return getItems(url, Constants.PROMISES.GET_COMMENTS, 'getComments');
}
//END COMMENTS

/// <summary>
///     Examples:
///     1) GET https://steepshot.org/api/v1/user/joseph.kalu/posts HTTP/1.1
///     2) GET https://steepshot.org/api/v1/user/joseph.kalu/posts?
///            offset=%2Fcat1%2F%40joseph.kalu%2Fcat636203389144533548
///            &limit=3 HTTP/1.1
///            Cookie: sessionid=q9umzz8q17bclh8yvkkipww3e96dtdn3
/// </summary>

export function getUserPosts(author, offset) {
  const url = RequestService.handlev1_1BaseRequestPosts(`user/${author}/posts`, {
    offset: offset
  });

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

/// <summary>
///     Examples:
///     1) GET https://steepshot.org/api/v1/user/joseph.kalu/posts HTTP/1.1
///     2) GET https://steepshot.org/api/v1/user/joseph.kalu/posts?
///            offset=%2Fcat1%2F%40joseph.kalu%2Fcat636203389144533548
///            &limit=3 HTTP/1.1
///            Cookie: sessionid=q9umzz8q17bclh8yvkkipww3e96dtdn3
/// </summary>

export function getUserFeed(author, offset) {
  const url = RequestService.handlev1_1BaseRequestPosts('recent/posts', {
    offset: offset
  });
  console.log(url);
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



// export function getNewPostsByCategory(category, offset) {
//   category = category.replace(/[^A-Za-zА-Яа-яЁё(\d)+]/g, "")


export function getPostShaddow(urlPost) {
  const url = RequestService.handlev1_1BaseRequestPost(`post/${urlPost}/info`);
  
  return fetch(url, {
    method: 'GET'
  }).then((response) => {
    if (response.ok) {
      return response.json().then((json) => {
        return json;
      });
    } else {
      return response.json().then(() => {
        return null;
      });
    }
  });
}
