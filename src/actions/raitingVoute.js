import constants from '../common/constants';
const baseUrl = constants.URLS.baseUrl;

export function voute(isVouteUp, identifierUrl) {
    let vType = (isVouteUp) ? 'upvote' : 'downvote';
    const url = `${baseUrl}/post${identifierUrl}/${vType}`;

    return fetch(url, {
        method: 'POST'
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