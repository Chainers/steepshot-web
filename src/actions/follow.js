import Steem from "../libs/steem";
import {debounce} from "lodash";
import {updateUser} from "./usersList";
import {getStore} from "../store/configureStore";
import Constants from '../common/constants';


function toggleFollowRequest(author) {
  return {
    type: 'TOGGLE_FOLLOW_REQUEST',
    author,
  };
}

function toggleFollowSuccess(author) {
  return {
    type: 'TOGGLE_FOLLOW_SUCCESS',
    author
  };
}

function toggleFollowFailure(author) {
  return {
    type: 'TOGGLE_FOLLOW_FAILURE',
    author
  };
}

export function toggleFollow(author) {
  return function(dispatch) {
    let state = getStore().getState();
    let username = state.auth.user;
    let postingKey = state.auth.postingKey;
    let user = state.users[author];
    const newFollowState = user.has_followed;

    if (!username && !postingKey) {
      debounce(jqApp.pushMessage.open(Constants.VOTE_ACTION_WHEN_NOT_AUTH), 1000);
      return;
    }

    dispatch(toggleFollowRequest(author));

    const callback = (err, success) => {
      if (err) {
        dispatch(toggleFollowFailure(author));
        debounce(jqApp.pushMessage.open(Constants.FOLLOW_REQUEST_ERROR), 1000);
      } else if (success) {
        dispatch(updateUser(author));
        let statusText = 'followed';
        if (newFollowState) statusText = 'unfollowed';
        dispatch(toggleFollowSuccess(author));
        setTimeout(() => {
          jqApp.pushMessage.open(`User has been successfully ${statusText}`);
        }, 500);
      }
    };
    Steem.followUnfollowUser(postingKey, username, author, newFollowState, callback);
  };
}
