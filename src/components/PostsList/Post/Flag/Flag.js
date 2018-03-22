import React from 'react';
import {connect} from 'react-redux';
import ConfirmFlagModal from '../../../PostContextMenu/ConfirmFlagModal/ConfirmFlagModal';
import Constants from '../../../../common/constants';
import {toggleFlag} from '../../../../actions/flag';
import {closeModal, openModal} from '../../../../actions/modal';
import jqApp from "../../../../libs/app.min";

class Flag extends React.Component {

  toggleFlag() {
    if (!this.props.isUserAuth) {
      jqApp.pushMessage.open(Constants.VOTE_ACTION_WHEN_NOT_AUTH);
      return;
    }
    if (this.props.commentLoader) {
      jqApp.pushMessage.open(Constants.WAIT_FINISHING_TRANSACTION);
      return;
    }
    if (!this.props.flag) {
      let modalOption = {
        body: (<ConfirmFlagModal closeModal={() => {this.props.closeModal("ConfirmFlagModal")}}
                                 flagCallback={this.flagCallback.bind(this)}
        />),
      };
      this.props.openModal("ConfirmFlagModal", modalOption);
    } else {
      this.props.toggleFlag(this.props.postIndex);
    }
  }

  flagCallback(param) {
    if(param) {
      this.props.closeModal("ConfirmFlagModal");
      this.props.toggleFlag(this.props.postIndex);
    } else {
      this.props.closeModal("ConfirmFlagModal");
    }
  }

  render() {
    let buttonClasses = "btn-flag";
    if (this.props.flag) {
      buttonClasses = buttonClasses + " marked";
    }
    if (this.props.flagLoading) {
      buttonClasses = buttonClasses + " loading";
    }
    return (
      <div className="position--relative" onClick={this.toggleFlag.bind(this)}>
        <button type="button" className={buttonClasses}/>
        <div className="card-control-stop"/>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state.posts[props.postIndex],
    isUserAuth: !!state.auth.user && !!state.auth.postingKey
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openModal: (index, options) => {
      dispatch(openModal(index, options));
    },
    closeModal: (index) => {
      dispatch(closeModal(index));
    },
    toggleFlag: (postIndex) => {
      dispatch(toggleFlag(postIndex));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Flag);
