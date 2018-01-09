import * as React from 'react';
import MenuItem from '../MenuItem/MenuItem';
import Delimiter from '../DelimitersWrapper/Delimiter/Delimiter';

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
        fullScreen={this.props.fullScreen}
      />;
    });
  }
  
  closeModal(event) {
    event.stopPropagation();
    this.props.closeFunc();
  }
  
  render() {
    return (
      <div className={this.props.fullScreen
        ? 'full-screen-container_menu'
        : 'container_menu'}>
        <div className="header_menu">
          <div className="wrapper-close-button_menu"
               onClick={this.closeModal.bind(this)}>
            <button className="close-button_menu"></button>
          </div>
        </div>
        <Delimiter horizontal={true}/>
        <div className={this.props.fullScreen
          ? 'full-screen-content_menu'
          : 'content_menu'}>
          {this.getItems()}
        </div>
        <Delimiter horizontal={true}/>
        <div className="footer_menu">
          some text
        </div>
      </div>
    );
  }
}

export default Menu;
