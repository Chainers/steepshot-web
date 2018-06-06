import * as React from 'react';
import {connect} from 'react-redux';
import {closeModal} from '../../../actions/modal';
import CloseButton from '../../Common/CloseButton/CloseButton';
import './chooseSteemRegModal.css';

class ChooseSteemRegModal extends React.Component {

  render() {
    return (
      <div className="wrapper_choose-steem-reg-mod">
        <div className="header_choose-steem-reg-mod">
          <p className="title_choose-steem-reg-mod">Choose a way to create Steem account.</p>
          <CloseButton className="close-button_choose-steem-reg-mod" onClick={this.props.closeModal}/>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => {
      dispatch(closeModal("ChooseSteemRegModal"));
    }
  }
};

export default connect(() => {return {}}, mapDispatchToProps)(ChooseSteemRegModal);
