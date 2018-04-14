import React from 'react';
import './commentPostNotification.css';
import Avatar from '../../Common/Avatar/Avatar';
import Link from 'react-router-dom/Link';

class CommentPostNotification extends React.Component {

  render() {
    let thumbnail = {
      // background: `${this.props.thumbnail} center no-repeat`
      background: `#daa520 center no-repeat`
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
            <p>Commented your post</p>
          </div>
          <Link to={postLink} target="_blank">
            <div className="thumbnail_like-post-not" style={thumbnail}>
              <div className="thumb-comment_comment-post-not"/>
            </div>
          </Link>
        </div>
        <Link to={postLink} target="_blank">
          <div className="text-comment_like-comment-not" style={ellipsisForWebkit}>«{this.props.commentText}»</div>
        </Link>
      </div>
    );
  }
}

export default CommentPostNotification;