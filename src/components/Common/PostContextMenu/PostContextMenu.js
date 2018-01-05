import * as React from 'react';
import PostMenuButton from './OpenMenuButton/PostMenuButton';
import Modal from '../Modal/Modal';
import MenuItem from './MenuItem/MenuItem';
import Menu from './Menu/Menu';

class PostContextMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
    this.setShow = this.setShow.bind(this);
  }
  
  setShow(flag) {
    event.stopPropagation();
    this.setState({
      showModal: flag
    })
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
      }
    ];
  }
  
  render() {
    return (
      <div className="container_pos-con-men">
        <PostMenuButton setShow={this.setShow}/>
        <Modal show={this.state.showModal} setShow={this.setShow}>
          <Menu buttonOption={this.getButtonOptions()}/>
        </Modal>
      </div>
    );
  }
}

export default PostContextMenu;
