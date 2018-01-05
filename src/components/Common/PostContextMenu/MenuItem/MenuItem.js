import * as React from 'react';
import Delimiter from '../Delimiter/Delimiter';

class MenuItem extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
  }
  
  render() {
    let size = {
      width: 100 / this.props.count + '%',
      height: '100%',
    };
    return (
      <div className="wrapper_men-ite" onClick={this.props.callback}
           style={size}>
        <Delimiter hasDelimiter={this.props.hasDelimiter}>
          <div className="container_men-ite">
            <div className="box_men-ite">
              <img src={this.props.img} alt={this.props.alt}
                   className="img_men_ite center-block"/>
              <span className="text-menu_men-ite">{this.props.alt}</span>
            </div>
          </div>
        </Delimiter>
      </div>
    );
  }
}

export default MenuItem;
