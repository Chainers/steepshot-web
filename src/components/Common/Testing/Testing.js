import React from 'react';
import Timer from "../Timer/Timer";

class Testing extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="test">
        <Timer waitingTime={100000000}/>
      </div>
    );
  }
}

export default Testing;
