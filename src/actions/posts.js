import LocalizedStrings from 'react-localization';

export function getPosts() {
  return fetch('https://steepshot.org/api/v1/posts/new', {
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


//https://steepshot.org/api/v1/posts/top?limit=10&offset=/reiki-trail/@reiki-trail/reiki-boost-healing-invocation-9
export function getPostsNext(offset) {
  let url = 'https://steepshot.org/api/v1/posts/new';
  if(offset) {
    url = `https://steepshot.org/api/v1/posts/top?limit=10&offset=${offset}`;
  }
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


//https://steepshot.org/api/v1/post/joseph//steemfest/@joseph/win-a-free-trip-to-lisbon-portugal-to-attend-steemfest-ii/comments

export function getPostComments(author, url) {
  return fetch(`https://steepshot.org/api/v1/post/${author}/${url}/comments`, {
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

export function getUserPosts(author, offset) {
  let url = `https://steepshot.org/api/v1/user/${author}/posts`;
  if (offset) {
    url = `https://steepshot.org/api/v1/user/${author}/posts?offset=${offset}&limit=3`;
  }
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
