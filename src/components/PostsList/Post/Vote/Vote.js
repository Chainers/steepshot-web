import React from 'react';
import {connect} from 'react-redux';
import {toggleVote} from '../../../../actions/vote';
import Constants from '../../../../common/constants';

class Vote extends React.Component {
  constructor(props) {
    super(props);
  }

  toggleVote() {
    if (this.props.commentLoader) {
      jqApp.pushMessage.open(Constants.WAIT_FINISHING_TRANSACTION);
      return;
    }
    if (this.props.isPLOpen) {
      return;
    }
    this.props.toggleVote(this.props.postIndex);
    clearTimeout(this.props.plTimeout);
  }

  render() {
    let buttonClasses = 'btn-like';
    if (this.props.vote) {
      buttonClasses = buttonClasses + ' liked';
    }
    if (this.props.voteLoading) {
      buttonClasses = buttonClasses + ' loading';
    }
    let style = this.props.style ? this.props.style : null;
    return (
      <div className="btn-like-wrapper_vote" onClick={this.toggleVote.bind(this)} style={style}>
        <button type="button" className={buttonClasses}/>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  let post = state.posts[props.postIndex];
  return {
    ...post,
    ...props,
    isPLOpen: post.isPLOpen,
    plTimeout: post.plTimeout,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleVote: (postIndex) => {
      dispatch(toggleVote(postIndex));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Vote);
