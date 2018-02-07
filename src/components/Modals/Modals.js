import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal/Modal';
import {withRouter} from 'react-router-dom';
import {closeAllModals} from '../../actions/modal';

class Modals extends React.Component {

  constructor(props) {
    super(props);

    this.prevDefault = this.prevDefault.bind(this);
    this.removeFocus = this.removeFocus.bind(this);
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
    if (Object.keys(nextProps.modals).length > 0) {
      document.body.classList.add('no-scroll-iphone');
      document.body.addEventListener('focus', this.removeFocus());
    } else {
      document.body.classList.remove('no-scroll-iphone');
      document.body.removeEventListener('focus', this.removeFocus());
    }
  }

  removeFocus() {
    document.body.blur();
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeAllModals: () => {
      dispatch(closeAllModals());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Modals));
