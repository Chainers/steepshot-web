import React from 'react';
import ShowIf from '../ShowIf';
import Constants from '../../../common/constants';

class Modal extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      smallScreen: this.isSmall(),
    };
    this.resizeWindow = this.resizeWindow.bind(this);
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.resizeWindow);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow);
  }
  
  resizeWindow() {
    if (!this.props.show) {
      return;
    }
    
    this.setState({
      smallScreen: this.isSmall(),
    });
  }
  
  clickOutside(event) {
    event.stopPropagation();
    if (this.modalContainer && !this.modalContainer.contains(event.target)) {
      this.props.setShow(false);
    }
  }
  
  isSmall() {
    return document.documentElement.clientWidth <
      Constants.SCREEN.SMALL_SCREEN_WIDTH
  }
  
  render() {
    const zIndexStyle = {zIndex: 1002};
    return (
      <ShowIf show={this.props.show}>
        <div className="back_mod" onClick={this.clickOutside.bind(this)}
             style={zIndexStyle}>
          <ShowIf show={!this.state.smallScreen}>
            <button className="close_mod"></button>
          </ShowIf>
          <div className="container_mod"
               ref={(modalContainer) => { this.modalContainer = modalContainer; }}>
            {this.props.children}
          </div>
        </div>
      </ShowIf>
    );
  }
}

export default Modal;
