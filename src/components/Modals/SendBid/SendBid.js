import React from 'react';
import {connect} from 'react-redux';
import './sendBid.css';
import {closeModal} from '../../../actions/modal';
import Constants from '../../../common/constants';
import {
	searchingNewBot,
	sendBid,
	setActiveKey,
	setActiveKeyError,
	setActiveKeyInputSecurity,
	setBlockedTimer,
	setRedTimer
} from '../../../actions/promoteModal';
import WalletPopupTemplate from "../WalletPopupTemplate/WalletPopupTemplate";
import BotTimer from "./BotTimer/BotTimer";
import GrayInput from "../../Common/GrayInput/GrayInput";

class SendBid extends React.Component {

	constructor() {
		super();
		this.setActiveKeyValue = this.setActiveKeyValue.bind(this);
		this.sendBid = this.sendBid.bind(this);
		this.tick = this.tick.bind(this);
	}

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
		if (!this.props.activeKey) {
			this.props.setActiveKeyError(Constants.PROMOTE.EMPTY_KEY_INPUT);
			return;
		}
		this.props.sendBid(this.props.steemLink, this.props.activeKey, this.props.botName);
	}

	setActiveKeyValue(e) {
		if (this.props.activeKeyError) {
			this.props.setActiveKeyError('');
		}
		let activeKey = e.target.value.replace(/\s+/g, '');
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
		let botAvatarStyle = {backgroundImage: 'url(' + this.props.botAvatar + ')'};
		return (
			<WalletPopupTemplate title="PROMOTER FOUND!"
			                     username={this.props.botName}
			                     usernameLink={`https://steemit.com/@${this.props.botName}`}
			                     textButton='SEND BID'
			                     cancel={this.props.closeModal}
			                     ok={this.sendBid}>

				<div className="body_send-bid">
					<div className="bot-logo_send-bid" style={botAvatarStyle}/>
					<BotTimer isRead={this.props.redTimer} isBlocked={this.props.blockedTimer}
					          upvoteTime={this.props.upvoteTime} tick={this.tick}/>
				</div>

				<div className="centered--flex">
					<GrayInput type={this.props.showActiveKey ? 'text' : 'password'}
					           placeholder="e.g. STG52aKIcG9..."
					           value={this.props.activeKey}
					           onChange={this.setActiveKeyValue}
					           label="Private active key"
					           error={this.props.activeKeyError}
					/>
					<div className="eye-switcher_promote-mod"
					     onClick={() => this.props.setActiveKeyInputSecurity(this.props.showActiveKey)}
					     style={{
						     backgroundImage: `url(/images/promoteModal/${this.props.showActiveKey ? 'red_eye.svg'
							     : 'striked_eye.svg'})`
					     }}/>
				</div>
				<div className="promise-about-key_send-bid centered--flex">
					Your key is securely used to sign the transfer transaction. It is never sent to any server, including
					Steepshot servers.
				</div>
			</WalletPopupTemplate>
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
			dispatch(closeModal("SendBid"));
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

export default connect(mapStateToProps, mapDispatchToProps)(SendBid);
