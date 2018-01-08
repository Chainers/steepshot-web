import * as React from 'react';
import MenuItem from '../MenuItem/MenuItem';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.getItems = this.getItems.bind(this);
  }
  
  getItems() {
    return this.props.buttonOption.map((item, index) => {
      return <MenuItem
        img={item.img}
        alt={item.alt}
        callback={item.callback}
        hasDelimiter={item.hasDelimiter}
        key={index.toString()}
        count={this.props.buttonOption.length}
        smallScreen={this.props.smallScreen}
      />
    });
  }
  
  render() {
    return (
      <div className={this.props.smallScreen ? 'small_container_menu' : 'container_menu'}>
        <div className="header_menu">
        
        </div>
        {this.getItems()}
      </div>
    )
  }
}

export default Menu;
