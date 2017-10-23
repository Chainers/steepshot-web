import constants from '../common/constants';
const baseUrl = constants.URLS.baseUrl_v1;

export function setFlag(postUrl, data) {
    const url = `${baseUrl}/log/post/${postUrl}/flag`;

    return fetch(url, {
        method: 'POST',
        body: data,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then((response) => {
        if (response.ok) {
            return response.json().then((json) => {
                console.log(json);
                return json;
            });
        } else {
            return response.json().then(() => {
                return [];
            });
        }
    });
}