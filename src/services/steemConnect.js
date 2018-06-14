import sc2 from 'sc2-sdk';

class SteemConnectV2 {
	constructor() {
		const callbackURL = `${document.location.origin}/steemConnect`;
		this.api = sc2.Initialize({
			app: 'dev.steepshot',
			callbackURL,
			scope: ['login', 'offline', 'vote', 'comment', 'delete_comment', 'comment_options', 'custom_json']
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
const SteemConnect = new SteemConnectV2();
export default SteemConnect;