import RequestService from "./requestService";

export function getCreateWaitingTime(username) {
	const url = `${RequestService.getBasev1_1Url()}/user/${username}/spam`;
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
