import React from 'react';
import {connect} from 'react-redux';
import './promoteModal.css';
import {closeModal} from '../../../actions/modal';
import {
  addPostIndex, getAuthUserInfo, getAuthUserInfoError, getAuthUserInfoSuccess, searchingBotRequest, setPromoteValue,
  setPromoteInputError, setSelectedIndex, setSelectError, setNoTokensForPomote
} from '../../../actions/promoteModal';
import Constants from '../../../common/constants';
import {loadingEllipsis} from '../../../utils/loadingEllipsis';
import {pushMessage} from '../../../actions/pushMessage';

class PromoteModal extends React.Component {

  constructor(props) {
    super(props);
    this.promoteByEnter = this.promoteByEnter.bind(this);
  }

  componentDidMount() {
    if (!this.props.userInfo || !Object.keys(this.props.userInfo).length) {
      this.props.getAuthUserInfo();
    }
    this.props.addPostIndex(this.props.index);
    this.input.addEventListener('keypress', this.promoteByEnter);
  }

  componentWillUnmount() {
    this.clearPromoteModalInfo();
    this.input.removeEventListener('keypress', this.promoteByEnter);
    this.props.getAuthUserInfoError('');
  }

  clearPromoteModalInfo() {
    this.props.setPromoteInputError('');
    this.props.setSelectError('');
    this.props.getAuthUserInfoSuccess({});
    this.props.setNoTokensForPomote(false);
  }

  promoteByEnter(e) {
    if (e.keyCode === 13) {
      this.promotePost();
    }
  }

  promotePost() {
    if (!this.props.searchingBot && !this.props.infoLoading && this.validPromoteInfo()) {
      this.props.searchingBotRequest();
    }
  }

  validPromoteInfo() {
    if (this.props.selectedToken) {
      if (+this.props.tokenNumber < this.props.promoteAmount) {
        this.props.setPromoteInputError(Constants.PROMOTE.NOT_ENOUGH_TOKENS);
        return false;
      }
      if (this.props.promoteAmount < Constants.SERVICES.BOTS.MIN_BID_VALUE) {
        this.props.setPromoteInputError(Constants.PROMOTE.MIN_AMOUNT_ERROR);
        return false;
      }
      if (this.props.promoteAmount > Constants.SERVICES.BOTS.MAX_BID_VALUE) {
        this.props.setPromoteInputError(Constants.PROMOTE.MAX_AMOUNT_ERROR);
        return false;
      }
      let amount = this.props.promoteAmount.toString();
      amount = amount.trim();
      amount = amount.match(/\d+(\.\d+)?/);
      if (amount[0] === amount.input) return true;
      this.props.setPromoteInputError(Constants.PROMOTE.INPUT_ERROR);
    }
    if (!this.props.infoLoading) {
      this.props.setSelectError(Constants.PROMOTE.SELECT_ERROR);
    }
    return false;
  }

  setPromoteValue() {
    if (this.props.inputError) {
      this.props.setPromoteInputError('');
    }
    let value = this.input.value;
    let checkedValue = value.replace(/[^\d.]+/g, '');
    this.props.setPromoteValue(checkedValue);
  }

  setSelectedValue(e) {
    if (this.props.selectError) {
      this.props.setSelectError('');
    }
    if (this.props.inputError) {
      this.props.setPromoteInputError('');
    }
    this.props.setSelectedIndex(e.target.selectedIndex);
  }

  renderOptions() {
    let optionsArr = ['STEEM', 'SBD'];
    return optionsArr.map( (item, index) => {
      return <option key={index}
                     selected={index === this.props.activeIndex ? 'selected' : ''}>{item}
             </option>
    });
  }

