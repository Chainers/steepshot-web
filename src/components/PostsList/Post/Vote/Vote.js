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
      this.props.toggleVote(this.props.postIndex);
  }

  render() {
    let buttonClasses = 'btn-like';
    if (this.props.vote) {
      buttonClasses = buttonClasses + ' liked';
    }
    if (this.props.voteLoading) {
      buttonClasses = buttonClasses + ' loading';
    }
    return (
      <div className="wrap-btn" onClick={this.toggleVote.bind(this)}>
        <button type="button" className={buttonClasses}/>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state.posts[props.postIndex],
    ...props
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
