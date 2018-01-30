import React from 'react';

class ShowIf extends React.Component {
  static defaultProps = {
    removeFromDom: true,
  };

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.removeFromDom && !this.props.show) {
      return null;
    }
    let children = this.props.children.length > 1
      ? <div className="container_show-if">{this.props.children}</div>
      : this.props.children;

    children = (<div style={this.props.show ? {} : {display: 'none'}}>{children}</div>)

    return children;
  }
}

export default ShowIf;
