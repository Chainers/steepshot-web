import React from 'react';
import {connect} from 'react-redux';
import ShowIf from "../../../Common/ShowIf";
import {openModal} from "../../../../actions/modal";
import LikesFlagsList from "../../../LikesFlagsList/LikesFlagsList";

class Likes extends React.Component {
  constructor(props) {
    super(props);
  }

  openLikesModal() {
    let modalOption = {
<<<<<<< HEAD
      body: (<LikesFlagsList postIndex={this.props.postIndex}/>),
    };
    this.props.openModal('LikesFlagsModal', modalOption);

=======
      body: (<LikesList postIndex={this.props.postIndex}/>)
    };
    this.props.openModal('LikesModal', modalOption);
>>>>>>> 20e10e861571a4e77518a61052585441186c32a1
  }

  render() {
    return (
      <ShowIf show={this.props.likes !== 0}>
        <div className="container_likes" onClick={this.openLikesModal.bind(this)}>
          {this.props.likes} {this.props.likes > 1 ? 'likes' : 'like'}
        </div>
      </ShowIf>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    likes: state.posts[props.postIndex].net_likes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openModal: (index, options) => {
      dispatch(openModal(index, options));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Likes);
