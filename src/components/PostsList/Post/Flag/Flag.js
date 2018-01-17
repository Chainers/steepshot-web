import React from 'react';
import {connect} from 'react-redux';
import {debounce} from 'lodash';
import {toggleFlag} from '../../../../actions/flag';

class Flag extends React.Component {
  constructor(props) {
    super(props);
    this.getOptions = this.getOptions.bind(this);
  }

  toggleFlag() {
    this.props.toggleFlag(this.props.postIndex);
  }
  
  render() {
    let options = this.getOptions();
    let buttonClasses = "btn-flag";
    if (options.flag) {
      buttonClasses = buttonClasses + " marked";
    }
    if (options.flagLoading) {
      buttonClasses = buttonClasses + " loading";
    }
    
    return (
        <div className="wrap-btn" onClick={this.toggleFlag.bind(this)}>
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
    toggleFlag: (postIndex) => {
      dispatch(toggleFlag(postIndex));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Flag);
