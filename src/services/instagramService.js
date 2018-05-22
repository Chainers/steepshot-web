const INSTAGRAM_URL = 'https://www.instagram.com';

class InstagramService {
	constructor() {
		this.query_hash = null;
		this.id = null;
	}

	getInfo(username) {
		const url = INSTAGRAM_URL + '/' + username;
		fetch(url, {method: 'GET'})
			.then(response => {
				return response.text();
			})
			.then( response => {
				this.id = response.match(/(owner":{"id":")([^"']+)/)[2];
				console.log(this.id);
				const scriptUrl = INSTAGRAM_URL + response.match('[^"\']+ProfilePageContainer[^"\']+')[0];
				return fetch(scriptUrl, {method: 'GET'})
			})
			.then(response => {
				return response.text();
			})
			.then( response => {
				this.query_hash = response.match(/(n\.pagination:n},queryId:")([^"']+)/)[2];

			})
			.catch( error => {
				console.log(error);
			})
	}
}

export default InstagramService;