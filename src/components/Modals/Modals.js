import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal/Modal';
import {withRouter} from 'react-router-dom';
import {closeAllModals} from '../../actions/modal';
import {getBodyParams} from '../../actions/bodyParams';

class Modals extends React.Component {

  constructor(props) {
    super(props);

  }

  componentWillMount() {
    const {history} = this.props;
    this.unsubscribeFromHistory = history.listen(this.handleLocationChange.bind(this));
    this.handleLocationChange();
  }

  componentWillUnmount() {
    if (this.unsubscribeFromHistory) this.unsubscribeFromHistory();
  }

  handleLocationChange() {
    if (Object.keys(this.props.modals).length > 0) {
      this.props.closeAllModals();
    }
  };

  checkOpSystem(nextProps) {
    if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
      if (Object.keys(this.props.modals).length === 0 && Object.keys(nextProps.modals).length > 0) {
        this.props.getBodyParams(window.pageYOffset);
      }
      if (Object.keys(nextProps.modals).length > 0) {
        document.body.classList.add('no-scroll-iphone');
        document.body.style.top = -nextProps.bodyParams.offsetTop + 'px';
      } else {
        document.body.classList.remove('no-scroll-iphone');
        document.body.style.top = '';
        window.scrollTo(0, nextProps.bodyParams.offsetTop);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.checkOpSystem(nextProps);
    if (Object.keys(nextProps.modals).length > 0) {
      document.body.classList.add('overflow--hidden');
    } else {
      document.body.classList.remove('overflow--hidden');
    }
  }

  render() {
    let modals = [];
    for (let key in this.props.modals) {
      modals.push(<Modal key={key} index={key}/>);
    }
    return (
      <div className="modals-component_mod">
        {modals}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modals: state.modals,
    bodyParams: state.bodyParams
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeAllModals: () => {
      dispatch(closeAllModals());
    },
    getBodyParams: (offsetTop) => {
      dispatch(getBodyParams(offsetTop));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Modals));
