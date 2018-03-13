import React from 'react';
import {connect} from 'react-redux';
import LoadingSpinner from '../../LoadingSpinner/index';

class FullScreenButtons extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    let like;
    if (this.props.post.voteLoading) {
      like = <LoadingSpinner style={{padding: '0 16px 0 10px'}} loaderClass="full-screen-loader"/>
    } else if (this.props.post.vote) {
      like = <p className="text_fsf">DISLIKE</p>;
    } else {
      like = <p className="text_fsf">LIKE</p>;
    }
    return (
      <div className="buttons-wrapper_fsf">
        <div className="button_fsf">
          <div className="arrow-left-img_fsf"/>
          <p className="text_fsf">PREV</p>
        </div>
        <div className="button_fsf">
          <div className="arrow-right-img_fsf"/>
          <p className="text_fsf">NEXT</p>
        </div>
        <div className="button_fsf" >
          <div className="like-img_fsf"/>
          {like}
        </div>
        <div className="button_fsf_esc">
          <div className="escape-img_fsf"/>
          <p className="text_fsf">BACK</p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.postModal,
    post: state.posts[state.postModal.currentIndex],
    postList: state.postsList[state.postModal.point],
  }
};

export default connect(mapStateToProps)(FullScreenButtons);
