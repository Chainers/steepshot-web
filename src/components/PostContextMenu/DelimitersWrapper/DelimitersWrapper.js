import * as React from 'react';
import ShowIf from '../../Common/ShowIf';
import Delimiter from './Delimiter/Delimiter';

class DelimitersWrapper extends React.Component {
  static defaultProps = {
    hasDelimiter: true,
  };
  
  constructor(props) {
    super(props);
  }
  
  render() {
    let wrapperStyle = {
      flexDirection: this.props.fullScreen ? 'column' : 'row',
    };
    
    return (
      <div className="wrapper_del" style={wrapperStyle}>
        <div className="content_del">
          {this.props.children}
        </div>
        <ShowIf show={this.props.hasDelimiter}>
          <Delimiter horizontal={this.props.fullScreen} scale={this.props.fullScreen ? '90%' : '60%'}/>
        </ShowIf>
      </div>
    );
  }
}

export default DelimitersWrapper;
