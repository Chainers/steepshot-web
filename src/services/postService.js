import RequestService from "./requestService";

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

	static getComments(postAuthor, postUrl) {
		const url = `post/${postAuthor}${postUrl}/comments`;
		return RequestService.get(url);
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
}

export default PostService;