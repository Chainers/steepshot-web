import * as React from 'react';
import PostMenuButton from './OpenMenuButton/PostMenuButton';
import Modal from '../Common/Modal/Modal';
import MenuItem from './MenuItem/MenuItem';
import Menu from './Menu/Menu';
import Constants from '../../common/constants';

const MAX_WIDTH_FULL_SCREEN = 400;

class PostContextMenu extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      fullScreen: this.isFullScreen(),
    };
    this.closeFunc = this.closeFunc.bind(this);
    this.openFunc = this.openFunc.bind(this);
    this.resizeWindow = this.resizeWindow.bind(this);
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.resizeWindow);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow);
  }
  
  resizeWindow() {
    this.setState({
      fullScreen: this.isFullScreen(),
    });
  }
  
  isFullScreen() {
    return document.documentElement.clientWidth < MAX_WIDTH_FULL_SCREEN;
  }
  
  flagThis() {
    console.log('Flag this');
  }
  
  getButtonOptions() {
    return [
      {
        img: '/static/images/flagTrue.svg',
        alt: 'Flag this',
        callback: this.flagThis.bind(this),
        hasDelimiter: true,
      }, {
        img: '/static/images/flagTrue.svg',
        alt: 'Flag this',
        callback: this.flagThis.bind(this),
        hasDelimiter: true,
      }, {
        img: '/static/images/flagTrue.svg',
        alt: 'Flag this',
        callback: this.flagThis.bind(this),
        hasDelimiter: false,
      },
    ];
  }
  
  closeFunc() {
    this.setState({
      showModal: false,
    });
  }
  
  openFunc() {
    this.setState({
      showModal: true,
    });
  }
  
  render() {
    return (
      <div className="container_pos-con-men">
        <PostMenuButton openFunc={this.openFunc}/>
        <Modal
          show={this.state.showModal}
          closeFunc={this.closeFunc}
          fullScreen={this.state.fullScreen}
        >
          <Menu buttonOption={this.getButtonOptions()}
                fullScreen={this.state.fullScreen}
                closeFunc={this.closeFunc}/>
        </Modal>
      </div>
    );
  }
}

export default PostContextMenu;
