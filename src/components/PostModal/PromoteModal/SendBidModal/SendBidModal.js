import * as React from 'react';
import {connect} from 'react-redux';
import './sendBidModal.css';
import {closeModal} from '../../../../actions/modal';
import Timer from '../../../Common/Timer/Timer';
import Constants from '../../../../common/constants';
import {pushMessage} from '../../../../actions/pushMessage';
import {
  setActiveKey, searchingNewBot, sendBid, setActiveKeyError, setActiveKeyInputSecurity, setBlockedTimer, setRedTimer
} from '../../../../actions/promoteModal';
import {loadingEllipsis} from '../../../../utils/loadingEllipsis';
import ShowIf from '../../../Common/ShowIf';
import storage from '../../../../utils/Storage';

class SendBidModal extends React.Component {

  componentDidMount() {
    this.bidTimer = setTimeout(() => {
      this.props.searchingNewBot();
    }, Constants.SERVICES.BOTS.BOT_UPDATE_TIME * Constants.MILLISECONDS_IN_SECOND);
  }

  componentWillUnmount() {
    this.props.setRedTimer(false);
    this.props.setBlockedTimer(false);
    clearTimeout(this.bidTimer);
    clearTimeout(this.updatableBidTimer);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.blockedTimer && !nextProps.blockedTimer) {
      this.updatableBidTimer = setTimeout(() => {
        this.props.searchingNewBot();
      }, Constants.SERVICES.BOTS.BOT_UPDATE_TIME * Constants.MILLISECONDS_IN_SECOND);
    }
  }

  sendBid() {
    if (this.input) {
      if (!this.props.activeKey) {
        this.props.setActiveKeyError(Constants.PROMOTE.EMPTY_KEY_INPUT);
        return;
      }
      this.props.sendBid(this.props.steemLink, this.props.activeKey, this.props.botName);
    } else {
      this.props.sendBid(this.props.steemLink, storage.activeKey, this.props.botName);
    }
  }

  setActiveKeyValue() {
    if (this.props.activeKeyError) {
      this.props.setActiveKeyError('');
    }
    let activeKey = this.input.value.replace(/\s+/g, '');
    this.props.setActiveKey(activeKey);
  }

  tick(time) {
    let leftTime = time.toFixed(0) / 1;
    if (leftTime === Constants.PROMOTE.RED_TIMER) {
      this.props.setRedTimer(true);
    }
    if (leftTime === Constants.PROMOTE.BLOCKED_TIMER) {
      this.props.setBlockedTimer(true);
    }
  }

  render() {
    let redTimer = '', blockedTimer = '';
    let sendBid = 'SEND BID';
    if (this.props.sendingBid) {
      sendBid = loadingEllipsis('SENDING');
    }
    if (this.props.redTimer) {
      redTimer = ' red-timer_send-bid-mod';
    }
    let timerBlock = <div className="timer-wrapper_send-bid-mod centered--flex">
                       <div className="label_send-bid-mod">Expected upvote time&nbsp;</div>
                       <div className={'timer_send-bid-mod' + redTimer}>
                         <Timer waitingTime={this.props.upvoteTime}
                                staticTimer={true}
                                onTick={this.tick.bind(this)}/>
                       </div>
                     </div>;
    if (this.props.blockedTimer) {
      blockedTimer = ' blocked-timer_send-bid-mod';
      timerBlock = <div className="timer-wrapper_send-bid-mod centered--flex">
                     <div className="load-instead-timer_send-bid-mod">{loadingEllipsis('Checking bot\'s info')}</div>
                   </div>
    }
    let botAvatarStyle = {backgroundImage: 'url(' + this.props.botAvatar + ')'};
    return (
      <div className="wrapper_promote-mod">
        <p className="title_send-bid-mod">
          <span>PROMOTER FOUND!</span>
          <a href={`https://steemit.com/@${this.props.botName}`} target="_blank">@{this.props.botName.toUpperCase()}</a>
        </p>
        <div className="body_send-bid-mod">
          <div className="bot-logo_send-bid-mod" style={botAvatarStyle}/>
          {timerBlock}
        </div>
        <ShowIf show={!storage.activeKey}>
          <div className="position--relative">
            <p className="label_promote-mod">Private active key</p>
            <div className="centered--flex">
              <input type={this.props.showActiveKey ? 'text' : 'password'}
                     placeholder="e.g. STG52aKIcG9..."
                     value={this.props.activeKey}
                     className="input_promote-mod"
                     ref={ref => this.input = ref}
                     onChange={this.setActiveKeyValue.bind(this)}/>
              <div className="eye-switcher_promote-mod"
                   onClick={() => this.props.setActiveKeyInputSecurity(this.props.showActiveKey)}
                   style={{backgroundImage: `url(/images/promoteModal/${this.props.showActiveKey ? 'red_eye.svg'
                     : 'striked_eye.svg'})`}}/>
            </div>
            <div className="error_promote-mod">{this.props.activeKeyError}</div>
          </div>
          <div className="promise-about-key_promote-mod centered--flex">
            We store your key in the browser. We never send it to the server.
          </div>
        </ShowIf>
        <div className="buttons_promote-mod">
          <button className="btn btn-index" onClick={() => this.props.closeModal()}>CANCEL</button>
          <button className={'btn btn-default' + blockedTimer}
                  onClick={this.sendBid.bind(this)}>{sendBid}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const promoteModal = state.promoteModal;
  const suitableBot = promoteModal.suitableBot;
  const steemLink = `https://steemit.com${promoteModal.postIndex}`;
  return {
    ...state.promoteModal,
    steemLink,
    upvoteTime: suitableBot.next,
    botName: suitableBot.name,
    botAvatar: suitableBot.avatar
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => {
      dispatch(closeModal("SendBidModal"));
    },
    pushMessage: (message) => {
      dispatch(pushMessage(message));
    },
    setActiveKeyError: (error) => {
      dispatch(setActiveKeyError(error));
    },
    sendBid: (steemLink, activeKey, botName) => {
      dispatch(sendBid(steemLink, activeKey, botName));
    },
    setActiveKey: (activeKey) => {
      dispatch(setActiveKey(activeKey));
    },
    searchingNewBot: () => {
      dispatch(searchingNewBot());
    },
    setRedTimer: (param) => {
      dispatch(setRedTimer(param));
    },
    setBlockedTimer: (param) => {
      dispatch(setBlockedTimer(param));
    },
    setActiveKeyInputSecurity: (state) => {
      dispatch(setActiveKeyInputSecurity(state));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SendBidModal);
