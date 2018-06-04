import RequestService from "./requestService";
import LoggingService from "./loggingService";
import Constants from "../common/constants";
import AuthService from "./authService";
import PostService from "./postService";
import ChainService from "./chainService";

class CommentService {

	static getCommentsList(postAuthor, postUrl) {
		const url = `post/${postAuthor}${postUrl}/comments`;
		const options = {
			username: AuthService.getUsername(),
		};
		return RequestService.get(url, options);
	}

	static getComment(postUrl) {
		const url = `comment/${CommentService.getCommentPermlinkFromUrl(postUrl)}/info`;
		const options = {
			username: AuthService.getUsername(),
		};
		return RequestService.get(url, options);
	}

	static getCommentPermlinkFromUrl(postUrl) {
    return postUrl.replace(/.+#(.+)/g, '$1');
	}

	static getDefaultCommentOperation(postAuthor, postPermlink, author, permlink, body) {
		return [Constants.OPERATIONS.COMMENT, {
							parent_author: postAuthor,
							parent_permlink: postPermlink,
							author: author,
							permlink: permlink,
							title: '',
							body: body,
							json_metadata: '',
							device: 'web'
						}];
	}

	static addComment(postAuthor, postPermlink, body) {
		const author = AuthService.getUsername();
		const permlink = PostService.createPostPermlink(`${author} comment`);
		const commentOperation = CommentService.getDefaultCommentOperation(postAuthor, postPermlink, author, permlink, body);
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