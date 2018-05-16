import RequestService from "./requestService";

class PostService {

	static getPostsList(url, offset, show_nsfw, show_low_rated, limit) {
		const options = {
			offset,
			show_nsfw,
			show_low_rated,
			limit
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
}

export default PostService;