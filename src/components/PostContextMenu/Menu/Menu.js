import * as React from 'react';
import MenuItem from '../MenuItem/MenuItem';
import Delimiter from '../DelimitersWrapper/Delimiter/Delimiter';
import ShowIf from '../../Common/ShowIf';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.getItems = this.getItems.bind(this);
    this.getDimension = this.getDimension.bind(this);
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
  
  getDimension() {
    return;
  }
  
  render() {
    return (
      <div className={this.props.fullScreen
        ? 'full-screen-container_menu'
        : 'container_menu'}>
        <div className="header_menu">
          <span className="title_menu">Action with this post</span>
          <div className="wrapper-close-button_menu"
               onClick={this.closeModal.bind(this)}>
            <img src="/static/images/postMenuButton/close-but_menu.png"
                 alt="Close menu button"
                 className="close-button_menu"/>
          </div>
        </div>
        <Delimiter horizontal={true}/>
        <div className="box-item_menu">
          <div
            className={this.props.fullScreen
              ? 'full-screen-content_menu'
              : 'content_menu'}
            style={{
              width: this.props.contentWidth,
              height: this.props.contentHeight,
            }}>
            {this.getItems()}
          </div>
        </div>
        <ShowIf show={this.props.fullScreen}>
          <div className="filler_menu">
          </div>
        </ShowIf>
        <Delimiter horizontal={true}/>
        <div className="footer_menu">
          Select the action you want to perform with the post
        </div>
      </div>
    );
  }
}

export default Menu;
