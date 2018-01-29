import React from 'react';

class ShowIf extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.children.length > 1) {
      console.log(this.props.children);
    }
    if (!this.props.show) return null;
    return this.props.children
  }
}

export default ShowIf;
