import sc2 from 'sc2-sdk';

class SteemConnect {
	constructor() {
		this.api = sc2.Initialize({
			app: 'busy.app',
			callbackURL: 'https://steemit.github.io/example-steemconnect-angular',
			scope: ['vote', 'comment']
		});
	}

	getLoginUrl() {
		return this.api.getLoginURL()
	}

	setAccessToken(accessToken) {
		this.api.setAccessToken(accessToken);
		return new Promise((resolve, reject) => {
			this.api.me(function (err, result) {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			})
		})
	}
}

export default new SteemConnect();