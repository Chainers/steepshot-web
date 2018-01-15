import React from 'react';
import ShowIf from '../ShowIf';

class Modal extends React.Component {
  static defaultProps = {
    showCloseButton: true,
  };
  
  constructor(props) {
    super(props);
    this.state = {
      alignSelf: 'center',
    }
  }
  
  clickOutside(event) {
    event.stopPropagation();
    if (this.refs.modalContainer &&
      !this.refs.modalContainer.contains(event.target)) {
      this.props.closeFunc();
    }
  }
  
  componentDidUpdate() {
    let alignSelf = 'center';
    if (this.props.show) {
      if (this.refs.modalContainer.clientHeight >
        this.refs.wrapper.clientHeight) {
        alignSelf = 'flex-start';
      }
    }
    if (this.state.alignSelf != alignSelf) {
      this.setState({
        alignSelf: alignSelf,
      })
    }
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
                   style={{alignSelf: this.state.alignSelf}}>
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
