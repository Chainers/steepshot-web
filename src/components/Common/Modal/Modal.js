import React from 'react';
import ShowIf from '../ShowIf';

class Modal extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      closeParam: this.getCloseParam(),
    };
  }
  
  getCloseParam() {
    return document.documentElement.clientWidth <= 767 ? false : true;
  }
  
  clickOutside(event) {
    event.stopPropagation();
    if (this.modalContainer && !this.modalContainer.contains(event.target)) {
      this.props.setShow(false);
    }
  }
  
  render() {
    const zIndexStyle = {zIndex: 1002};
    return (
      <ShowIf show={this.props.show}>
        <div className="back_mod" onClick={this.clickOutside.bind(this)}
             style={zIndexStyle}>
          <ShowIf show={this.state.closeParam}>
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
