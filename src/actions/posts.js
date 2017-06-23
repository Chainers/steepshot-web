import LocalizedStrings from 'react-localization';

export function getPosts() {
  return fetch('https://steepshot.org/api/v1/posts/new', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }).then((response) => {
    if (response.ok) {
      return response.json().then((json) => {
        return json.results;
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
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }).then((response) => {
    if (response.ok) {
      return response.json().then((json) => {
        return json.results;
      });
    } else {
      return response.json().then(() => {
        return [];
      });
    }
  });
}
