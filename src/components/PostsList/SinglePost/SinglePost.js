import React from 'react';
import {connect} from 'react-redux';
import {addSinglePost} from '../../../actions/post';
import PostModal from '../PostModal/PostModal';
import {logSharePost} from '../../../actions/logging';

class SinglePost extends React.Component {
  constructor(props) {
    super(props);
    this.props.addSinglePost(this.props.location.pathname);
  }

  // componentWillMount() {
  //   logSharePost();
  // }

  render() {
    if (!this.props.currentIndex) return null;
    return (
      <div className="container_sin-pos">
        <div className="to-center_sin-pos">
          <PostModal showClose={'yes'}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.postModal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addSinglePost: url => {
      dispatch(addSinglePost(url));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SinglePost);
