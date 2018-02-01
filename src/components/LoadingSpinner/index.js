import React from 'react';
import ShowIf from '../Common/ShowIf';

class LoadingSpinner extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let topOffset = this.props.styles || '15px';
    return (
      <ShowIf show={this.props.show}>
        <div className="loader-blocker"
             style={{top: topOffset, position: this.props.deleting ? 'absolute' : 'relative'}}
        >
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
