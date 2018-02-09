import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal/Modal';
import {withRouter} from 'react-router-dom';
import {closeAllModals} from '../../actions/modal';

class Modals extends React.Component {

  constructor(props) {
    super(props);

    this.prevDefault = this.prevDefault.bind(this);
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

  componentWillReceiveProps(nextProps) {
    // TODO should be removed after fixed body scroll on ios
    // console.log(!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform));
    // if (Object.keys(this.props.modals).length == 0 && Object.keys(nextProps.modals).length > 0) {
    //   this.props.getBodyParams(window.pageYOffset);
    // }
    if (Object.keys(nextProps.modals).length > 0) {
      document.body.classList.add('no-scroll-iphone');
      //document.body.style.top = -nextProps.bodyParams.offsetTop + 'px';
    } else {
      document.body.classList.remove('no-scroll-iphone');
      //document.body.style.top = '';
      //window.scrollTo(0, nextProps.bodyParams.offsetTop);
    }
  }

  prevDefault(e) {
    e.preventDefault(e);
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Modals));
