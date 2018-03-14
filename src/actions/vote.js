import Steem from '../libs/steem';
import {getStore} from '../store/configureStore';
import Constants from '../common/constants';
import {debounce} from 'lodash';
import {updatePost} from './post';
import {getUserProfile} from './profile';
import {updateVotingPower} from './auth';

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
  return function(dispatch) {
    let state = getStore().getState();
    let username = state.auth.user;
    let postingKey = state.auth.postingKey;
    let post = state.posts[postIndex];
    const newVoteState = !post.vote;

    if (!username && !postingKey) {
      debounce(jqApp.pushMessage.open(Constants.VOTE_ACTION_WHEN_NOT_AUTH),
        Constants.VOTE_ACTION_WHEN_NOT_AUTH_DEBOUNCE);
      return;
    }

    let queue = sessionStorage.getItem('voteQueue');
    if (queue == 'true') {
      return;
    }

    sessionStorage.setItem('voteQueue', 'true');
    dispatch(toggleVoteRequest(postIndex));

    const callback = (err, success) => {
      sessionStorage.setItem('voteQueue', 'false');
      if (err) {
        dispatch(toggleVoteFailure(postIndex));
        let text = 'Something went wrong when you voted, please, try again later';
        if (err.data.code == 10) {
          text = `Sorry, you had used the maximum number of vote changes on this post`;
        }
        jqApp.pushMessage.open(text);
      } else if (success) {
        dispatch(toggleVoteSuccess(postIndex));
        dispatch(updatePost(postIndex));
        dispatch(updateVotingPower(username));
        let text = `The post has been successfully liked. If you don't see your like, please give it a few minutes to sync from the blockchain`;
        if (!newVoteState) text = `The post has been successfully disliked. If you don't see your dislike, please give it a few minutes to sync from the blockchain`;
        jqApp.pushMessage.open(text);
      }
    };

    let urlObject = post.url.split('/');
    Steem.vote(postingKey,
      username,
      post.author,
      urlObject[urlObject.length - 1],
      newVoteState,
      callback,
    );
  };
}
