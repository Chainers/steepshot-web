import steem from 'steem';
import Promise from 'bluebird';
import FormData from 'form-data';
import {blockchainErrorsList} from "../utils/blockchainErrorsList";
import Constants from "../common/constants";
import LoggingService from "./loggingService";
import PostService from "./postService";
import SteemService from "./steemService";
import AuthService from "./authService";

class Steem {
	constructor() {
		steem.api.setOptions({url: 'https://api.steemit.com'});
	}

	deletePost(wif, author, permlink, callback) {
		const callbackBc = (err, success) => {
			if (err) {
				const data = {
					username: author,
					error: err.message
				};
				LoggingService.logDeletedPost(author, permlink , data);
				let checkedError = blockchainErrorsList(err);
				callback(checkedError, null);
			} else if (success) {
				const data = {
					username: author
				};
				LoggingService.logDeletedPost(author, permlink, data);
				callback(null, success);
			}
		};
		steem.broadcast.deleteComment(wif, author, permlink, callbackBc);
	}


	editDelete(title, tags, description, permlink, parentPerm) {
		let json_metadata = {
			tags: tags,
			app: 'steepshot',
		};
		const operation = [Constants.OPERATIONS.COMMENT, {
			parent_author: '',
			parent_permlink: parentPerm,
			author: AuthService.getUsername(),
			permlink,
			title,
			description,
			body: '*deleted*',
			json_metadata: JSON.stringify(json_metadata)
		}];
		return _sendToBlockChain(operation, false, false)
			.then(response => {
				const data = {
					username: AuthService.getUsername(),
					error: ''
				};
				LoggingService.logDeletedPost(AuthService.getUsername(), permlink, data);
				return response;
			})
	}
}

function _sendToBlockChain(operation, prepareData, beneficiaries) {
	return new Promise((resolve, reject) => {
		if (prepareData) {
			operation[1].body = prepareData.body;
			operation[1].json_metadata = JSON.stringify(prepareData.json_metadata);
		}
		let operations;
		if (beneficiaries) {
			operations = [operation, beneficiaries];
		} else {
			operations = [operation]
		}
		const callback = (err, success) => {
			if (success) {
				resolve(success);
				return;
			}
			let checkedError = blockchainErrorsList(err);
			reject(new Error(checkedError));
		};
		steem.broadcast.sendAsync(
			{operations, extensions: []},
			{posting: AuthService.getPostingKey()}, callback
		);
	})
}

export default new Steem();
