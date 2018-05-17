import RequestService from "./requestService";
import {blockchainErrorsList} from "../utils/blockchainErrorsList";
import LoggingService from "./loggingService";
import SteemService from "./steemService";
import Constants from "../common/constants";
import AuthService from "./authService";

class PostService {

	static getPostsList(url, offset, show_nsfw, show_low_rated, limit, currentOptions) {
		const options = {
			offset,
			show_nsfw,
			show_low_rated,
			limit,
			...currentOptions
		};
		return RequestService.get(url, options);
	}

	static getPost(postUrl) {
		const url = `post/${PostService.getUsernameFromUrl(postUrl)}/${PostService.getPermlinkFromUrl(postUrl)}/info`;
		const options = {
			show_nsfw: true,
			show_low_rated: true
		};

		return RequestService.get(url, options);
	}

	static createPostPermlink(permlinkHead) {
		const today = new Date();
		const permlinkHeadLimit = 30;
		permlinkHead = permlinkHead.toLowerCase();
		if (permlinkHead.length > permlinkHeadLimit) {
			permlinkHead = permlinkHead.slice(0, permlinkHeadLimit + 1);
		}
		return permlinkHead.replace(/\W/g, '-') + '-' + today.getFullYear() + '-' + today.getMonth() + '-' + today.getDay()
			+ '-' + today.getHours() + '-' + today.getMinutes() + '-' + today.getSeconds();
	}

	static getPermlinkFromUrl(url) {
		const elements = url.split('/');
		return elements[elements.length - 1];
	}

	static getUsernameFromUrl(url) {
		const elements = url.split('/');
		return elements[elements.length - 2];
	}

	static changeVote(postAuthor, permlink, voteStatus, power) {
		SteemService.changeVoteInBlockchain(postAuthor, permlink, voteStatus ? power : 0)
			.then(response => {
				LoggingService.logVote(voteStatus, permlink);
				return Promise.resolve(response);
			})
			.catch(error => {
				let checkedError = blockchainErrorsList(error);
				LoggingService.logVote(voteStatus, permlink, checkedError);
				return Promise.reject(checkedError);
			})
	}

	static changeFlag(postAuthor, permlink, isFlag, power = -10000) {
		SteemService.changeVoteInBlockchain(postAuthor, permlink, isFlag ? power : 0)
			.then(response => {
				LoggingService.logFlag(isFlag, permlink, postAuthor);
				return Promise.resolve(response);
			})
			.catch(error => {
				let checkedError = blockchainErrorsList(error);
				LoggingService.logFlag(isFlag, permlink, postAuthor, checkedError);
				return Promise.reject(checkedError);
			})
	}

	static editPost(title, tags, description, permlink, media) {
		tags = getValidTags(tags);
		const category = tags[0];
		const operation = [Constants.OPERATIONS.COMMENT, {
			parent_author: '',
			parent_permlink: category,
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
		return preparePost(tags, description, permlink, media)
			.then(response => {
				operation.body = response.body;
				operation.json_metadata = response.json_metadata;
				return SteemService.addPostDataToBlockchain([operation])
			})
			.then(response => {
				LoggingService.logEditPost(permlink);
				return Promise.resolve(response);
			})
			.catch(error => {
				let checkedError = blockchainErrorsList(error);
				LoggingService.logEditPost(permlink, checkedError);
				return Promise.reject(checkedError);
			})
	}

}

export default PostService;

function preparePost(tags, description, permlink, media) {
	const url = `${Constants.URLS.baseUrl_v1_1}/post/prepare`;
	const data = {
		username: AuthService.getUsername(),
		tags: tags,
		description: description,
		post_permlink: `@${AuthService.getUsername()}/${permlink}`,
		media: [media],
		show_footer: true,
		device: 'web'
	};
	return RequestService.post(url, data);
}


function getValidTags(tags) {
	if (!tags) {
		tags = 'steepshot';
	}
	tags = tags.split(' ');
	tags = removeEmptyTags(tags);
	return tags;
}

function removeEmptyTags(tags) {
	let empty = tags.indexOf('');
	while (empty !== -1) {
		tags.splice(empty, 1);
		empty = tags.indexOf('');
	}
	return tags;
}