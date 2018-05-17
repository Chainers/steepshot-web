import constants from '../common/constants';
import AuthService from "./authService";

const baseUrl = constants.URLS.baseUrl_v1;
class LoggingService {

	static logLogin(data) {
		const url = `${baseUrl}/log/login-with-posting`;
		logCORS(url, data, 'login');
	}

	static logComment(postAuthor, permlink, error = '') {
		const data = {
			username: AuthService.getUsername(),
			error
		};
		const url = `${baseUrl}/log/post/${makePostId(postAuthor, permlink)}/comment`;
		logCORS(url, data, 'comment');
	}

	static logFlag(isFlag, permlink, error = '') {
		logChangVote(isFlag, permlink, error, 'flag');
	}

	static logVote(isVoteUp, permlink, error = '') {
		logChangVote(isVoteUp, permlink, error, 'upvote');
	}

	static logPost(data) {
		const url = `${baseUrl}/log/post`;
		logCORS(url, data, 'post');
	}

	static logFollow(isFollowed, user, data) {
		let fType = (isFollowed) ? 'unfollow' : 'follow';
		const url = `${baseUrl}/log/user/${user}/${fType}`;
		logCORS(url, data, fType);
	}

	static logDeletedPost(author, permlink, data) {
		const url = `${baseUrl}/log/post/${makePostId(author, permlink)}/delete`;
		logCORS(url, data, 'delete');
	}

	static logSharePost(author, permlink, data) {
		const url = `${baseUrl}/log/post/${makePostId(author, permlink)}/info`;
		logCORS(url, data, 'share_post');
	}
}

export default LoggingService;

function logChangVote(isFlag, permlink, error = '', event) {
	const author = AuthService.getUsername();
	const data = {
		username: author,
		error
	};
	let vType = isFlag ? event : 'downvote';
	const url = `${baseUrl}/log/post/${makePostId(author, permlink)}/${vType}`;
	logCORS(url, data, vType);
}

function logCORS(url, body, operation) {
	const options = {
		method: 'POST',
		mode: 'cors',
		credentials: 'include',
		headers: {
			'cache-control': 'no-cache',
			'content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	};

	try {
		fetch(url, options)
			.then((response) => {
				if (response.ok && response.status !== 200) {
					notify(`logCORS, ${operation}. Response is OK but something went wrong`, response, true);
				}
			})
			.catch((error) => {
				notify(`logCORS, ${operation}. Error`, error, true);
			});
	}
	catch (error) {
		notify(`logCORS, ${operation}. Catch block`, error, true);
	}
}

function notify(message, response, warn) {
	warn ? console.warn(message) : console.log(message);
}

function makePostId(author, permlink) {
	return `@${author}/${permlink}`;
}