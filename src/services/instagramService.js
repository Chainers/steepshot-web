const INSTAGRAM_URL = 'https://www.instagram.com';
const POST_URL = '/graphql/query/';

class InstagramService {
	constructor() {
		this.queryHash = null;
		this.sharedData = null;
		this.userData = null;
	}

	getInfo(username) {
		const url = INSTAGRAM_URL + '/' + username + '/';
		fetch(url, {
			method: 'GET'
		})
			.then(response => {
				let iterator = response.headers.keys();
				while(true) {
					let result = iterator.next();
					if (result.done) break;
				}
				return response.text();
			})
			.then(response => {
				this.sharedData = JSON.parse(response.match(/(window._sharedData = )(.*)(;<\/script>)/)[2]);
				this.userData = this.sharedData.entry_data.ProfilePage[0].graphql.user;
				const scriptUrl = 'https:' + response.match('[^"\']+ProfilePageContainer[^"\']+')[0];
				console.log(scriptUrl);
				return fetch(scriptUrl, {
					method: 'GET'
				})
			})
			.then(response => {
				return response.text();
			})
			.then(response => {
				this.queryHash = response.match(/(n\.pagination:n},queryId:")([^"']+)/)[2];
				console.log(this.sharedData);
				console.log(this.queryHash);
				console.log(this.userData);
				return this.getPosts();
			})
			.then(response => {
				console.log(response);
			})
			.catch(error => {
				console.log(error);
			})
	}

	getPosts() {
		const urlVariable = {
			id: this.userData.id,
			first: 12,
			after: this.userData.edge_owner_to_timeline_media.page_info.end_cursor
		};
		let requestUrl = INSTAGRAM_URL + POST_URL + '?query_hash=' + this.queryHash + '&variables=' + encodeURIComponent(JSON.stringify(urlVariable));
		return fetch(requestUrl, {
			method: 'GET',
			credentials: 'include'
		});
	}

}

export default InstagramService;