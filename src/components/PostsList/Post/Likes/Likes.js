import React from 'react';
import { connect } from 'react-redux';
import ShowIf from "../../../Common/ShowIf";
import {openModal} from "../../../../actions/modal";
import LikesList from "../../../LikesList/LikesList";

class Likes extends React.Component {
  constructor(props) {
    super(props);
  }

  openLikesModal() {
    let modalOption = {
      body: (<LikesList postIndex={this.props.postIndex}/>),
    };
    this.props.openModal('LikesModal', modalOption);

  }

  render() {
    return (
      <ShowIf show={this.props.likes !== 0}>
        <div className="container_likes" onClick={this.openLikesModal.bind(this)}>
          {this.props.likes} {this.props.likes> 1 ? 'likes' : 'like'}
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
