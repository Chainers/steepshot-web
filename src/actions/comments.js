import {getComments} from "../services/posts";
import {getStore} from "../store/configureStore";
import Constants from "../common/constants";
import jqApp from "../libs/app.min";
import Steem from "../libs/steem";
import {clearTextInputState} from "./textInput";

export function getPostComments(point) {
	const post = getStore().getState().posts[point];
	if (!post) {
		jqApp.pushMessage.open(Constants.OOOPS_SOMETHING_WRONG);
		return {
			type: "Can't find post.",
			point
		}
	}
	return (dispatch) => {
		dispatch({
			type: 'INIT_POST_COMMENTS',
			options: {
				point,
				loading: true,
				comments: [],
				sendingNewComment: false,
				scrollToLastComment: 0
			}
		});
		const options = {
			point: `post/${post.author}/${post.url}/comments`,
			params: {}
		};
		getComments(options, true).then((response) => {
			dispatch({
				type: 'GET_POST_COMMENTS_SUCCESS',
				point,
				comments: response.results
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

function scrollToLastComment(point) {
	return {
		type: 'SCROLL_TO_LAST_COMMENT',
		point
	}
}

function addedNewComment(point, comment) {
	return {
		type: 'ADDED_NEW_COMMENT',
		point,
		comment
	}
}

export function sendComment(postIndex, point) {
	let state = getStore().getState();
	let post = state.posts[postIndex];
	let comment = state.textInput[point].text;
	return (dispatch) => {
		dispatch(sendingNewComment(postIndex, true));
		const urlObject = post.url.split('/');
		const callback = (err, success) => {
			dispatch(sendingNewComment(postIndex, false));
			if (err) {
				jqApp.pushMessage.open(err);
			} else if (success) {
				const newComment = {
					net_votes: 0,
					vote: false,
					avatar: state.auth.avatar,
					author: state.auth.name,
					total_payout_value: 0,
					body: comment,
					created: Date.now(),
				};
				dispatch(addedNewComment(postIndex, newComment));
				dispatch(clearTextInputState(point));
				dispatch(scrollToLastComment(postIndex));
				jqApp.pushMessage.open(Constants.COMMENT_SUCCESS_MESSAGE);
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
