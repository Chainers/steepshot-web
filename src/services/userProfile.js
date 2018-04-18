import RequestService from './requestService';

export function getProfile(userName) {
	const url = RequestService.handlev1_1RequestUserInfo(`user/${userName}/info`);
	return fetch(url, {
		method: 'GET'
	}).then((response) => {
		if (response.ok) {
			return response.json().then((json) => {
				return json;
			});
		} else {
			return [];
		}
	});
}

export function getFollowers(userName, offset) {
	const options = {
		offset: offset
	};
	const url = RequestService.handlev1_1BaseRequestPosts(`user/${userName}/followers`, options);

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

export function getFollowing(userName, offset) {
	const options = {
		offset: offset
	};
	const url = RequestService.handlev1_1BaseRequestPosts(`user/${userName}/following`, options);
	return fetch(url, {
		method: 'GET'
	}).then((response) => {
		const contentType = response.headers.get("content-type");
		if (response.ok && contentType && contentType.indexOf("application/json") !== -1) {
			return response.json().then((json) => {
				return json;
			});
		} else {
			return [];
		}
	});
}
