import React from 'react';
import {connect} from 'react-redux';
import './sendBid.css';
import {closeModal} from '../../../actions/modal';
import Constants from '../../../common/constants';
import {
	searchingNewBot,
	sendBid,
	setBlockedTimer,
	setRedTimer
} from '../../../actions/promoteModal';
import WalletPopupTemplate from '../WalletPopupTemplate/WalletPopupTemplate';
import BotTimer from './BotTimer/BotTimer';
import {setActiveKeyInputSecurity} from '../../../actions/activeKey';
import InputActiveKey from '../../Common/InputActiveKey/InputActiveKey';
import ImageWithProxy from '../../Common/ImageWithProxy';

class SendBid extends React.Component {

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
		return (
			<WalletPopupTemplate title="PROMOTER FOUND!"
			                     username={this.props.botName}
			                     usernameLink={`https://steemit.com/@${this.props.botName}`}
			                     textButton='SEND BID'
			                     cancel={this.props.closeModal}
			                     ok={this.props.sendBid}>
				<div className="body_send-bid">
					<ImageWithProxy src={this.props.botAvatarSrc} size={100} className="bot-logo_send-bid"/>
					<BotTimer isRead={this.props.redTimer} isBlocked={this.props.blockedTimer}
					          upvoteTime={this.props.upvoteTime} tick={this.tick}/>
				</div>
				<InputActiveKey className="active-key_transfer"/>
			</WalletPopupTemplate>
		);
	}
}

const mapStateToProps = (state) => {
	const {activeKey, redTimer, blockedTimer, suitableBot} = state.promoteModal;
	let sizes = Constants.USER_PROFILE_AVATAR_SIZE;
	return {
    sizes,
		activeKey,
		redTimer,
		blockedTimer,
    botAvatarSrc: suitableBot.avatar,
		upvoteTime: suitableBot.next,
		botName: suitableBot.name
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		closeModal: () => {
			dispatch(closeModal("SendBid"));
		},
		sendBid: () => {
			dispatch(sendBid());
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
