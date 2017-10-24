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
      follow: this.props.item ? this.props.item.has_followed != 0 : false
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
    Steem.unfollowUser(this.props.postingKey, this.props.username, this.state.item.username);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item !== undefined && nextProps.item !== null)
    this.setState({
        item: nextProps.item,
        follow: nextProps.item ? nextProps.item.has_followed != 0 : false
    });
  }

  render() {
    let componentClassNames = 'btn btn-default';
    let componentName = 'Follow';

    if (this.state.follow) {
        componentClassNames = 'btn btn-primary';
        componentName = 'Unfollow';
    }

    let renderItem = null;

    if (this.state.item) {
      renderItem = <div className={componentClassNames}>{componentName}</div>
    }

    return (
        <div className="btn-wrap" onClick={this.handleFollow.bind(this)}>
          {renderItem}
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
