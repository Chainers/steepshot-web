import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  voute
} from '../../actions/raitingVoute';
import {
  connect
} from 'react-redux';
import PropTypes from 'prop-types';
import Steem from '../../libs/steem';

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

  followToUser() {
    Steem.followUser(this.props.postingKey, this.props.username, this.state.item.username);
  }

  unfollowToUser() {
    Steem.followUser(this.props.postingKey, this.props.username, this.state.item.username);
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
