import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import constants from '../../common/constants';
import VouteComponent from './VouteComponent';
import TimeAgo from 'timeago-react';
import {UserLinkFunc} from '../Common/UserLinkFunc';
import Avatar from '../Common/Avatar/Avatar';

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
    vote ? newItem.net_likes++ : newItem.net_likes--;
    newItem.vote = vote;
    this.setState({
      item: newItem
    });
  }

  componentDidMount() {
    if (this.state.item &&
        /<[\w\W]+>/.test(this.state.item.body) ||
        /\n/.test(this.state.item.body) ||
        /http(s)?:\/\/|www\.[\w\W]+/g.test(this.state.item.body)) {
      let safetyScript = this.state.item.body.replace(/<script>|<\/script>/g, '');
      let newLine = safetyScript.replace(/\n/g, '<br>');
      let replaceBotsLayout = newLine.replace(/(!)?\[([^\]]+)?\]/g, '');
      let changeBotsLink = replaceBotsLayout.replace(/\((http(s)?:\/\/[\w\W]+?|www\.[\w\W]+?)\)/g, '$1');
      let linkToImg = changeBotsLink.replace(/(http(s)?:\/\/[\w\W]+?(\.png|\.gif|\.jpg|\.jpeg|\.tiff)(?!"))/gi, '<img src="$1"/>');
      console.log(linkToImg);
      this.commentText.innerHTML = linkToImg;
    }
  }

  openLikesModal() {
    // let arr = this.state.item.url.split('');
    // for (let i = 0; i < arr.length; i++) {
    //   if (arr[i] == '#') {
    //     arr.splice(0, i + 1);
    //   }
    // }
    // this.props.dispatch({ type : 'CLEAR_LIKES_INFO', url : `/${arr.join('')}` });
    // jqApp.openLikesModal($(document));
  }

  replyAuthor() {
    if (this.props.replyUser) {
      this.props.replyUser.value = `@${this.state.item.author}, `;
      this.props.replyUser.focus();
    } else {
      jqApp.pushMessage.open(constants.VOTE_ACTION_WHEN_NOT_AUTH);
    }
  }

  likeFunc() {
    let like = this.state.item.net_likes;
    let text = null;
    let money = null;
    let reply = <span className="rectangle_comment text--center">
                  <span onClick={this.replyAuthor.bind(this)}>Reply</span>
                </span>;
    if (like) {
      if (like == 1 || like == -1) {
        text = `${like} like`
      } else {
        text = `${like} likes`
      }
      if (this.state.item.total_payout_value > 0) {
        money = `+ $${this.state.item.total_payout_value.toFixed(3)}`;
      }
      return (
        <div className="comment-controls clearfix">
          {reply}
          <a className="likes"
            onClick={this.openLikesModal.bind(this)}
          >{text}</a>
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
              <Avatar src={avatar}/>
              <div className="name">{this.props.item.author}</div>
            </Link>
          </div>
        </div>
        <div className="comment-text">
          <div ref={ref => {this.commentText = ref}} className="comment-text_comment">
            {UserLinkFunc(null, this.state.item.body)}
          </div>
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
