import React from 'react';
import {connect} from 'react-redux';
import {closeModal, setModalOptions} from '../../../actions/modal';

class Modal extends React.Component {

  constructor(props) {
    super(props);
    this.resizeWindow = this.resizeWindow.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeWindow);
    this.resizeWindow();
    this.container.classList.remove('before-load-back_modal');
    this.body.classList.remove('before-load_modal');
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.willClose) {
      this.body.classList.add('before-load_modal');
      this.container.classList.add('before-load-back_modal');
    }
    if (this.props.alignItems === nextProps.alignItems) {
      this.resizeWindow();
    }
    if (this.props.alignItems !== nextProps.alignItems) {
      return true;
    }
    return false;
  }

  resizeWindow() {
    let alignItems = 'center';
    if (this.body.clientHeight >= this.container.clientHeight) {
      alignItems = 'flex-start';
    }
    if (this.props.alignItems !== alignItems) {
      this.props.setModalOptions(this.props.index, {alignItems: alignItems});
    }
  }

  clickOutside(event) {
    event.stopPropagation();
    if (this.body && !this.body.contains(event.target)) {
      this.props.closeModal(this.props.index);
    }
  }

  render() {
    let styleBack = {
      backgroundColor: 'rgba(0,0,0, 0.7)',
    };
    styleBack.alignItems = this.props.alignItems;
    styleBack.zIndex = 1002;
    return (
      <div className="back_mods before-load-back_modal"
           onClick={this.clickOutside.bind(this)}
           style={styleBack}
           ref={ref => {
             this.container = ref;
           }}
      >
        <div className=" body_modal before-load_modal"
             ref={ref => {
               this.body = ref;
             }}>
          {this.props.body}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state.modals[props.index],
    state: state
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: (index) => {
      dispatch(closeModal(index));
    },
    setModalOptions: (index, options) => {
      dispatch(setModalOptions(index, options))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
