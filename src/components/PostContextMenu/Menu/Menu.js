import * as React from 'react';
import MenuItem from '../MenuItem/MenuItem';
import Constants from '../../../common/constants';
import Delimiter from '../DelimitersWrapper/Delimiter/Delimiter';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smallScreen: this.isSmall(),
    };
    this.getItems = this.getItems.bind(this);
    this.resizeWindow = this.resizeWindow.bind(this);
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
        smallScreen={this.state.smallScreen}
      />;
    });
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.resizeWindow);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow);
  }
  
  
  resizeWindow() {
    this.setState({
      smallScreen: this.isSmall(),
    });
  }
  
  isSmall() {
    return document.documentElement.clientWidth < Constants.SCREEN.SMALL_SCREEN_WIDTH
  }
  
  closeModal(event){
    event.stopPropagation();
    this.props.setShow(false);
  }
  
  render() {
    return (
      <div className={this.state.smallScreen
        ? 'small_container_menu'
        : 'container_menu'}>
        <div className="header_menu">
          <div className="wrapper-close-button_menu" onClick={this.closeModal.bind(this)}>
            <button className="close-button_menu"></button>
          </div>
          <Delimiter horizontal={true}/>
        </div>
        <div className={this.state.smallScreen
          ? 'small_content_menu'
          : 'content_menu'}>
          {this.getItems()}
        </div>
      </div>
    );
  }
}

export default Menu;
