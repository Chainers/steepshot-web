import * as React from 'react';
import Delimiter from '../DelimitersWrapper/DelimitersWrapper';

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const boxStyle = {
      flexDirection: this.props.fullScreen ? 'row' : 'column',
      alignItems: this.props.fullScreen ? 'center' : 'stretch',
      justifyContent: this.props.fullScreen ? 'center' : 'stretch',
    };
    const contentStyle = {
      margin: this.props.fullScreen ? 'auto 5px' : 'auto',
    };
    return (
      <div className="wrapper_men-ite" onClick={this.props.callback}>
        <Delimiter hasDelimiter={this.props.hasDelimiter}
                   fullScreen={this.props.fullScreen}>
          <div className="box_men-ite" style={boxStyle}>
            <img src={this.props.img} alt={this.props.alt}
                 className="img_men_ite" style={contentStyle}/>
            <span className="text-menu_men-ite"
                  style={contentStyle}>{this.props.alt}</span>
          </div>
        </Delimiter>
      </div>
    );
  }
}

export default MenuItem;
