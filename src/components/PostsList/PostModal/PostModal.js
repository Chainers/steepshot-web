import React from 'react';
import {connect} from 'react-redux';
import {initPostModal} from '../../../actions/postModal';
import constants from '../../../common/constants';

class PostModal extends React.Component {
  constructor(props) {
    super(props);
    let options = {
      point: this.props.point,
      currentIndex: this.props.index,
    };
    this.props.initPostModal(options);
  }
  
  render() {
    if (!this.props.post) {
      return null;
    }
    return (
      <div className="container_pos-mod">
        <div className="image-container_pos-mod">
          <button title="Share this post"
                  className="btn btn-default btn-xs"
          >Share post</button>
            <img src={this.props.post.body || constants.NO_IMAGE} alt="Post picture."/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  if (!state.postModal.currentIndex) {
    return {};
  }
  let currentIndex = state.postModal.currentIndex;
  console.log(currentIndex + "current");
  return {
    post: state.posts[currentIndex],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initPostModal: (options) => {
      dispatch(initPostModal(options));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
