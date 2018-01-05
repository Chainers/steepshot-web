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
      />
    });
  }
  
  render() {
    return (
      <div className="container_menu">
        {this.getItems()}
      </div>
    )
  }
}

export default Menu;
