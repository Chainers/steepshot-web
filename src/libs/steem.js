import steem from 'steem';

class Steem {
    comment(wif, parentAuthor, parentPermlink, author, body, tags, resolve) {
        const permlink = this._getPermLink();
        const title = "";
        const jsonMetadata = this._createJsonMetadata(tags);

        steem.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, (err, result) => {
            if(err) {
                console.log(err);
                return resolve(null);
            } else {
                return resolve({
                    type: 'UPDATE_COMMENTS'
                });
            }
        });
    }

    vote(wif, username, author, url) {
        steem.api.getContentAsync(author, url)
          .then((result) => {
            steem.broadcast.vote(wif, username, result.author, result.permlink, result.reward_weight, () => { return; });
          });
    }

    upVote() {
        //@TODO: Implement steem logic
    }

    downVote() {
        //@TODO: Implement steem logic
    }

    _selfBeneficiaries() {
        //@TODO: Implement steem logic
    }

    /** Follow an user */
    followUser(wif, follower, following) {
        const json = JSON.stringify(
            ['follow', {
            follower: follower,
            following: following,
            what: ['blog']
            }]
        );

        steem.broadcast.customJson(
            wif,
            [], // Required_auths
            [follower], // Required Posting Auths
            'follow', // Id
            json, //
            (err, result) => {
                if (err) {
                    console.log(err);
                }
            }
        );
    }

    /** Unfollow an user */
    unfollowUser(wif, follower, following) {
        const json = JSON.stringify(
            ['follow', {
                follower: follower,
                following: following,
                what: []
            }]
        );

        steem.broadcast.customJson(
            postingWif,
            [], // Required_auths
            [follower], // Required Posting Auths
            'follow', // Id
            json, //
            (err, result) => {
                if (err) {
                    console.log(err);
                }
            }
        );
    }

    /** Broadcast a post */
    createPost(wif, tags, author, title, file) {
        const jsonMetadata = this._createJsonMetadata(tags);
        const permlink = this._getPermLink();

        steem.broadcast.comment(
            wif,
            '', // Leave parent author empty
            tags[0], // Main tag
            author, // Author
            permlink + '-post', // Permlink
            title, // Title
            file, // Body
            jsonMetadata, // Json Metadata
            (err, result) => {
              console.log(err, result);
            }
        );
    }

    _createJsonMetadata(tags) {
        return {
            tags: tags,
            app: 'steepshot/0.0.5' //@TODO get metadata from Backend
        }
    }

    _getPermLink() {
        return new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
    }
}

export default new Steem();