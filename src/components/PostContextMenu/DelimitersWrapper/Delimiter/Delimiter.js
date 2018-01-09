import * as React from 'react';

class Delimiter extends React.Component {
  static defaultProps = {
    scale: 90
  };
  
  constructor(props) {
    super(props);
  }
  
  render() {
    let wrapperStyle;
    let delimiterStyle;
    if (this.props.horizontal) {
      wrapperStyle = {
        height: '1px',
        clear: 'both',
      };
      delimiterStyle = {
        width: this.props.scale + '%',
      };
    } else {
      wrapperStyle = {
        width: '1px',
        float: 'right',
      };
      delimiterStyle = {
        height: this.props.scale + '%',
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
