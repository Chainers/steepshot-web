import RequestService from "./requestService";
import {blockchainErrorsList} from "../utils/blockchainErrorsList";
import LoggingService from "./loggingService";
import SteemService from "./steemService";

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

	static getPost(username, postId) {
		const url = `post/${username}/${postId}/info`;
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

}

export default PostService;