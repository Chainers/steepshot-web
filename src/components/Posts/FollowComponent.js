import React from 'react';
import { Link } from 'react-router-dom';
import { voute } from '../../actions/raitingVoute';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import steem from 'steem';

class FollowComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      item: this.props.item,
      follow: this.props.item.has_followed != 0
    }
  }

  handleFollow() {
    if (this.state.follow) {
        this.unfollowToUser();
    } else {
        this.followToUser();
    }
    this.setState({ follow: !this.state.follow });
  }

  /** Follow an user */
  followToUser() {
    const follower = this.props.username; // Your username
    const following = this.state.item.username; // User to follow
    const postingWif = this.props.postingKey;
    var json = JSON.stringify(
        ['follow', {
        follower: follower,
        following: following,
        what: ['blog']
        }]
    );
    steem.broadcast.customJson(
        postingWif,
        [], // Required_auths
        [follower], // Required Posting Auths
        'follow', // Id
        json, //
        function(err, result) {
            console.log(err, result);
        }
    );
  }

  /** Unfollow an user */
  unfollowToUser() {
    const follower = this.props.username; // Your username
    const following = this.state.item.username; // User to follow
    const postingWif = this.props.postingKey;
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
        function(err, result) {
            console.log(err, result);
        }
    );
  }

  render() {
    let componentClassNames = 'follow';
    let componentName = 'Follow';

    if (this.state.follow) {
        componentClassNames = 'unfollow';
        componentName = 'Unfollow';
    }

    return (
        <div className="follow-block" onClick={this.handleFollow.bind(this)}>
          <div className={componentClassNames}>{componentName}</div>
        </div>
    );
  }
}

FollowComponent.propTypes = {
  item: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    localization: state.localization,
    username: state.auth.user,
    postingKey: state.auth.postingKey
  };
};

export default connect(mapStateToProps)(FollowComponent);
