import React from 'react';
import {connect} from 'react-redux';
import * as utils from 'lodash';
import {debounce} from 'lodash';
import {toggleFlag} from '../../../../actions/flag';
import Constants from '../../../../common/constants';
import {toggleVote} from '../../../../actions/vote';

class Vote extends React.Component {
  constructor(props) {
    super(props);
  }
  
  toggleVote() {
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
    ...state.postsList.posts[props.postIndex],
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
