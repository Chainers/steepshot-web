import React from 'react';
import {
  connect
} from 'react-redux';

class LikesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      ...this.props
    };
  }

  openLikesModal() {
      this.props.dispatch({ type : 'CLEAR_LIKES_INFO', url : this.state.url })
      jqApp.openLikesModal($(document));
  }

  render() {
    const {
        likes,
        persons
    } = this.state;
    return (
        <div className="likes" onClick={this.openLikesModal.bind(this)}>{likes} like's</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(LikesComponent);