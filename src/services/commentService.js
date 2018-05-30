import RequestService from "./requestService";
import LoggingService from "./loggingService";
import Constants from "../common/constants";
import AuthService from "./authService";
import PostService from "./postService";
import ChainService from "./chainService";

class CommentService {

	static getCommentsList(postAuthor, postUrl) {
		const url = `post/${postAuthor}${postUrl}/comments`;
		return RequestService.get(url);
	}

	static getComment(postUrl) {
		const url = `comment/${CommentService.getCommentPermlinkFromUrl(postUrl)}/info`;

		return RequestService.get(url);
	}

	static getCommentPermlinkFromUrl(postUrl) {
    return postUrl.replace(/.+#(.+)/g, '$1');
	}

	static addComment(postAuthor, postPermlink, body) {
		const author = AuthService.getUsername();
		const permlink = PostService.createPostPermlink(`${author} comment`);
		const data = {
			parent_author: postAuthor,
			parent_permlink: postPermlink,
			author: author,
			permlink: permlink,
			title: '',
			body: body,
			json_metadata: '',
			device: 'web'
		};
		const commentOperation = [Constants.OPERATIONS.COMMENT, data];

		return ChainService.addCommentToBlockchain(commentOperation)
			.then( response => {
				LoggingService.logComment(postAuthor, postPermlink);
				return Promise.resolve(response);
			})
			.catch( error => {
				LoggingService.logComment(postAuthor, postPermlink, error);
				return Promise.reject(error);
			});
	}
}

export default CommentService;