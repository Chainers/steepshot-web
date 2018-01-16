import React from 'react';
import {connect} from 'react-redux';
import {debounce} from 'lodash';
import {toggleFlag} from '../../../../actions/flag';
import Constants from '../../../../common/constants';

class Flag extends React.Component {
  constructor(props) {
    super(props);
    this.getOptions = this.getOptions.bind(this);
  }

  updateFlag(e) {
    this.props.toggleFlag(this.props.postIndex);
  }
  
  getOptions() {
    return this.props.postsList[Constants.POSTS_FILTERS.POSTS_HOT.point]
      .posts[this.props.postIndex];
  }
  
  render() {
    let options = this.getOptions();
    let buttonClasses = "btn-flag";
    if (options.flag) {
      buttonClasses = buttonClasses + " marked";
    }
    if (options.ui.flagLoading) {
      buttonClasses = buttonClasses + " loading";
    }
    
    return (
        <div className="wrap-btn" onClick={this.updateFlag.bind(this)}>
          <button type="button" className={buttonClasses}></button>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    postsList: state.postsList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleFlag: (postIndex) => {
      dispatch(toggleFlag(postIndex));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Flag);
