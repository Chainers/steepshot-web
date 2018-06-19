import * as React from 'react';
import {connect} from 'react-redux';
import './promoteModal.css';
import {closeModal} from '../../../actions/modal';
import {
  getAuthUserInfo, searchingBotRequest, setPromoteInputError, setPromoteValue, setSelectedIndex,
  setSelectError
} from '../../../actions/promoteModal';
import Constants from '../../../common/constants';
import {loadingEllipsis} from '../../../utils/loadingEllipsis';
import {pushMessage} from '../../../actions/pushMessage';

class PromoteModal extends React.Component {

  componentDidMount() {
    if (!this.props.userInfo) {
      this.props.getAuthUserInfo();
    }
  }

  componentWillUnmount() {
    this.props.setPromoteInputError('');
    this.props.setSelectError('');
  }

  promotePost() {
    if (this.validPromoteInfo()) {
      this.props.searchingBotRequest(this.props.steemLink);
    }
  }

  validPromoteInfo() {
    if (this.props.selectedToken) {
      if (+this.props.tokenNumber < this.props.promoteAmount) {
        this.props.setPromoteInputError(Constants.PROMOTE.NOT_ENOUGH_TOKENS);
        return false;
      }
      if (this.props.promoteAmount < 0.25) {
        this.props.setPromoteInputError(Constants.PROMOTE.MIN_AMOUNT_ERROR);
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
    this.props.setSelectedIndex(e.target.selectedIndex);
  }

  renderOptions() {
    let optionsArr = ['Choose token', 'STEEM', 'SBD'];
    return optionsArr.map( (item, index) => {
      return <option key={index}
                     disabled={index === 0 ? 'disabled' : ''}
                     style={index !== 0 ? {color: '#e74800'} : {}}
                     selected={index === this.props.activeIndex ? 'selected' : ''}>{item}
             </option>
    });
  }

  render() {
    let loadingDataOrError = this.props.selectError;
    if (this.props.infoLoading) {
      loadingDataOrError = loadingEllipsis('Loading data');
    }
    let findText = 'FIND PROMOTER';
    if (this.props.searchingBot) {
      findText = loadingEllipsis('LOOKING');
    }
    return (
      <div className="wrapper_promote-mod">
        <p className="title_promote-mod">PROMOTE POST</p>
        <p className="label_promote-mod">Using token</p>
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
        <p className="label_promote-mod">Promotion bid (not less than 0.25)</p>
        <div className="position--relative">
          <input ref={ref => this.input = ref}
                 placeholder="e.g. 100"
                 className="input_promote-mod"
                 value={this.props.promoteAmount}
                 onChange={this.setPromoteValue.bind(this)}/>
          <div className="error_promote-mod">{this.props.inputError}</div>
        </div>
        <div className="buttons_promote-mod">
          <button className="btn btn-index" onClick={() => this.props.closeModal()}>CANCEL</button>
          <button className="btn btn-default" onClick={this.promotePost.bind(this)}>{findText}</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const steemLink = `https://steemit.com${props.postIndex}`;
  let promoteModal = state.promoteModal;
  let tokenNumber = '';
  if (promoteModal.selectedToken === 'STEEM') {
    tokenNumber = promoteModal.userInfo.followers_count;
  }
  if (promoteModal.selectedToken === 'SBD') {
    tokenNumber = promoteModal.userInfo.following_count;
  }
  return {
    steemLink,
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
    searchingBotRequest: (steemLink) => {
      dispatch(searchingBotRequest(steemLink));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(PromoteModal);
