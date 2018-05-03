import {getComments} from "../services/posts";
import {getStore} from "../store/configureStore";
import Constants from "../common/constants";
import Steem from "../libs/steem";
import {clearTextInputState} from "./textInput";
import {pushMessage} from "./pushMessage";
import {actionLock, actionUnlock} from "./sessionActions";

export function initPostComment(point) {
	return {
		type: 'INIT_POST_COMMENTS',
		options: {
			point,
			loading: true,
			comments: [],
			sendingNewComment: false,
			scrollToLastComment: 0
		}
	}
}

export function getPostComments(point) {
	const post = getStore().getState().posts[point];
	if (!post) {
		return dispatch => {
			dispatch(pushMessage(Constants.OOOPS_SOMETHING_WRONG));
			dispatch({
				type: 'Can\'t find post.',
				point
			})
		}
	}

	return (dispatch) => {
		dispatch({
			type: 'GET_POST_COMMENT_REQUEST',
			point
		});
		const options = {
			point: `post/${post.author}${post.url}/comments`,
			params: {}
		};
		getComments(options, true).then((response) => {
			const comments = response.results.reverse();
			if (!comments) {
				dispatch({
					type: 'GET_COMMENT_ERROR',
					response
				});
				return;
			}
			let commentsUrls = comments.map((comment) => {
				return comment.url
			});

			let commentsObjects = {};
			for (let i = 0; i < comments.length; i++) {
				let comment = {
					...comments[i],
					flagLoading: false,
					voteLoading: false
				};
				commentsObjects[comments[i].url] = comment;
			}
			dispatch({
				type: 'GET_POST_COMMENTS_SUCCESS',
				point,
        commentsUrls,
				posts: commentsObjects,
			});
		});
	}
}

function sendingNewComment(point, flag) {
	return {
		type: 'SENDING_NEW_COMMENT',
		point,
		flag
	}
}

function scrollToLastComment(postIndex) {
	return {
		type: 'SCROLL_TO_LAST_COMMENT',
		postIndex
	}
}

function addedNewComment(point, posts, url) {
	return dispatch => {
		dispatch({
			type: 'ADDED_NEW_COMMENT',
			point,
			posts,
			url
		})
	}
}

export function sendComment(postIndex, point) {
	let state = getStore().getState();
	let post = state.posts[postIndex];
	let comment = state.textInput[point].text;
	return (dispatch) => {
    if (state.session.actionLocked) {
      return;
    }
    dispatch(actionLock());
		dispatch(sendingNewComment(postIndex, true));
		const urlObject = post.url.split('/');
		const callback = (err, success) => {
      dispatch(actionUnlock());
			dispatch(sendingNewComment(postIndex, false));
			if (err) {
				dispatch(pushMessage(err));
			} else if (success) {
				const url = postIndex + '#@' + state.auth.user + '/' + success.operations[0][1].permlink;
				const newComment = {
					net_votes: 0,
					net_likes: 0,
					vote: false,
					avatar: state.auth.avatar,
					author: state.auth.user,
					total_payout_value: 0,
					body: comment,
					created: Date.now(),
					flagLoading: false,
					voteLoading: false,
					url
				};
				dispatch(addedNewComment(postIndex, { [url]: newComment}, url));
				dispatch(clearTextInputState(point));
				dispatch(scrollToLastComment(postIndex));
				dispatch(pushMessage(Constants.COMMENT_SUCCESS_MESSAGE));
			}
		};
		Steem.comment(
			state.auth.postingKey,
			post.author,
			urlObject[urlObject.length - 1],
			state.auth.user,
			comment,
			post.tags,
			callback,
		);
	};
}

export function replyAuthor(name) {
	let text = getStore().getState().textInput[Constants.TEXT_INPUT_POINT.COMMENT].text || '';
	text = text.replace(/^@[^,]+, ?/g, '');
	return dispatch => {
		dispatch({
			type: 'TEXT_INPUT_SET_STATE',
			point: Constants.TEXT_INPUT_POINT.COMMENT,
			state: {
				focusedStyle: 'focused_tex-inp',
				text: `@${name}, ${text}`,
				error: ''
			}
		});
		dispatch({
			type: 'SET_FOCUS_TEXT_INPUT',
			point: Constants.TEXT_INPUT_POINT.COMMENT
		})
	}
}