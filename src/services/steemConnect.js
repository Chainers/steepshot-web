import sc2 from 'sc2-sdk';
import AuthService from "./authService";
import SteemService from "./steemService";

const callbackURL = `${document.location.origin}/steemConnect`;
const api = sc2.Initialize({
	app: 'dev.steepshot',
	callbackURL,
	scope: ['login', 'offline', 'vote', 'comment', 'delete_comment', 'comment_options', 'custom_json']
});

class SteemConnect {

	static getLoginUrl() {
		return api.getLoginURL()
	}

	init() {
		api.setAccessToken(AuthService.getAccessToken());
	}

	addCommentToBlockchain(commentOperation) {
		console.log('form connect');
		let beneficiaries = this.getBeneficiaries(commentOperation[1].permlink, [{
			account: 'steepshot',
			weight: 1000
		}]);
		const operations = [commentOperation, beneficiaries];
		return api.broadcast(operations).then(response => Promise.resolve(response.result));
	}

	changeVoteInBlockchain(postAuthor, permlink, power) {
		return api.vote(AuthService.getUsername(), postAuthor, permlink, power);
	}

	deletePostFromBlockchain(permlink) {

	}

	changeFollowInBlockchain(jsonData) {

	}

	addPostDataToBlockchain(operations) {

	}

	getAccounts(username) {
		return SteemService.getAccounts(username);
	}

	wifIsValid() {
		throw new Error('Only for base authorization')
	}

	getValidTransaction() {
		throw new Error('Only for base authorization')
	}

	getBeneficiaries(permlink, beneficiaries) {
		return SteemService.getBeneficiaries(permlink, beneficiaries)
	}
}

export default SteemConnect;