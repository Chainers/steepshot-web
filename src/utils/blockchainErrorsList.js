import constants from '../common/constants';

export function blockchainErrorsList(error) {
  let format = '';
  if (!error.data && typeof error === 'string') {
    return error;
  }
  if (error.data.stack && error.data.stack[0].format) {
    format = ': ' + error.data.stack[0].format;
  }
  let newError = `${error.data.code} ${error.data.name}: ${error.data.message}${format}`;
  let errorsList = [
    {error: '4100000 plugin_exception: plugin exception: Account: ${account} bandwidth limit exeeded. Please wait to ' +
    'transact or power up STEEM.', notificationText: 'Bandwidth limit exceeded. Please wait to transact or power up STEEM.'},
    {error: '4100000 plugin_exception: plugin exception: Account: ${account} bandwidth limit exceeded. Please wait to ' +
    'transact or power up STEEM.', notificationText: 'Bandwidth limit exceeded. Please wait to transact or power up STEEM.'},
    {error: '10 assert_exception: Assert Exception: ( now - auth.last_root_post ) > STEEMIT_MIN_ROOT_COMMENT_INTERVAL: ' +
    'You may only post once every 5 minutes.', notificationText: 'You can only create posts 5 minutes after the previous one.'},
    {error: '10 assert_exception: Assert Exception: elapsed_seconds >= STEEM_MIN_VOTE_INTERVAL_SEC: Can only vote ' +
    'once every 3 seconds.', notificationText: 'Can only vote once every 3 seconds.'},
    {error: '10 assert_exception: Assert Exception: itr->num_changes < STEEM_MAX_VOTE_CHANGES: Voter has used the ' +
    'maximum number of vote changes on this comment.', notificationText: 'Sorry, you had used the maximum number of vote changes.'}
  ];
  for (let i = 0; i < errorsList.length; i++) {
    if (errorsList[i].error === newError) {
      return errorsList[i].notificationText;
    }
  }
  console.error(error);
  return constants.OOOPS_SOMETHING_WRONG;
}