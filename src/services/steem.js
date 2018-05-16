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

	comment(wif, parentAuthor, parentPermlink, author, body, tags, callback) {
		const permlink = PostService.createPostPermlink(`${author} comment`);
		const commentObject = {
			parent_author: parentAuthor,
			parent_permlink: parentPermlink,
			author: author,
			permlink: permlink,
			title: "",
			body: body,
			json_metadata: JSON.stringify(_createJsonMetadata(tags))
		};
		const commentOperation = [Constants.OPERATIONS.COMMENT, commentObject];

		const callbackBc = (err, success) => {
			if (err) {
				let checkedError = blockchainErrorsList(err);
				callback(checkedError, null);
				const data = JSON.stringify({
					username: author,
					error: err.message
				});
				LoggingService.logComment(parentAuthor, parentPermlink, data);
			} else if (success) {
				const data = JSON.stringify({
					username: author,
					error: ''
				});
				LoggingService.logComment(parentAuthor, parentPermlink, data);
				callback(null, success);
			}
		};
		this.handleBroadcastMessagesComment(commentOperation, wif, callbackBc);
	}

	handleBroadcastMessagesComment(message, postingKey, callback) {
		let beneficiaries = SteemService.getBeneficiaries(message[1].permlink, {
			account: 'steepshot',
			weight: 1000
		});
		const operations = [message, beneficiaries];
		steem.broadcast.sendAsync(
			{operations, extensions: []},
			{posting: postingKey}, callback
		);
	}

	vote(wif, username, author, url, voteStatus, power, callback) {
		const callbackBc = (err, success) => {
			if (err) {
				let checkedError = blockchainErrorsList(err);
				callback(checkedError, null);
				const data = JSON.stringify({
					username: username,
					error: err.message
				});
				LoggingService.logVote(voteStatus, author, url, data);
			} else if (success) {
				const data = JSON.stringify({
					username: username,
					error: ''
				});
				LoggingService.logVote(voteStatus, author, url, data);
				callback(null, success);
			}
		};

		steem.api.getContentAsync(author, url).then((response) => {
			steem.broadcast.vote(wif, username, response.author, response.permlink, voteStatus ? power : 0, callbackBc);
		});
	}

	flag(wif, username, author, url, flagStatus, callback) {

		const callbackBc = (err, success) => {
			if (err) {
				let checkedError = blockchainErrorsList(err);
				callback(checkedError, null);
				const data = JSON.stringify({
					username: username,
					error: err.message
				});
				LoggingService.logVote(flagStatus, author, url, data);
			} else if (success) {
				const data = JSON.stringify({
					username: username
				});
				LoggingService.logFlag(author, url, data);
				callback(null, success);
			}
		};

		steem.api.getContentAsync(author, url).then((response) => {
			steem.broadcast.vote(wif, username, response.author, response.permlink, flagStatus ? -10000 : 0, callbackBc);
		});
	}


	_sendBroadCasts(operations, postingWif) {
		steem.broadcast.sendAsync({operations, extensions: []}, {posting: postingWif});
	}

	/** Follow an user */
	followUnfollowUser(wif, follower, following, status) {

		let blog = ['blog'];
		if (status) blog = [];

		const json = JSON.stringify(
			[Constants.OPERATIONS.FOLLOW, {
				follower: follower,
				following: following,
				what: blog
			}]
		);

		return new Promise((resolve, reject) => {
			const callbackBc = (err, result) => {
				const data = JSON.stringify({
					username: follower,
					error: err ? err.message : ''
				});
				LoggingService.logFollow(status, following, data);

				if (err) {
					let checkedError = blockchainErrorsList(err);
					reject(new Error(checkedError));
				} else {
					resolve(result)
				}
			};

			steem.broadcast.customJson(
				wif,
				[], // Required_auths
				[follower], // Required Posting Auths
				'follow', // Id
				json,
				callbackBc
			);
		});
	}


	deletePost(wif, author, permlink, callback) {
		const callbackBc = (err, success) => {
			if (err) {
				const data = JSON.stringify({
					username: author,
					error: err.message
				});
				LoggingService.logDeletedPost(author, permlink, data);
				let checkedError = blockchainErrorsList(err);
				callback(checkedError, null);
			} else if (success) {
				const data = JSON.stringify({
					username: author
				});
				LoggingService.logDeletedPost(author, permlink, data);
				callback(null, success);
			}
		};
		steem.broadcast.deleteComment(wif, author, permlink, callbackBc);
	}

	editPost(title, tags, description, permlink, parentPerm, media) {
		tags = _getValidTags(tags);
		const operation = [Constants.OPERATIONS.COMMENT, {
			parent_author: '',
			parent_permlink: parentPerm,
			author: AuthService.getUsername(),
			permlink,
			title,
			description,
			body: 'empty',
			json_metadata: {
				tags: tags,
				app: 'steepshot'
			}
		}];
		return _preparePost(media, description, tags, permlink)
			.then(response => {
				return _sendToBlockChain(operation, response)
			})
			.then(response => {
				const data = JSON.stringify({
					username: AuthService.getUsername(),
					error: ''
				});
				LoggingService.logPost(data);
				return response;
			})
	}

	createPost(tags, title, description, file) {
		tags = _getValidTags(tags);
		const category = tags[0];
		const permlink = PostService.createPostPermlink(title);
		const operation = [Constants.OPERATIONS.COMMENT, {
			parent_author: '',
			parent_permlink: category,
			author: AuthService.getUsername(),
			permlink: permlink,
			title: title,
			description: description,
			body: 'empty',
			json_metadata: {
				tags: tags,
				app: 'steepshot'
			}
		}];
		return _fileUpload(file)
			.then(response => {
				return _preparePost(response, description, tags, permlink, AuthService.getUsername());
			})
			.then(response => {
				let beneficiaries = SteemService.getBeneficiaries(operation[1].permlink, response.beneficiaries);
				let plagiarism = response.is_plagiarism;
				if (plagiarism.is_plagiarism) {
					let data = {
						ipfs: response.json_metadata.ipfs_photo,
						media: response.json_metadata.media[0],
						plagiarism_author: plagiarism.plagiarism_username,
						plagiarism_permlink: plagiarism.plagiarism_permlink,
						operation: operation,
						prepareData: response,
						beneficiaries: beneficiaries
					};
					let error = new Error();
					error.data = data;
					return Promise.reject(error);
				}
				return this.afterCheckingPlagiarism(operation, response, beneficiaries);
			})
	}

	afterCheckingPlagiarism(operation, prepareData, beneficiaries) {
		return _sendToBlockChain(operation, prepareData, beneficiaries)
			.then(response => {
				const data = JSON.stringify({
					username: AuthService.getUsername(),
					error: ''
				});
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
				const data = JSON.stringify({
					username: AuthService.getUsername(),
					error: ''
				});
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

function _preparePost(media, description, tags, permlink, username) {
	const options = {
		"username": AuthService.getUsername(),
		"media": [media],
		"description": description,
		"post_permlink": `@${username}/${permlink}`,
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

function _createJsonMetadata(tags) {
	if (tags.length === 0) tags.push('steepshot');
	return {
		tags: tags,
		app: 'steepshot/0.0.6'
	}
}

export default new Steem();
