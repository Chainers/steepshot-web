import React, {Component} from 'react';

class LoadingSpinner extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className="loader-blocker">
        <div className="loader"></div>
      </div>
    )
  }

}

export default LoadingSpinner;
