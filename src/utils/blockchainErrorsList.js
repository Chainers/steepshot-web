import Constants from '../common/constants';
import {serverErrorsList} from './serverErrorsList';

export function blockchainErrorsList(error) {
  let format = '';
  if (!error.data && typeof error === 'string') {
    return error;
  }
  if (!error.data && error.actual && error.expected) {
    if (error.actual === 128) {
      return 'Invalid posting key.';
    }
  }
  if (!error.data && error.status && error.statusText) {
    return serverErrorsList(error.status);
  }
  if (error.data) {
    if (error.data.stack && error.data.stack[0].format) {
      format = ': ' + error.data.stack[0].format;
    }
    let newError = `${error.data.code} ${error.data.name}: ${error.data.message}${format}`;
    let errorsList = [
      {error: '4100000 plugin_exception: plugin exception: Account: ${account} bandwidth limit exeeded. Please wait to ' + // eslint-disable-line
      'transact or power up steem.', notificationText: 'Your transaction cannot be completed. Steem Power of your ' +
      'account is too low. For more information click <a href="https://steepshot.io/faq#not-able-to-post" target="_blank">here</a>.'},
      {error: '4100000 plugin_exception: plugin exception: Account: ${account} bandwidth limit exceeded. Please wait to ' + // eslint-disable-line
      'transact or power up steem.', notificationText: 'Your transaction cannot be completed. Steem Power of your ' +
      'account is too low. For more information click <a href="https://steepshot.io/faq#not-able-to-post" target="_blank">here</a>.'},
      {error: '10 assert_exception: Assert Exception: ( now - auth.last_root_post ) > STEEM_MIN_ROOT_COMMENT_INTERVAL: ' +
      'You may only post once every 5 minutes.', notificationText: 'You can only create posts 5 minutes after the previous one.'},
      {error: '10 assert_exception: Assert Exception: elapsed_seconds >= STEEM_MIN_VOTE_INTERVAL_SEC: Can only vote ' +
      'once every 3 seconds.', notificationText: 'Can only vote once every 3 seconds.'},
      {error: '10 assert_exception: Assert Exception: itr->num_changes < STEEM_MAX_VOTE_CHANGES: Voter has used the ' +
      'maximum number of vote changes on this comment.', notificationText: 'Sorry, you had used the maximum number of vote changes.'},
      {error: '10 assert_exception: Assert Exception: abs_rshares > STEEM_VOTE_DUST_THRESHOLD || o.weight == 0: Voting ' +
      'weight is too small, please accumulate more voting power or steem power.', notificationText: 'You can vote this ' +
      'way because you haven’t got enough Steem Power. For more information click <a href="https://steepshot.io/faq#not-able-to-post" target="_blank">here</a>.'},
      {error: '10 assert_exception: Assert Exception: itr->vote_percent != o.weight: You have already voted in a similar' +
      ' way.', notificationText: 'You\'ve already voted in a similar way.'},
      {error: '10 assert_exception: Assert Exception: equal(com.parent_permlink, o.parent_permlink): The permlink of a ' +
      'comment cannot change.', notificationText: 'The permlink of comment can\'t change.'}
    ];
    for (let i = 0; i < errorsList.length; i++) {
      if (errorsList[i].error === newError) {
        return errorsList[i].notificationText;
      }
    }
  }
  return Constants.OOOPS_SOMETHING_WRONG;
}