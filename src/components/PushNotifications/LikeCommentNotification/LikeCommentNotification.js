import React from 'react';
import './likeCommentNotification.css';
import Avatar from '../../Common/Avatar/Avatar';
import Link from 'react-router-dom/Link';

class LikeCommentNotification extends React.Component {

  render() {
    let userCommentMoney = '';
    if (this.props.userCommentMoney) {
      userCommentMoney = `(+$${this.props.userCommentMoney.toFixed(2)})`;
    }
    let thumbnail = {
      background: `url(/images/comment-not-like.svg) center no-repeat`
    };
    let ellipsisForWebkit = {
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 2,
      display: '-webkit-box'
    };
    let loginLink = `/@${this.props.login}`;
    let postLink = `/post/@${this.props.login}/${this.props.postPermlink}`;
    return (
      <div className="wrapper_like-comment-not">
        <div className="sub-wrapper_like-comment-not">
          <Link to={loginLink} target="_blank">
            <Avatar src={this.props.avatar} style={{width: '40px', height: '40px'}}/>
          </Link>
          <div className="text_like-post-not">
            <Link to={loginLink} target="_blank">
              <p>{this.props.username}</p>
            </Link>
            <p>Liked your comment{userCommentMoney}</p>
          </div>
          <div className="thumbnail_like-post-not" style={thumbnail}/>
        </div>
        <Link to={postLink} target="_blank">
          <div className="text-comment_like-comment-not" style={ellipsisForWebkit}>«{this.props.commentText}»</div>
        </Link>
      </div>
    );
  }
}

export default LikeCommentNotification;