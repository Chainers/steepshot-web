import * as React from 'react';
import PostMenuButton from './OpenMenuButton/PostMenuButton';
import Modal from '../Common/Modal/Modal';
import Menu from './Menu/Menu';

const BUTTON_AMOUNT = 5;
const MIN_BUTTON_WIDTH = 110;
const MAX_BUTTON_WIDTH = 150;
const CONTENT_PADDING = 20;
const CONTENT_MARGIN = 40;
const MAX_HORIZONTAL_CONTENT_WIDTH = 200;
const MIN_CONTENT_WIDTH = BUTTON_AMOUNT * MIN_BUTTON_WIDTH + 2 *
  (CONTENT_PADDING + CONTENT_MARGIN);
const MAX_CONTENT_WIDTH = BUTTON_AMOUNT * MAX_BUTTON_WIDTH + 2 *
  (CONTENT_PADDING + CONTENT_MARGIN);

class PostContextMenu extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      fullScreen: false,
      contentWidth: MAX_CONTENT_WIDTH,
      contentHeight: MAX_BUTTON_WIDTH,
    };
    this.closeFunc = this.closeFunc.bind(this);
    this.openFunc = this.openFunc.bind(this);
    this.resizeWindow = this.resizeWindow.bind(this);
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.resizeWindow);
    this.resizeWindow();
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow);
  }
  
  resizeWindow() {
    if (document.documentElement.clientWidth > MAX_CONTENT_WIDTH) {
      if (this.state.contentWidth !== MAX_CONTENT_WIDTH) {
        this.setState({
          fullScreen: false,
          contentWidth: MAX_BUTTON_WIDTH * BUTTON_AMOUNT + 'px',
          contentHeight: MAX_BUTTON_WIDTH  + 'px',
        });
      }
    } else if (document.documentElement.clientWidth < MIN_CONTENT_WIDTH) {
      let contentWidth = document.documentElement.clientWidth -
        (CONTENT_MARGIN) * 2;
      if (contentWidth > MAX_HORIZONTAL_CONTENT_WIDTH) {
        contentWidth = MAX_HORIZONTAL_CONTENT_WIDTH;
      }
      this.setState({
        fullScreen: true,
        contentWidth: contentWidth + 'px',
        contentHeight: 'auto',
      });
    } else {
      let contentWidth = document.documentElement.clientWidth -
        (CONTENT_MARGIN + CONTENT_PADDING) * 2;
      this.setState({
        fullScreen: false,
        contentWidth: contentWidth  + 'px',
        contentHeight: contentWidth / BUTTON_AMOUNT  + 'px',
      });
    }
  }
  
  
  flagThis() {
    console.log('Flag this');
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
          fullScreen={false}
          closeButton={false}
        >
          <Menu buttonOption={this.getButtonsOptions.bind(this)()}
                fullScreen={this.state.fullScreen}
                closeFunc={this.closeFunc}
                contentWidth={this.state.contentWidth}
                contentHeight={this.state.contentHeight}/>
        </Modal>
      </div>
    );
  }
  
  getButtonsOptions() {
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
  
}

export default PostContextMenu;
