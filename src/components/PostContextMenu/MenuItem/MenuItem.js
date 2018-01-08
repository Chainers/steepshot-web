import * as React from 'react';
import Delimiter from '../DelimitersWrapper/DelimitersWrapper';

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let itemStyle;
    let boxStyle;
    if (this.props.smallScreen) {
      itemStyle = {
        width: '100%',
        height: 100 / this.props.count + '%',
        float: 'none',
      };
      boxStyle = {
        display: 'flex',
      }
    } else {
      itemStyle = {
        width: 100 / this.props.count + '%',
        height: '100%',
        float: 'left',
      };
      boxStyle = {
      
      }
    }
    return (
      <div className="wrapper_men-ite" onClick={this.props.callback}
           style={itemStyle}>
        <Delimiter hasDelimiter={this.props.hasDelimiter} smallScreen={this.props.smallScreen}>
          <div className="container_men-ite">
            <div className="box_men-ite" style={boxStyle}>
              <img src={this.props.img} alt={this.props.alt}
                   className="img_men_ite"/>
              <span className="text-menu_men-ite">{this.props.alt}</span>
            </div>
          </div>
        </Delimiter>
      </div>
    );
  }
}

export default MenuItem;
