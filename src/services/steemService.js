import steem from 'steem';
import Constants from "../common/constants";
import PostService from "./postService";
import AuthService from "./authService";
import NodeService from "./nodeService";

class SteemService {

	static addCommentToBlockchain(commentOperation) {
		return processRequest(callback => {
			let beneficiaries = SteemService.getBeneficiaries(commentOperation[1].permlink, [{
				account: 'steepshot',
				weight: 1000
			}]);
			const operations = [commentOperation, beneficiaries];
			steem.broadcast.sendAsync(
				{operations, extensions: []},
				{posting: AuthService.getPostingKey()},
				callback
			);
		})
	}

	static changeVoteInBlockchain(postAuthor, permlink, power) {
		return processRequest(callback => {
			steem.broadcast.vote(AuthService.getPostingKey(), AuthService.getUsername(), postAuthor, permlink, power, callback);
		})
	}

	static deletePostFromBlockchain(permlink) {
		return processRequest(callback => {
			steem.broadcast.deleteComment(AuthService.getPostingKey(), AuthService.getUsername(), permlink, callback);
		})
	}

	static changeFollowInBlockchain(jsonData) {
		return processRequest(callback => {
			steem.broadcast.customJson(AuthService.getPostingKey(), [], [AuthService.getUsername()], 'follow', jsonData,
				callback
			);
		})
	}

	static addPostDataToBlockchain(operations) {
		return processRequest(callback => {
			steem.broadcast.sendAsync(
				{operations, extensions: []},
				{posting: AuthService.getPostingKey()}, callback
			);
		})
	}

	static getAccounts(username) {
		return processRequest(callback => {
			steem.api.getAccounts([username], callback);
		})
	}

	static wifIsValid(postingKey, pubWif) {
		return processRequest(() => {
			steem.auth.wifIsValid(postingKey, pubWif);
		})
	}

	static getValidTransaction() {
		const operation = [Constants.OPERATIONS.COMMENT, {
			parent_author: '',
			parent_permlink: '',
			author: AuthService.getUsername(),
			permlink: PostService.createPostPermlink('steepshot'),
			title: 'steepshot',
			description: '',
			body: 'steepshot',
			json_metadata: {
				tags: ['steepshot'],
				app: 'steepshot'
			}
		}];
		return processRequest(() => {
			return steem.broadcast._prepareTransaction({
				extensions: [],
				operations: [operation],
			})
		})
			.then(transaction => {
				return processRequest(() => {
					return steem.auth.signTransaction(transaction, [AuthService.getPostingKey()])
				})
			})
			.catch(error => {
				return Promise.reject(error);
			});
	}

	static getBeneficiaries(permlink, beneficiaries) {
		let beneficiariesObject = {
			author: AuthService.getUsername(),
			permlink: permlink,
			max_accepted_payout: Constants.STEEM_PATLOAD.MAX_ACCEPTED_PAYOUT,
			percent_steem_dollars: Constants.STEEM_PATLOAD.PERCENT_STEMM_DOLLARS,
			allow_votes: true,
			allow_curation_rewards: true,
			extensions: [[0, {beneficiaries: beneficiaries}]]
		};

		return [Constants.OPERATIONS.COMMENT_OPTIONS, beneficiariesObject];
	}
}

export default SteemService;

function processRequest(sendRequestFunction) {
	return new Promise((resolve, reject) => {
		const nodeService = new NodeService();
		checkingNode(resolve, reject, sendRequestFunction, nodeService);
	});
}

function checkingNode(resolve, reject, sendRequestFunction, nodeService) {
	processResponse(callback => {
		return sendRequestFunction(callback)
	})
		.then(response => {
			resolve(response);
		})
		.catch(error => {
			console.log(error);
			if (nodeService.isMaxCountRequests()) {
				reject(error);
			} else {
				nodeService.setNextNode();
				checkingNode(resolve, reject, sendRequestFunction, nodeService);
			}
		})
}

function processResponse(sendingFunction) {
	return new Promise((resolve, reject) => {
		const callback = (err, success) => {
			if (err) {
				reject(err);
			} else {
				resolve(success);
			}
		};
		const responsePromise = sendingFunction(callback);
		if (responsePromise instanceof Object) {
			responsePromise
				.then(response => {
					if(!response.error) {
						resolve(response);
					} else {
						reject(response.error);
					}
				})
				.catch(error => {
					reject(error);
				})
		}
	})
}