import React from 'react';
import EditPost from "../../EditPost/EditPost";

class Testing extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: '123',
    }
  }

  render() {
    return (
      <EditPost />

    );
  }
}

export default Testing;
