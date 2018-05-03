import Steem from '../libs/steem';
import {getStore} from '../store/configureStore';
import {updatePost} from './post';
import {updateVotingPower} from './auth';
import {pushMessage} from "./pushMessage";
import {actionLock, actionUnlock} from "./sessionActions";

function toggleVoteRequest(postIndex) {
	return {
		type: 'TOGGLE_VOTE_REQUEST',
		index: postIndex,
	};
}

function toggleVoteSuccess(postIndex) {
	return {
		type: 'TOGGLE_VOTE_SUCCESS',
		index: postIndex,
	};
}

function toggleVoteFailure(postIndex) {
	return {
		type: 'TOGGLE_VOTE_FAILURE',
		index: postIndex,
	};
}

export function toggleVote(postIndex) {
	return function (dispatch) {
		let state = getStore().getState();
		let username = state.auth.user;
		let postingKey = state.auth.postingKey;
		let post = state.posts[postIndex];
		const newVoteState = !post.vote;
		let power = state.auth.like_power * 100;
		if (!username && !postingKey) {
			return;
		}
		if (state.session.actionLocked) {
			return;
		}
		dispatch(actionLock());
		dispatch(toggleVoteRequest(postIndex));

		const callback = (err, success) => {
			dispatch(actionUnlock());
			if (err) {
				dispatch(toggleVoteFailure(postIndex));
				dispatch(pushMessage(err));
			} else if (success) {
				dispatch(toggleVoteSuccess(postIndex));
				dispatch(updatePost(postIndex, newVoteState, 0));
				dispatch(updateVotingPower(username));
				let text = `The post has been successfully liked. If you don't see your like, please give it a few minutes to sync from the blockchain`;
				if (!newVoteState) text = `The post has been successfully disliked. If you don't see your dislike, please give it a few minutes to sync from the blockchain`;
				dispatch(pushMessage(text));
			}
		};

		let urlObject = post.url.split('/');
		Steem.vote(postingKey,
			username,
			post.author,
			urlObject[urlObject.length - 1],
			newVoteState,
			power,
			callback,
		);
	};
}
