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
    this.getOptions = this.getOptions.bind(this);
  }
  
  toggleVote() {
    this.props.toggleVote(this.props.postIndex);
  }
  
  render() {
    let options = this.getOptions();
    let buttonClasses = 'btn-like';
    if (options.vote) {
      buttonClasses = buttonClasses + ' liked';
    }
    if (options.voteLoading) {
      buttonClasses = buttonClasses + ' loading';
    }
    return (
      <div className="wrap-btn" onClick={this.toggleVote.bind(this)}>
        <button type="button" className={buttonClasses}/>
      </div>
    );
  }
  
  getOptions() {
    return this.props.postsList.posts[this.props.postIndex];
  }
  
}

const mapStateToProps = (state) => {
  return {
    postsList: state.postsList,
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
