import steem from 'steem';
import constants from '../common/constants';
import Promise from 'bluebird';
import {getStore} from '../store/configureStore';
import {prepareComment} from '../actions/steemPayout';
import {logComment, logDeletedPost, logFlag, logFollow, logPost, logVoute} from '../actions/logging';

import _ from 'underscore';
import FormData from "form-data";

const _getUserName = () => {
  return getStore().getState().auth.user
};

const _getUserPostingKey = () => {
  return getStore().getState().auth.postingKey
};

const _getBaseUrl = () => {
  return constants.URLS.baseUrl_v1_1;
};

class Steem {

  constructor() {
    steem.api.setOptions({url: 'https://api.steemit.com'});
  }

  comment(wif, parentAuthor, parentPermlink, author, body, tags, callback) {
    const permlink = _getPermLink();
    const commentObject = {
      parent_author: parentAuthor,
      parent_permlink: parentPermlink,
      author: author,
      permlink: permlink + '-post',
      title: "",
      body: body,
      json_metadata: JSON.stringify(_createJsonMetadata(tags))
    };
    const commentOperation = [constants.OPERATIONS.COMMENT, commentObject];

    const callbackBc = (err, success) => {
      if (err) {
        callback(err, null);
        console.log(err);
      } else if (success) {
        const data = JSON.stringify({
          username: author
        });
        logComment(parentAuthor, parentPermlink, data);
        callback(null, success);
      }
    };
    this.handleBroadcastMessagesComment(commentOperation, [], wif, callbackBc);
  }

  handleBroadcastMessagesComment(message, extetion, postingKey, callback) {
    let self = this;
    this._preCompileTransactionComment(message, postingKey)
      .then((response) => {
        if (response.ok) {
          let beneficiaries = self._getCommentBenificiaries(message[1].permlink);

          const operations = [message, beneficiaries];

          steem.broadcast.sendAsync(
            {operations, extensions: []},
            {posting: postingKey}, callback
          );
        } else {
          response.json().then((result) => {
            callback(result.username[0]);
          });
        }
        ;
      });
  }

  _preCompileTransactionComment(message, postingKey) {
    return steem.broadcast._prepareTransaction({
      extensions: [],
      operations: [message],
    })
      .then((transaction) => {
        return Promise.join(
          transaction,
          steem.auth.signTransaction(transaction, [postingKey])
        )
      })
      .spread((transaction, signedTransaction) => {
        return prepareComment(message, signedTransaction);
      });
  }

  _getCommentBenificiaries(permlink) {
    let beneficiariesObject = _.extend({}, {
      author: _getUserName(),
      permlink: permlink,
      max_accepted_payout: constants.STEEM_PATLOAD.MAX_ACCEPTED_PAYOUT,
      percent_steem_dollars: constants.STEEM_PATLOAD.PERCENT_STEMM_DOLLARS,
      allow_votes: true,
      allow_curation_rewards: true,
      extensions: [
        [0, {
          beneficiaries: [
            {
              account: 'steepshot',
              weight: 1000
            }
          ]
        }]
      ]
    });


    return [constants.OPERATIONS.COMMENT_OPTIONS, beneficiariesObject];
  }

  vote(wif, username, author, url, voteStatus, callback) {
    const data = JSON.stringify({
      username: username
    });

    const callbackBc = (err, success) => {
      if (err) {
        callback(err, null);
        console.log(err);
      } else if (success) {
        logVoute(voteStatus, author, url, data);
        callback(null, success);
      }
    };

    steem.api.getContentAsync(author, url).then((response) => {
      steem.broadcast.vote(wif, username, response.author, response.permlink, voteStatus ? 10000 : 0, callbackBc);
    });
  }

  flag(wif, username, author, url, flagStatus, callback) {

    const callbackBc = (err, success) => {
      if (err) {
        callback(err, null);
        console.log(err);
      } else if (success) {
        const data = JSON.stringify({
          username: username
        });
        logFlag(author, url, data);
        callback(null, success);
      }
    };

    steem.api.getContentAsync(author, url).then((response) => {
      steem.broadcast.vote(wif, username, response.author, response.permlink, flagStatus ? -10000 : 0, callbackBc);
    });
  }


  _sendBroadCasts(operations, postingWif) {
    steem.broadcast.sendAsync({operations, extensions: []}, {posting: postingWif});
  }