  render() {
    let loadingDataOrError = this.props.selectError;
    let closeText = 'CANCEL', noTokensBlock = null;
    if (this.props.infoLoading) {
      loadingDataOrError = this.props.userInfoErrorStatus ? this.props.userInfoErrorStatus : loadingEllipsis('Loading data');
    }
    let findText = 'FIND PROMOTER';
    if (this.props.searchingBot) {
      findText = loadingEllipsis('LOOKING');
    }
    let findBotButton = <button className="btn btn-default" onClick={this.promotePost.bind(this)}>{findText}</button>;
    if (this.props.noTokensForPromote) {
      closeText = 'OK';
      noTokensBlock = <div className="no-tokens_promote-mod centered--flex">
                        There's not enough tokens for promote in your wallet.
                      </div>;
      findBotButton = null;
    }
    return (
      <div className="wrapper_promote-mod">
        <p className="title_promote-mod">PROMOTE POST</p>
        {noTokensBlock}
        <p className="label_promote-mod">Token</p>
        <div className="body_promote-mod">
          <div className="select-wrapper_promote-mod">
            <select className="select_promote-mod"
                    onChange={this.setSelectedValue.bind(this)}
                    style={this.props.selectedToken ? {color: '#e74800'} : this.props.infoLoading
                      ? {} : {cursor: 'pointer'}}
                    disabled={this.props.infoLoading ? 'disabled' : ''}>
              {this.renderOptions()}
            </select>
            <div className="error_promote-mod"
                 style={this.props.infoLoading ? {color: '#979b9e', bottom: -23} : {bottom: -23}}>{loadingDataOrError}
            </div>
          </div>
          <div className="balance_promote-mod">
            <span>Balance</span>
            <span className="balance-value_promote-mod">{this.props.tokenNumber} {this.props.selectedToken}</span>
          </div>
        </div>
        <p className="label_promote-mod">Promotion amount (minimum {Constants.SERVICES.BOTS.MIN_BID_VALUE})</p>
        <div className="position--relative">
          <input ref={ref => this.input = ref}
                 placeholder="e.g. 100"
                 className="input_promote-mod"
                 value={this.props.promoteAmount}
                 onChange={this.setPromoteValue.bind(this)}/>
          <div className="error_promote-mod">{this.props.inputError}</div>
        </div>
        <div className="buttons_promote-mod">
          <button className="btn btn-index"
                  style={{marginRight: this.props.noTokensForPromote ? 10 : 20}}
                  onClick={() => this.props.closeModal()}>{closeText}</button>
          {findBotButton}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let promoteModal = state.promoteModal;
  let tokenNumber = '';
  if (promoteModal.userInfo) {
    if (promoteModal.selectedToken === 'STEEM') {
      tokenNumber = promoteModal.userInfo.steem_balance;
    }
    if (promoteModal.selectedToken === 'SBD') {
      tokenNumber = promoteModal.userInfo.sbd_balance;
    }
  }
  return {
    ...promoteModal,
    tokenNumber
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => {
      dispatch(closeModal("PromoteModal"));
    },
    setPromoteValue: (value) => {
      dispatch(setPromoteValue(value));
    },
    setSelectedIndex: (index) => {
      dispatch(setSelectedIndex(index));
    },
    getAuthUserInfo: () => {
      dispatch(getAuthUserInfo());
    },
    setPromoteInputError: (error) => {
      dispatch(setPromoteInputError(error));
    },
    setSelectError: (error) => {
      dispatch(setSelectError(error));
    },
    pushMessage: (message) => {
      dispatch(pushMessage(message));
    },
    searchingBotRequest: () => {
      dispatch(searchingBotRequest());
    },
    getAuthUserInfoSuccess: (result) => {
      dispatch(getAuthUserInfoSuccess(result));
    },
    addPostIndex: (postIndex) => {
      dispatch(addPostIndex(postIndex));
    },
    getAuthUserInfoError: (error) => {
      dispatch(getAuthUserInfoError(error));
    },
    setNoTokensForPomote: (param) => {
      dispatch(setNoTokensForPomote(param));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(PromoteModal);
