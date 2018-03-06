import steem from 'steem';
import constants from '../common/constants';
import Promise from 'bluebird';
import {getStore} from '../store/configureStore';
import {prepareComment} from '../actions/steemPayout';
import {logComment, logDeletedPost, logFlag, logFollow, logPost, logVote} from '../actions/logging';

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
    const permlink = _getPermLink('comment');
    const commentObject = {
      parent_author: parentAuthor,
      parent_permlink: parentPermlink,
      author: author,
      permlink: permlink,
      title: "",
      body: body,
      json_metadata: JSON.stringify(_createJsonMetadata(tags))
    };
    const commentOperation = [constants.OPERATIONS.COMMENT, commentObject];

    const callbackBc = (err, success) => {
      if (err) {
        callback(err, null);
        const data = JSON.stringify({
          username: author,
          error: err
        });
        logComment(parentAuthor, parentPermlink, data);
      } else if (success) {
        const data = JSON.stringify({
          username: author,
          error: ''
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
    const callbackBc = (err, success) => {
      if (err) {
        callback(err, null);
        const data = JSON.stringify({
          username: username,
          error: err
        });
        logVote(voteStatus, author, url, data);
      } else if (success) {
        const data = JSON.stringify({
          username: username,
          error: ''
        });
        logVote(voteStatus, author, url, data);
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
        const data = JSON.stringify({
          username: follower,
          error: err
        });
        logFollow(status, following, data);
      } else if (result) {
        const data = JSON.stringify({
          username: follower,
          error: ''
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
        //   username: author
        //   error: err
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

  editPost(title, tags, description, permlink, parentPerm, media) {

    tags = _getValidTags(tags);

    const operation = [constants.OPERATIONS.COMMENT, {
      parent_author: '',
      parent_permlink: parentPerm,
      author: _getUserName(),
      permlink,
      title,
      description,
      body: 'empty',
      json_metadata: {
        tags: tags,
        app: 'steepshot'
      }
    }];
    return _preparePost(media, description, tags, permlink)
      .then(response => {
        return _sendToBlockChain(operation, response)
      })
      .then(response => {
        const data = JSON.stringify({
          username: _getUserName(),
          error: ''
        });
        logPost(data);
        return response;
      })
  }

  createPost(tags, title, description, file) {
    tags = _getValidTags(tags);
    const category = tags[0];
    const permlink = _getPermLink(title);
    const operation = [constants.OPERATIONS.COMMENT, {
      parent_author: '',
      parent_permlink: category,
      author: _getUserName(),
      permlink: permlink,
      title: title,
      description: description,
      body: 'empty',
      json_metadata: {
        tags: tags,
        app: 'steepshot'
      }
    }];
    return _fileUpload(operation, file)
      .then(response => {
        return _preparePost(response, description, tags, permlink);
      })
      .then(response => {
        return _sendToBlockChain(operation, response, _getBeneficiaries(operation[1].permlink, response.beneficiaries))
      })
      .then(response => {
        const data = JSON.stringify({
          username: _getUserName(),
          error: ''
        });
        logPost(data);
        return response;
      })
  }

  editDelete(title, tags, description, permlink, parentPerm) {
    let json_metadata = {
      tags: tags,
      app: 'steepshot',
    };
    const operation = [constants.OPERATIONS.COMMENT, {
      parent_author: '',
      parent_permlink: parentPerm,
      author: _getUserName(),
      permlink,
      title,
      description,
      body: '*deleted*',
      json_metadata: JSON.stringify(json_metadata)
    }];
    return _sendToBlockChain(operation, false, false)
      .then(response => {
        const data = JSON.stringify({
          username: _getUserName(),
          error: ''
        });
        logDeletedPost(_getUserName(), permlink, data);
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
        console.log(error);
        reject(new Error("Invalidate posting key."));
      }
    })
  });
}

function _fileUpload(operation, file) {
  return _preCompileTransaction(operation)
    .then(transaction => {
      let form = new FormData();
      form.append('file', file);
      form.append('trx', JSON.stringify(transaction));
      return fetch(`${_getBaseUrl()}/media/upload`, {
        method: 'POST',
        body: form
      }).then(response => response.json())
    })
}

function _sendToBlockChain(operation, prepareData, beneficiaries) {
  return new Promise((resolve, reject) => {
    if (prepareData) {
      operation[1].body = prepareData.body;
      operation[1].json_metadata = JSON.stringify(prepareData.json_metadata);
    }
    let operations;
    if (beneficiaries) {
      operations = [operation, beneficiaries];
    } else {
      operations = [operation]
    }
    const callback = (err, success) => {
      if (success) {
        resolve(success);
        return;
      }
      if (err.data) {
        switch (err.data.code) {
          case 10:
            reject(new Error('You can only create posts 5 minutes after the previous one.'));
            return;
        }
      }
      console.error(err);
      reject(new Error('Somethings went wrong.'));
    };
    console.log(operations);
    steem.broadcast.sendAsync(
      {operations, extensions: []},
      {posting: _getUserPostingKey()}, callback
    );
  })
}

function _preparePost(media, description, tags, permlink) {
  const options = {
    "username": _getUserName(),
    "media": [media],
    "description": description,
    "post_permlink": permlink,
    "tags": tags,
    "show_footer": true
  };

  return fetch(`${_getBaseUrl()}/post/prepare`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      ...options
    })
  }).then(response => response.json());
}

function _getPermLink() {
  let today = new Date();
  const permLink = 'web' + '-' + today.getFullYear() + '-' + today.getMonth() + '-' + today.getDay()
    + '-' + today.getHours() + '-' + today.getMinutes() + '-' + today.getSeconds();
  return permLink;
}

function _getValidTags(tags) {
  tags = tags.split(' ');
  if (tags.indexOf('steepshot') === -1) {
    tags = [...tags, 'steepshot']
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