  /** Follow an user */
  followUnfollowUser(wif, follower, following, status, callback) {

    let blog = ['blog'];
    if (status) blog = [];

    const json = JSON.stringify(
      [constants.OPERATIONS.FOLLOW, {
        follower: follower,
        following: following,
        what: blog
      }]
    );

    const callbackBc = (err, result) => {
      if (err) {
        callback(err);
        console.log(err);
      } else if (result) {
        const data = JSON.stringify({
          username: follower
        });
        logFollow(status, following, data);
        callback(null, result);
      }
    };

    steem.broadcast.customJson(
      wif,
      [], // Required_auths
      [follower], // Required Posting Auths
      'follow', // Id
      json,
      callbackBc
    );
  }

  /** Broadcast a post */

  deletePost(wif, author, permlink, callback) {
    const callbackBc = (err, success) => {
      if (err) {
        // const data = JSON.stringify({
        //   error: err.cause.name
        // });
        // logDeletedPost(author, permlink, data);
        callback(err, null);
      } else if (success) {
        const data = JSON.stringify({
          username: author
        });
        logDeletedPost(author, permlink, data);
        callback(null, success);
      }
    };
    steem.broadcast.deleteComment(wif, author, permlink, callbackBc);
  }

  createPost(tags, title, description, file) {
    const permlink = _getPermLink();
    tags = _getValidTags(tags);

    const operation = [constants.OPERATIONS.COMMENT, {
      parent_author: '',
      parent_permlink: tags[0],
      author: _getUserName(),
      permlink: permlink + '-post',
      title: title,
      description: description,
      body: 'empty',
      json_metadata: {
        tags: tags,
        app: 'steepshot'
      }
    }];

    return _preCompileTransaction(operation)
      .then(transaction => {
        return _fileUpload(transaction, file);
      })
      .then(response => {
        const postOptions = {
          "username": _getUserName(),
          "media": [{...response}],
          "description": description,
          "post_permlink": '@' + _getUserName() + '/' + permlink + '-post',
          "tags": tags,
          "show_footer": true
        };
        return _preparePost(postOptions);
      })
      .then(response => {
        return _sendToBlockChain(operation, response)
      })
      .then(response => {
        const data = JSON.stringify({
          username: _getUserName()
        });
        logPost(data);
        return response;
      })
  }
}


function _preCompileTransaction(operation) {
  return steem.broadcast._prepareTransaction({
    extensions: [],
    operations: [operation],
  }).then((transaction) => {
    return new Promise((resolve, reject) => {
      try {
        resolve(steem.auth.signTransaction(transaction, [_getUserPostingKey()]));
      } catch (error) {
        reject(new Error("Invalidate posting key."));
      }
    })
  });
}

function _fileUpload(trx, file) {
  let form = new FormData();
  form.append('file', file);
  form.append('trx', JSON.stringify(trx));
  return fetch(`${_getBaseUrl()}/media/upload`, {
    method: 'POST',
    body: form
  }).then(response => response.json())
}

function _sendToBlockChain(operation, prepareData) {
  return new Promise((resolve, reject) => {
    const beneficiaries = _getBeneficiaries(operation[1].permlink, prepareData.beneficiaries);
    operation[1].body = prepareData.body;
    operation[1].json_metadata = JSON.stringify(prepareData.json_metadata);
    const operations = [operation, beneficiaries];
    const callback = (err, success) => {
      if (success) {
        resolve(success);
      }
      reject(new Error('Somethings went wrong.'));
    };

    steem.broadcast.sendAsync(
      {operations, extensions: []},
      {posting: _getUserPostingKey()}, callback
    );
  })
}

function _preparePost(options) {
  return fetch(`${_getBaseUrl()}/post/prepare`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      ...options
    })
  }).then(response => response.json());
}

function _getPermLink() {
  return new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
}

function _getValidTags(tags) {
  if (tags.indexOf('steepshot') === -1) {
    tags = ['steepshot', ...tags]
  }
  let empty = tags.indexOf('');
  while (empty !== -1) {
    tags.splice(empty, 1);
    empty = tags.indexOf('');
  }
  return tags;
}

function _createJsonMetadata(tags) {
  if (tags.length == 0) tags.push('steepshot');
  return {
    tags: tags,
    app: 'steepshot/0.0.6' //@TODO get metadata from Backend
  }
}

function _getBeneficiaries(permlink, beneficiaries) {
  let beneficiariesObject = _.extend({}, {
    author: _getUserName(),
    permlink: permlink,
    max_accepted_payout: constants.STEEM_PATLOAD.MAX_ACCEPTED_PAYOUT,
    percent_steem_dollars: constants.STEEM_PATLOAD.PERCENT_STEMM_DOLLARS,
    allow_votes: true,
    allow_curation_rewards: true,
    extensions: [[0, {beneficiaries: beneficiaries}]]
  });

  return [constants.OPERATIONS.COMMENT_OPTIONS, beneficiariesObject];
}

export default new Steem();
