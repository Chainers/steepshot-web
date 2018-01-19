import React from 'react';
import {connect} from 'react-redux';
import {debounce} from 'lodash';
import {toggleFlag} from '../../../../actions/flag';

class Flag extends React.Component {
  constructor(props) {
    super(props);
  }

  toggleFlag() {
    this.props.toggleFlag(this.props.postIndex);
  }
  
  render() {
    let buttonClasses = "btn-flag";
    if (this.props.flag) {
      buttonClasses = buttonClasses + " marked";
    }
    if (this.props.flagLoading) {
      buttonClasses = buttonClasses + " loading";
    }
    
    return (
        <div className="wrap-btn" onClick={this.toggleFlag.bind(this)}>
          <button type="button" className={buttonClasses}/>
        </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state.posts[props.postIndex],
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
