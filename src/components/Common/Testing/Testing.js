import React from 'react';
import Timer from "../Timer/Timer";

class Testing extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="test">
        <button type="submit" disabled={true}
                className="btn btn-default"><Timer waitingTime={100000000}/>
        </button>
      </div>
    );
  }
}

export default Testing;
