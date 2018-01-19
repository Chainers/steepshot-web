import React from 'react';

class ShowIf extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.show) return null;
    return this.props.children.length > 1 ?
        <div className="container_show-if">{this.props.children}</div>
      : this.props.children
      
  }
}

export default ShowIf;
