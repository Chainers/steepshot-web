import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  connect
} from 'react-redux';
import PropTypes from 'prop-types';
import constants from '../../common/constants';

class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: this.props.item.avatar
    };
  }

  setDefaultAvatar() {
    this.setState({ avatar: constants.NO_AVATAR });
  }

  render() {
    let avatar = this.state.avatar || constants.NO_AVATAR;
    const authorLink = `/userProfile/${this.props.item.author}`;

    return (
        <div className="comment">
            <div>
                <img width="40px" height="40px" className="user-avatar" src={avatar} alt="Image" onError={this.setDefaultAvatar.bind(this)}/>
            </div>
            <div className="">
                <Link to={authorLink}><strong>{this.props.item.author}</strong></Link>
                <div className="comment-text">
                    {this.props.item.body}
                </div>
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
