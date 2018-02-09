import React from 'react';
import {connect} from 'react-redux';
import {
  Link
} from 'react-router-dom';
import constants from '../../common/constants';
import Avatar from '../Common/Avatar/Avatar';

class UserItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authorName: this.props.username,
      item: this.props.item,
      showFollow: this.props.showFollow !== undefined ? this.props.showFollow : true,
      items: []
    };
  }

  closeFunc() {
    this.props.dispatch({type: 'CLEAR_LIKES_INFO', url: this.state.url});
    jqApp.closeLikesModal($(document));
  }

  render() {
    let profileImageSrc = this.state.item.avatar || constants.NO_AVATAR;
    const name = this.state.item.author || this.state.item.name || 'Unknown';
    const location = this.state.item.location || '';
    const authorLink = `/@${this.state.item.author}`;

    return (
      <div className="item-wrap" style={{marginBottom: '10px'}}>
        <div className="user-card">
          <div className="card-wrap clearfix">
            <div onClick={this.closeFunc.bind(this)}>
              <Link to={authorLink}>
                <Avatar src={profileImageSrc}/>
              </Link>
            </div>
            <div className="text">
              <div onClick={this.closeFunc.bind(this)}>
                <Link to={authorLink} className="name">
                  {name}
                </Link>
              </div>
              <div className="location">{location}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(UserItem);
