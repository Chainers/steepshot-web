import * as React from 'react';
import './delimiter.css';

class Delimiter extends React.Component {
  static defaultProps = {
    scale: '100%'
  };

  render() {
    let wrapperStyle;
    let delimiterStyle;
    if (this.props.horizontal) {
      wrapperStyle = {
        clear: 'both',
      };
      delimiterStyle = {
        width: this.props.scale,
        height: '1px',
      };
    } else {
      wrapperStyle = {
        float: 'right',
      };
      delimiterStyle = {
        height: this.props.scale,
        width: '1px',
      };
    }

    return (
      <div className="center_del" style={wrapperStyle}>
        <div className="delimiter_del " style={delimiterStyle}></div>
      </div>
    );
  }
}

export default Delimiter;
