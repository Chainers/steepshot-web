import * as React from 'react';
import MenuItem from '../MenuItem/MenuItem';
import Delimiter from '../DelimitersWrapper/Delimiter/Delimiter';
import ShowIf from '../../Common/ShowIf';

const BUTTON_SIZE = 100;
const PADDING_CONTAINER = 10;
const MARGIN_CONTAINER = 20;
const HOR_CONTAINER_WIDTH = 220;

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.getItems = this.getItems.bind(this);
    this.getScreenProperty = this.getScreenProperty.bind(this);
    this.resizeWindow = this.resizeWindow.bind(this);
    this.state = this.getScreenProperty();
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeWindow);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow);
  }

  resizeWindow() {
    this.setState(this.getScreenProperty());
  }

  getScreenProperty() {
    let buttonAmount = this.props.buttonOption.length;
    let clientWidth = BUTTON_SIZE * buttonAmount
      + (PADDING_CONTAINER + MARGIN_CONTAINER) * 2;

    if (document.documentElement.clientWidth > clientWidth) {
      return {
        fullScreen: false,
        contentWidth: BUTTON_SIZE * buttonAmount + PADDING_CONTAINER * 2,
        contentHeight: BUTTON_SIZE,
      };
    }
    return {
      fullScreen: true,
      contentWidth: HOR_CONTAINER_WIDTH,
      contentHeight: 'auto',
    };
  }

  getItems() {
    return this.props.buttonOption.map((item, index) => {
      return <MenuItem
        img={item.img}
        revertImg={item.revertImg}
        alt={item.alt}
        callback={item.callback}
        hasDelimiter={item.hasDelimiter}
        key={index.toString()}
        count={this.props.buttonOption.length}
        fullScreen={this.state.fullScreen}
      />;
    });
  }

  closeModal(event) {
    event.stopPropagation();
    this.props.closeModal();
  }

  render() {
    return (
      <div className="container_menu" style={{width: this.state.contentWidth}}>
        <div className="header_menu">
          <div className="title_menu">Actions with this post</div>
          <div className="cross-wrapper_menu" onClick={this.closeModal.bind(this)}>
            <i className="cross_menu"/>
          </div>
        </div>
        <Delimiter horizontal={true}/>
        <div
          className={this.state.fullScreen
            ? 'full-screen-content_menu'
            : 'content_menu'}
          style={{
            height: this.state.contentHeight,
          }}>
          {this.getItems()}
        </div>
        <ShowIf show={this.state.fullScreen}>
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
