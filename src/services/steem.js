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



	afterCheckingPlagiarism(operation, prepareData, beneficiaries) {
		return _sendToBlockChain(operation, prepareData, beneficiaries)
			.then(response => {
				const data = {
					username: AuthService.getUsername(),
					error: ''
				};
				LoggingService.logPost(data);
				return response;
			})
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

function _fileUpload(file) {
	return SteemService.getValidTransaction()
		.then(transaction => {
			let form = new FormData();
			form.append('file', file);
			form.append('trx', JSON.stringify(transaction));
			return fetch(`${Constants.URLS.baseUrl_v1_1}/media/upload`, {
				method: 'POST',
				body: form
			}).then(response => response.json()).catch(error => console.warn(error));
		})
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

function _preparePost(media, description, tags, permlink) {
	const options = {
		"username": AuthService.getUsername(),
		"media": [media],
		"description": description,
		"post_permlink": `@${AuthService.getUsername()}/${permlink}`,
		"tags": tags,
		"show_footer": true,
		device: 'web'
	};
	return fetch(`${Constants.URLS.baseUrl_v1_1}/post/prepare`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			...options
		})
	}).then(response => response.json());
}

function _getValidTags(tags) {
	if (!tags) {
		tags = 'steepshot ';
	}
	tags = tags.split(' ');
	let empty = tags.indexOf('');
	while (empty !== -1) {
		tags.splice(empty, 1);
		empty = tags.indexOf('');
	}
	return tags;
}

export default new Steem();
