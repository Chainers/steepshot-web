import RequestService from "./requestService";

export function getCreateWaitingTime(username) {
	const url = `${RequestService.getBasev1_1Url()}/user/${username}/spam`;
	return fetch(url, {
		method: 'GET'
	}).then((response) => {
		return new Promise((resolve, reject) => {
			if (response.ok) {
				return response.json().then(data => {
					resolve(data)
				});
			} else {
				return response.json().then(error => {
					reject(new Error(JSON.stringify(error)))
				});
			}
		})
	})
}
