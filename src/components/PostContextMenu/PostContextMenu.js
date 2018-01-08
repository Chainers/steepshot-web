import * as React from 'react';
import PostMenuButton from './OpenMenuButton/PostMenuButton';
import Modal from '../Common/Modal/Modal';
import MenuItem from './MenuItem/MenuItem';
import Menu from './Menu/Menu';
import Constants from '../../common/constants';

class PostContextMenu extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      smallScreen: document.documentElement.clientWidth < Constants.POST_CONTEXT_MENU.SMALL_SCREEN_WIDTH
    };
    this.setShow = this.setShow.bind(this);
    this.resizeWindow = this.resizeWindow.bind(this);
  }
  
  setShow(flag) {
    event.stopPropagation();
    this.setState({
      showModal: flag
    });
    if (this.state.showModal != flag) {
      if (flag) {
        window.addEventListener('resize', this.resizeWindow);
      } else {
        window.removeEventListener('resize', this.resizeWindow);
      }
    }
  }
  
  resizeWindow() {
    if (document.documentElement.clientWidth > Constants.POST_CONTEXT_MENU.SMALL_SCREEN_WIDTH) {
      this.setState({
        smallScreen: false,
      });
    } else {
      this.setState({
        smallScreen: true,
      });
    }
  }
  
  flagThis() {
    console.log('Flag this');
  }
  
  getButtonOptions() {
    return [
      {
        img: "/static/images/flagTrue.svg",
        alt: "Flag this",
        callback: this.flagThis.bind(this),
        hasDelimiter: true
      },{
        img: "/static/images/flagTrue.svg",
        alt: "Flag this",
        callback: this.flagThis.bind(this),
        hasDelimiter: true
      },{
        img: "/static/images/flagTrue.svg",
        alt: "Flag this",
        callback: this.flagThis.bind(this),
        hasDelimiter: true
      }
    ];
  }
  
  render() {
    return (
      <div className="container_pos-con-men">
        <PostMenuButton setShow={this.setShow}/>
        <Modal show={this.state.showModal} setShow={this.setShow}>
          <Menu buttonOption={this.getButtonOptions()} smallScreen={this.state.smallScreen}/>
        </Modal>
      </div>
    );
  }
}

export default PostContextMenu;
