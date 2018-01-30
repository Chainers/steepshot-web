import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal/Modal';
import {withRouter} from 'react-router-dom';
import {closeAllModals} from '../../actions/modal';

class Modals extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {history} = this.props;
    console.log(history);
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
