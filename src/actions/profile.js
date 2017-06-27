/// <summary>
///     Examples:
///     1) GET https://steepshot.org/api/v1/user/joseph.kalu/info HTTP/1.1
/// </summary>

export function getUserProfile(userName) {
  return fetch(`https://steepshot.org/api/v1/user/${userName}/info`, {
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
