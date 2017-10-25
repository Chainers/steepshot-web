import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  connect
} from 'react-redux';
import PropTypes from 'prop-types';
import constants from '../../common/constants';
import VouteComponent from './VouteComponent';

class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      item: this.props.item,
      avatar: this.props.item.avatar
    };
  }

  updateVoteInComponent(vote) {
    let newItem = this.state.item;
    vote ? newItem.net_votes++ : newItem.net_votes--;
    newItem.vote = vote;
    this.setState({ 
      item: newItem
    });
}

  getFormatedDate() {
    const date = new Date(this.props.item.created);
    const locale = "en-us";

    return date.getDate() + ' ' + date.toLocaleString(locale, { month: "short" }) + ' ' + date.getFullYear();
  }

  setDefaultAvatar() {
    this.setState({ avatar: constants.NO_AVATAR });
  }

  render() {
    let avatar = this.state.avatar || constants.NO_AVATAR;
    const authorLink = `/userProfile/${this.props.item.author}`;

    return (
      <div className="comment">
        <div className="comment-head">
          <div className="user-wrap clearfix">
            <div className="date">{this.getFormatedDate()}</div>
              <Link to={authorLink} className="user">
                <div className="photo">
                  <img src={avatar} alt="Image" onError={this.setDefaultAvatar.bind(this)} />
                </div>
                <div className="name">{this.props.item.author}</div>
              </Link>
          </div>
        </div>
        <div className="comment-text">
          {this.props.item.body}
          <VouteComponent
              key="vote"
              item={this.props.item}
              updateVoteInComponent={this.updateVoteInComponent.bind(this)}
              parent='comment'
            />
        </div>
        <div className="comment-controls clearfix">
          <a data-toggle="modal">{this.props.item.net_votes} Like's</a>
          <span>+ $ {this.props.item.total_payout_value}</span>
        </div>
      </div>
    );
  }
}

Comment.propTypes = {
  item: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(Comment);
