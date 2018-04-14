import React from 'react';
import './followUserNotification.css';
import Avatar from '../../Common/Avatar/Avatar';
import Link from 'react-router-dom/Link';

class FollowUserNotification extends React.Component {

  render() {
    let thumbnail = {
      background: `url(/images/follow-user-not.svg) center no-repeat`
    };
    let loginLink = `/@${this.props.login}`;
    return (
      <div className="wrapper_like-post-not">
        <Link to={loginLink} target="_blank">
          <Avatar src={this.props.avatar} style={{width: '40px', height: '40px'}}/>
        </Link>
        <div className="text_like-post-not">
          <Link to={loginLink} target="_blank">
            <p>{this.props.username}</p>
          </Link>
          <p>Follow you</p>
        </div>
        <div className="thumbnail_like-post-not" style={thumbnail}/>
      </div>
    );
  }
}

export default FollowUserNotification;