import React from 'react';
import './likePostNotification.css';
import Avatar from '../../Common/Avatar/Avatar';
import {Link} from 'react-router-dom';

class LikePostNotification extends React.Component {

  render() {
    let userMoney = '';
    if (this.props.userMoney) {
      userMoney = `(+$${this.props.userMoney.toFixed(2)})`;
    }
    let thumbnail = {
      // background: `${this.props.thumbnail} center no-repeat`
      background: `gray center no-repeat`
    };
    let loginLink = `/@${this.props.login}`;
    let postLink = `/post/@${this.props.login}/${this.props.postPermlink}`;
    return (
      <div className="wrapper_like-post-not">
        <Link to={loginLink} target="_blank">
          <Avatar src={this.props.avatar} style={{width: '40px', height: '40px'}}/>
        </Link>
        <div className="text_like-post-not">
          <Link to={loginLink} target="_blank">
            <p>{this.props.username}</p>
          </Link>
          <p>Liked your post{userMoney}</p>
        </div>
        <div className="thumbnail_like-post-not" style={thumbnail}>
          <Link to={postLink} target="_blank">
            <div className="thumb-heart_like-post-not"/>
          </Link>
        </div>
      </div>
    );
  }
}

export default LikePostNotification;