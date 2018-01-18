import React from 'react';
import {connect} from 'react-redux';
import {closeModal} from '../../../actions/modal';
import ShowIf from '../../Common/ShowIf';

class Modal extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  clickOutside(event) {
    event.stopPropagation();
    if (this.modalContainer && !this.modalContainer.contains(event.target)) {
      this.props.closeModal(this.props.index);
    }
  }
  
  componentDidUpdate() {
    let alignSelf = 'center';
    if (this.props.show) {
      if (this.modalContainer.clientHeight > this.wrapper.clientHeight) {
        alignSelf = 'flex-start';
      }
    }
    if (this.props.alignSelf !== alignSelf) {
      this.props.setModalOptions(this.props.index, {alignSelf: 'flex-start'});
    }
  }
  
  render() {
    let styleBack = this.props.fullScreen ? {
      backgroundColor: 'rgba(0,0,0, 1)',
      zIndex: 1002,
    } : {
      backgroundColor: 'rgba(0,0,0, 0.7)',
      zIndex: 1002,
    };
    return (
      <div className="modal-wrapper_mods">
        <div className="back_mods"
             onClick={this.clickOutside.bind(this)}
             style={styleBack}
             ref={ref => {this.wrapper = ref;}}
        >
          <ShowIf show={!this.props.fullScreen}>
            <ShowIf show={document.documentElement.clientWidth > 815}>
              <ShowIf show={this.props.closeButton}>
                <button className="close_mods" />
              </ShowIf>
            </ShowIf>
            <div className={this.props.styles}
                 ref={ref => {this.modalContainer = ref;}}
                 style={{alignSelf: this.props.alignSelf}}>
              {this.props.body}
            </div>
          </ShowIf>
          <ShowIf show={this.props.fullScreen}>
            <div className="container-full-screen_mods" style={{zIndex: 1002}}>
              {this.props.body}
            </div>
          </ShowIf>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state.modals[props.index],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: (index) => {
      dispatch(closeModal(index));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
