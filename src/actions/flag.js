import Steem from '../services/steem';
import {getStore} from '../store/configureStore';
import Constants from '../common/constants';
import {debounce} from 'lodash';
import {updatePost} from './post';
import {updateVotingPower} from './auth';
import {pushMessage} from "./pushMessage";
import {actionLock, actionUnlock} from "./session";

function toggleFlagRequest(postIndex) {
	return {
		type: 'TOGGLE_FLAG_REQUEST',
		index: postIndex,
	};
}

function toggleFlagSuccess(postIndex) {
	return {
		type: 'TOGGLE_FLAG_SUCCESS',
		index: postIndex,
	};
}

function toggleFlagFailure(postIndex) {
	return {
		type: 'TOGGLE_FLAG_FAILURE',
		index: postIndex,
	};
}

export function toggleFlag(postIndex) {
	return function (dispatch) {
		let state = getStore().getState();
		let username = state.auth.user;
		let postingKey = state.auth.postingKey;
		let post = state.posts[postIndex];
		const newFlagState = !post.flag;
		if (!username && !postingKey) {
			debounce(dispatch(pushMessage(Constants.VOTE_ACTION_WHEN_NOT_AUTH), Constants.VOTE_ACTION_WHEN_NOT_AUTH_DEBOUNCE));
			return;
		}
		if (state.session.actionLocked) {
			return;
		}
		dispatch(actionLock());
		dispatch(toggleFlagRequest(postIndex));

		const callback = (err, success) => {
			dispatch(actionUnlock());
			if (err) {
				dispatch(toggleFlagFailure(postIndex));
				dispatch(pushMessage(err));
			} else if (success) {
				dispatch(toggleFlagSuccess(postIndex));
				dispatch(updatePost(postIndex, 0, newFlagState));
				dispatch(updateVotingPower(username));
				let text = `The post has been successfully flaged. If you don't see your flag, please give it a few minutes to sync from the blockchain`;
				if (!newFlagState) text = `The post has been successfully unflaged. If you don't see your flag, please give it a few minutes to sync from the blockchain`;
				dispatch(pushMessage(text));
			}
		};

		let urlObject = post.url.split('/');
		Steem.flag(postingKey,
			username,
			post.author,
			urlObject[urlObject.length - 1],
			newFlagState,
			callback,
		);
	};
}
