import React, { Component } from 'react';
import ShowIf from '../Common/ShowIf';

class LoadingSpinner extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ShowIf show={this.props.show}>
        <div className="loader-blocker">
          <div className={this.props.deleting ? 'deleting-loader' : 'loader'}/>
        </div>
      </ShowIf>
    )
  }

}

LoadingSpinner.defaultProps  = {
  show: true
};

export default LoadingSpinner;
