import React from 'react';
import ShowIf from '../ShowIf';

class Modal extends React.Component {
  static defaultProps = {
    showCloseButton: true,
  };
  
  constructor(props) {
    super(props);
  }
  
  clickOutside(event) {
    event.stopPropagation();
    if (this.refs.modalContainer &&
      !this.refs.modalContainer.contains(event.target)) {
      this.props.closeFunc();
      this.getDynamicStyle = this.getDynamicStyle.bind(this);
    }
  }
  
  getDynamicStyle() {
    let flextAlignSelf = {alignSelf: 'center'};
    if (this.refs.modalContainer && this.refs.wrapper) {
      if (this.refs.modalContainer.clientHeight >
        this.refs.wrapper.clientHeight) {
        flextAlignSelf = {alignSelf: 'flex-start'};
      }
    }
    return flextAlignSelf;
  }
  
  render() {
    let zIndexStyle = {zIndex: 1002};
    return (
      <ShowIf show={this.props.show}>
        <div className="modal-component_mod">
          <ShowIf show={!this.props.fullScreen}>
            <div className="back_mod"
                 onClick={this.clickOutside.bind(this)}
                 style={zIndexStyle}
                 ref={'wrapper'}>
              <ShowIf show={this.props.closeButton}>
                <button className="close_mod"/>
              </ShowIf>
              <div className="container_mod"
                   ref={'modalContainer'}
                   style={this.getDynamicStyle()}>
                {this.props.children}
              </div>
            </div>
          </ShowIf>
          <ShowIf show={this.props.fullScreen}>
            <div className="container-full-screen_mod" style={zIndexStyle}>
              {this.props.children}
            </div>
          </ShowIf>
        </div>
      </ShowIf>
    );
  }
}

export default Modal;
