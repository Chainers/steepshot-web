import Constants from "../common/constants";

export function getCreateWaitingTime(username) {
	const url = `${Constants.URLS.baseUrl_v1_1}/user/${username}/spam`;
	return fetch(url, {
		method: 'GET'
	}).then((response) => {
			if (response.ok) {
				return response.json().then(data => {
					return data
				});
			}
			throw Error(response.status);
	})
}
