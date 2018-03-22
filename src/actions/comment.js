import constants from '../common/constants';
import {getStore} from '../store/configureStore';
import {setPostModalOptions} from './postModal';
import Steem from '../libs/steem';
import jqApp from "../libs/app.min";

export function sendComment(postIndex, comment) {
  let state = getStore().getState();
  let post = state.posts[postIndex];
  return (dispatch) => {
    dispatch(setPostModalOptions({needsCommentFormLoader: true}));
    const urlObject = post.url.split('/');
    const callback = (err, success) => {
      dispatch(setPostModalOptions({needsCommentFormLoader: false}));
      if (err) {
        let error = err.data.message;
        error = error[0].toUpperCase() + error.substring(1) + ' error';
        jqApp.pushMessage.open(error);
      } else if (success) {
        dispatch(setPostModalOptions({
          newComment: {
            net_votes: 0,
            vote: false,
            avatar: state.auth.avatar,
            author: state.auth.name,
            total_payout_value: 0,
            body: comment,
            created: Date.now(),
          },
        }));
        jqApp.pushMessage.open(constants.COMMENT_SUCCESS_MESSAGE);
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
