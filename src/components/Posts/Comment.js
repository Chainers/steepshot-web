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
import TimeAgo from 'timeago-react';

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

  setDefaultAvatar() {
    this.setState({ avatar: constants.NO_AVATAR });
  }

  openLikesModal() {
    let arr = this.state.item.url.split('');
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == '#') {
        arr.splice(0, i + 1);
      }
    }
    this.props.dispatch({ type : 'CLEAR_LIKES_INFO', url : `/${arr.join('')}` });
    jqApp.openLikesModal($(document));
  }

  userLinkFunc() {
    if (this.state.item.body.match(/@\w+/)) {
      let arr = this.state.item.body.split(' ').map( (item, index) => {
        if (/@\w+/.test(item)) {
          return <span key={index}>
                   <Link to={`/@${item.replace(/[^A-Za-z_.0-9]/g, '')}`}>
                     {item + ' '}
                   </Link>
                 </span>
        } else {
          return item + ' '
        }
      });
      return (
        <span>
          {arr}
        </span>
      )
    } else {
      return (
        <span>
          {this.state.item.body + ' '}
        </span>
      )
    }
  }

  replyAuthor() {
    this.props.replyAuthor(this.state.item.author);
  }

  likeFunc() {
    let like = this.state.item.net_votes;
    let text = null;
    let money = null;
    let reply = <span className="rectangle_comment text--center">
                  <span onClick={this.replyAuthor.bind(this)}>Reply</span>
                </span>
    if (like) {
      if (like == 1 || like == -1) {
        text = `${like} like`
      } else {
        text = `${like} likes`
      }
      if (this.state.item.total_payout_value > 0) {
        money = `+ $ ${this.state.item.total_payout_value}`;
      }
      return (
        <div className="comment-controls clearfix">
          {reply}
          <a className="likes" data-toggle="modal" onClick={this.openLikesModal.bind(this)}>{text}</a>
          <span className="pull-right">{money}</span>
        </div>
      )
    } else {
      return (
        <div className="comment-controls clearfix">
          {reply}
        </div>
      )
    }
  }

  render() {
    let avatar = this.state.avatar || constants.NO_AVATAR;
    const authorLink = `/@${this.props.item.author}`;
    return (
      <div className="comment">
        <div className="comment-head">
          <div className="user-wrap clearfix">
            <div className="date">
              <TimeAgo
                datetime={this.props.item.created}
                locale='en_US'
              />
            </div>
              <Link to={authorLink} className="user">
                <div className="photo">
                  <img src={avatar} alt="Image" onError={this.setDefaultAvatar.bind(this)} />
                </div>
                <div className="name">{this.props.item.author}</div>
              </Link>
          </div>
        </div>
        <div className="comment-text">
          {this.userLinkFunc()}
          <VouteComponent
              key="vote"
              item={this.props.item}
              updateVoteInComponent={this.updateVoteInComponent.bind(this)}
              parent='comment'
            />
        </div>
        {this.likeFunc()}
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
