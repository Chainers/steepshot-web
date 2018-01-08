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
      smallScreen: document.documentElement.clientWidth < Constants.SCREEN.SMALL_SCREEN_WIDTH
    };
    this.setShow = this.setShow.bind(this);
  }
  
  setShow(flag) {
    event.stopPropagation();
    this.setState({
      showModal: flag
    });
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
          <Menu buttonOption={this.getButtonOptions()}
                smallScreen={this.state.smallScreen}
                setShow={this.setShow}/>
        </Modal>
      </div>
    );
  }
}

export default PostContextMenu;
