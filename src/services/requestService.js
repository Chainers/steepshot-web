import Constants from "../common/constants";

class RequestService {

	get(url, options) {
		const url = Constants.URLS.baseUrl_v1_1 + '/' + url + RequestService.convertOptionsToRequestString(options);
		return fetch(url, {
			method: 'GET'
		}).then(RequestService.processResponse);
	}

	post(url, data) {
		const options = {
			method: 'POST'
		};
		if (RequestService.isJson(data)) {
			options.headers = {'Content-Type': 'application/json'};
			options.body = JSON.stringify(data)
		} else {
			options.body = data
		}

		return fetch(`${Constants.URLS.baseUrl_v1_1}/post/prepare`, options)
			.then(RequestService.processResponse);
	}

	static processResponse(response) {
		if (response.ok && response.status === 200) {
			const contentType = response.headers.get("content-type");
			if (contentType && contentType.indexOf("application/json") !== -1) {
				return response.json();
			}
			return response;
		}
		return Promise.reject(response);
	}

	static isJson(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	static convertOptionsToRequestString(options) {
		if (!options) return '';

		let optionsArray = [];
		for (let key in options) {
			if (options[key]) optionsArray.push(key + '=' + RequestService.convertIfBool(options[key]));
		}
		return '?' + optionsArray.join('&');
	}

	static convertIfBool(option) {
		if (option === true) {
			return "1";
		} else if (option === false) {
			return "0";
		} else {
			return option;
		}
	}

}

export default new RequestService();
