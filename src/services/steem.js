import steem from 'steem';
import Promise from 'bluebird';
import {getStore} from '../store/configureStore';
import {logComment, logDeletedPost, logFlag, logFollow, logPost, logVote} from '../actions/logging';
import _ from 'underscore';
import FormData from 'form-data';
import {blockchainErrorsList} from "../utils/blockchainErrorsList";
import Constants from "../common/constants";

const _getUserName = () => {
	return getStore().getState().auth.user
};

const _getUserPostingKey = () => {
	return getStore().getState().auth.postingKey
};

const _getBaseUrl = () => {
	return Constants.URLS.baseUrl_v1_1;
};

class Steem {
	constructor() {
		steem.api.setOptions({url: 'https://api.steemit.com'});
	}

	comment(wif, parentAuthor, parentPermlink, author, body, tags, callback) {
		const permlink = _getPermLink(`${author} comment`);
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
				logComment(parentAuthor, parentPermlink, data);
			} else if (success) {
				const data = JSON.stringify({
					username: author,
					error: ''
				});
				logComment(parentAuthor, parentPermlink, data);
				callback(null, success);
			}
		};
		this.handleBroadcastMessagesComment(commentOperation, wif, callbackBc);
	}

	handleBroadcastMessagesComment(message, postingKey, callback) {
		let beneficiaries = this._getCommentBenificiaries(message[1].permlink);
		const operations = [message, beneficiaries];
		steem.broadcast.sendAsync(
			{operations, extensions: []},
			{posting: postingKey}, callback
		);
	}


	_getCommentBenificiaries(permlink) {
		let beneficiariesObject = _.extend({}, {
			author: _getUserName(),
			permlink: permlink,
			max_accepted_payout: Constants.STEEM_PATLOAD.MAX_ACCEPTED_PAYOUT,
			percent_steem_dollars: Constants.STEEM_PATLOAD.PERCENT_STEMM_DOLLARS,
			allow_votes: true,
			allow_curation_rewards: true,
			extensions: [
				[0, {
					beneficiaries: [
						{
							account: 'steepshot',
							weight: 1000
						}
					]
				}]
			]
		});


		return [Constants.OPERATIONS.COMMENT_OPTIONS, beneficiariesObject];
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
				logVote(voteStatus, author, url, data);
			} else if (success) {
				const data = JSON.stringify({
					username: username,
					error: ''
				});
				logVote(voteStatus, author, url, data);
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
				logVote(flagStatus, author, url, data);
			} else if (success) {
				const data = JSON.stringify({
					username: username
				});
				logFlag(author, url, data);
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
				logFollow(status, following, data);

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

	/** Broadcast a post */

	deletePost(wif, author, permlink, callback) {
		const callbackBc = (err, success) => {
			if (err) {
				const data = JSON.stringify({
					username: author,
					error: err.message
				});
				logDeletedPost(author, permlink, data);
				let checkedError = blockchainErrorsList(err);
				callback(checkedError, null);
			} else if (success) {
				const data = JSON.stringify({
					username: author
				});
				logDeletedPost(author, permlink, data);
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
			author: _getUserName(),
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
					username: _getUserName(),
					error: ''
				});
				logPost(data);
				return response;
			})
	}

	createPost(tags, title, description, file) {
		tags = _getValidTags(tags);
		const category = tags[0];
		const permlink = _getPermLink(title);
		const operation = [Constants.OPERATIONS.COMMENT, {
			parent_author: '',
			parent_permlink: category,
			author: _getUserName(),
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
				return _preparePost(response, description, tags, permlink, _getUserName());
			})
			.then(response => {
				let beneficiaries = _getBeneficiaries(operation[1].permlink, response.beneficiaries);
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
					username: _getUserName(),
					error: ''
				});
				logPost(data);
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
			author: _getUserName(),
			permlink,
			title,
			description,
			body: '*deleted*',
			json_metadata: JSON.stringify(json_metadata)
		}];
		return _sendToBlockChain(operation, false, false)
			.then(response => {
				const data = JSON.stringify({
					username: _getUserName(),
					error: ''
				});
				logDeletedPost(_getUserName(), permlink, data);
				return response;
			})
	}
}

export function getValidTransaction() {
	const operation = [Constants.OPERATIONS.COMMENT, {
		parent_author: '',
		parent_permlink: '',
		author: _getUserName(),
		permlink:  _getPermLink('steepshot'),
		title: 'steepshot',
		description: '',
		body: 'steepshot',
		json_metadata: {
			tags: ['steepshot'],
			app: 'steepshot'
		}
	}];
	return steem.broadcast._prepareTransaction({
		extensions: [],
		operations: [operation],
	}).then(transaction => {
		return steem.auth.signTransaction(transaction, [_getUserPostingKey()])
	}).catch(error => {
		let checkedError = blockchainErrorsList(error);
		return Promise.reject(checkedError);
	});
}

function _fileUpload(file) {
	return getValidTransaction()
		.then(transaction => {
			let form = new FormData();
			form.append('file', file);
			form.append('trx', JSON.stringify(transaction));
			return fetch(`${_getBaseUrl()}/media/upload`, {
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
			{posting: _getUserPostingKey()}, callback
		);
	})
}

function _preparePost(media, description, tags, permlink, username) {
	const options = {
		"username": _getUserName(),
		"media": [media],
		"description": description,
		"post_permlink": `@${username}/${permlink}`,
		"tags": tags,
		"show_footer": true,
		device: 'web'
	};
	return fetch(`${_getBaseUrl()}/post/prepare`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			...options
		})
	}).then(response => response.json());
}

function _getPermLink(permlinkHead) {
	let today = new Date();
	let permlinkHeadLimit = 30;
	permlinkHead = permlinkHead.toLowerCase();
	if (permlinkHead.length > permlinkHeadLimit) {
		permlinkHead = permlinkHead.slice(0, permlinkHeadLimit + 1);
	}
	return permlinkHead.replace(/\W/g, '-') + '-' + today.getFullYear() + '-' + today.getMonth() + '-' + today.getDay()
		+ '-' + today.getHours() + '-' + today.getMinutes() + '-' + today.getSeconds();
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

function _getBeneficiaries(permlink, beneficiaries) {
	let beneficiariesObject = _.extend({}, {
		author: _getUserName(),
		permlink: permlink,
		max_accepted_payout: Constants.STEEM_PATLOAD.MAX_ACCEPTED_PAYOUT,
		percent_steem_dollars: Constants.STEEM_PATLOAD.PERCENT_STEMM_DOLLARS,
		allow_votes: true,
		allow_curation_rewards: true,
		extensions: [[0, {beneficiaries: beneficiaries}]]
	});

	return [Constants.OPERATIONS.COMMENT_OPTIONS, beneficiariesObject];
}

export default new Steem();
