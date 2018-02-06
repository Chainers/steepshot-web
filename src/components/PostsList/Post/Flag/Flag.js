import React from 'react';
import {connect} from 'react-redux';
import ConfirmFlagModal from '../../../PostContextMenu/ConfirmFlagModal/ConfirmFlagModal';
import {toggleFlag} from '../../../../actions/flag';
import {closeModal, openModal} from '../../../../actions/modal';

class Flag extends React.Component {
  constructor(props) {
    super(props);
  }

  toggleFlag() {
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
        <div className="wrap-btn" onClick={this.toggleFlag.bind(this)}>
          <button type="button" className={buttonClasses}/>
        </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state.posts[props.postIndex],
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
