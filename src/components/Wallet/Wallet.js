import React from 'react';
import {connect} from 'react-redux';
import './wallet.css';
import WidgetToken from './WidgetToken/WidgetToken';
import TransactionHistory from './TransactionHistory/TransactionHistory';
import LoadingSpinner from '../LoadingSpinner';
import {getUserProfile} from '../../actions/userProfile';
import Utils from '../../utils/Utils';
import {openModal} from '../../actions/modal';
import Transfer from '../Modals/Transfer/Transfer';
import ShowIf from '../Common/ShowIf';
import PowerUp from '../Modals/PowerUp/PowerUp';
import PowerDown from '../Modals/PowerDown/PowerDown';
import ChainService from '../../services/ChainService';
import {claimAccountRewards, getAccountsSelectiveData, setToken} from '../../actions/wallet';
import {documentTitle} from '../../utils/documentTitle';
import {addAndStringToLastItem} from '../../utils/addAndStringToLastItem';

const DESCRIPTION = {
	STEEM: `Tradeable tokens that may be transferred anywhere at anytime.
Steem can be converted to STEEM POWER in a process called powering up.`,
	SP: `Influence tokens which give you more control over post payouts 
	and allow you to earn on curation rewards.`,
	SBD: `Tradeable tokens that may be transferred anywhere at anytime.`,
	GOLOS: `Перемещаемые цифровые токены, которые могут переданы куда угодно 
	в любой момент. Голос может быть конвертирован в Силу Голоса, этот процесс 
	называется "увеличение Силы Голоса".`,
	SG: `Сила Голоса неперемещаемая, её количество увеличивается при долгосрочном 
	хранении. Чем больше у Вас Силы Голоса, тем сильней вы влияете на вознаграждения 
	за пост и тем больше зарабатываете за голосование.`,
	GBG: `Перемещаемые цифровые токены, цена которых равна ~1 мг золота в GOLOS.`
};

class Wallet extends React.Component {

	constructor(props) {
		super();
		props.getUserProfile();
		props.getAccountsSelectiveData();
		this.transferSteem = this.transferSteem.bind(this);
		this.powerUp = this.powerUp.bind(this);
		this.powerDown = this.powerDown.bind(this);
		this.claimAccountRewards = this.claimAccountRewards.bind(this);
		documentTitle();
	}

	transfer() {
		let modalOption = {
			body: (<Transfer/>)
		};
		this.props.openModal("transfer", modalOption);
	}

	transferSteem() {
		this.props.setToken(0);
		this.transfer()
	}

	transferSbd() {
		this.props.setToken(1);
		this.transfer()
	}

	powerUp() {
		let modalOption = {
			body: (<PowerUp/>)
		};
		this.props.openModal("powerUp", modalOption);
	}

	powerDown() {
		let modalOption = {
			body: (<PowerDown/>)
		};
		this.props.openModal("powerDown", modalOption);
	}

  claimAccountRewards() {
		this.props.claimAccountRewards(this.props.steem_rewards, this.props.sbd_rewards, this.props.steem_power_rewards);
	}

	renderClaimRewards(sbd_rewards, steem_rewards, steem_power_rewards) {
		if (this.props.mobileScreen) {
			return (
				<div className="centered--flex">
					<div className="mobile-claim-rewards-wrapper_wallet">
						<div className="text-claim-reward_wallet">{/*Current rewards:&nbsp;
							{addAndStringToLastItem([sbd_rewards, steem_rewards, steem_power_rewards])}*/}
							Hello. It's time to claim rewards!</div>
						<button className="button_widget-token" onClick={this.claimAccountRewards}>CLAIM REWARDS NOW</button>
						<div className="gift-boxes_wallet"/>
					</div>
				</div>
			)
		} else {
      return (
				<div className="claim-reward-wrapper_wallet">
					<div className="centered--flex">
						<div className="gift-boxes_wallet"/>
						<div className="text-claim-reward_wallet">{/*Current rewards:&nbsp;
              {addAndStringToLastItem([sbd_rewards, steem_rewards, steem_power_rewards])}*/}
							Hello. It's time to claim rewards!</div>
					</div>
					<button className="button_widget-token" onClick={this.claimAccountRewards}>CLAIM REWARDS NOW</button>
				</div>
      )
		}
	}

	render() {
		const {cost, steem, sp, sbd, isGolosService, sbd_rewards, steem_rewards, steem_power_rewards,
			noRewards} = this.props;
		if (Utils.isEmpty(cost) || Utils.isEmpty(steem) || Utils.isEmpty(sp) || Utils.isEmpty(sbd)) {
			return global.isServerSide ? null : <LoadingSpinner center={true}/>
		}
		return (
			<div className="container">
				<div className="container_wallet">
					<ShowIf show={!noRewards}>
						{this.renderClaimRewards(sbd_rewards, steem_rewards, steem_power_rewards)}
					</ShowIf>
					<div className="header_wallet">
						<div className="title_wallet">
							Account balance
						</div>
						<div className="account-balance_wallet">
							{cost} $
						</div>
					</div>
					<div className="body_wallet">
						<WidgetToken
							background={{
								image: "/images/wallet/steem.png",
								color: 'rgb(74, 144, 226)'
							}}
							fullName={isGolosService ? "ГОЛОС" : "STEEM"}
							point="steem"
							coin={isGolosService ? "GOLOS" : "STEEM"}
							value={steem}
							description={isGolosService ? DESCRIPTION.GOLOS : DESCRIPTION.STEEM}
							actions={isGolosService ?
								[{
									label: 'Transfer',
									icon: '/images/wallet/buttons/transfer.png',
									onClick: this.transferSteem
								}] :
								[{
									label: 'Transfer',
									icon: '/images/wallet/buttons/transfer.png',
									onClick: this.transferSteem
								}, {
									label: 'Power up',
									icon: '/images/wallet/buttons/powerUp.png',
									onClick: this.powerUp
								}]
							}
						/>
						<WidgetToken
							background={{
								image: "/images/wallet/sp.png",
								color: 'rgb(103, 184, 47)'
							}}
							fullName={isGolosService ? "СИЛА ГОЛОСА" : "STEEM POWER"}
							point="sp"
							coin={isGolosService ? "GOLOS" : "STEEM"}
							value={sp}
							description={isGolosService ? DESCRIPTION.SG : DESCRIPTION.SP}
							actions={isGolosService ? [] :
								[{
                  label: 'Power up',
                  icon: '/images/wallet/buttons/powerUp.png',
                  onClick: this.powerUp
                },
								{
									label: 'Power down',
									icon: '/images/wallet/buttons/powerDown.png',
									onClick: this.powerDown
								}]
							}
						/>
						<WidgetToken
							background={{
								image: "/images/wallet/sbd.png",
								color: 'rgb(218, 146, 44)'
							}}
							fullName={isGolosService ? "ЗОЛОТОЙ" : "STEEM DOLLARS"}
							point="sbd"
							coin={isGolosService ? "GBG" : "SBD"}
							value={sbd}
							description={isGolosService ? DESCRIPTION.GBG : DESCRIPTION.SBD}
							textButton="TRANSFER"
							actions={
								[{
									label: 'Transfer',
									icon: '',
									onClick: this.transferSbd.bind(this)
								}]
							}
						/>
					</div>
					<ShowIf show={!isGolosService}>
						<TransactionHistory/>
					</ShowIf>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	if (!state.userProfile.profile) {
		return {}
	}
	const {balance, sbd_balance, total_steem_power_steem, estimated_balance} = state.userProfile.profile;
	const {sbd_rewards, steem_rewards, steem_power_rewards, noRewards} = state.wallet;
	const isGolosService = ChainService.usingGolos();
	return {
    isGolosService,
		cost: estimated_balance,
		steem: balance,
		sp: total_steem_power_steem,
		sbd: sbd_balance,
    sbd_rewards: sbd_rewards ? (sbd_rewards + ' SBD') : '',
    steem_rewards: steem_rewards ? (steem_rewards + ' STEEM') : '',
    steem_power_rewards: steem_power_rewards ? (steem_power_rewards + ' STEEM POWER') : '',
    noRewards,
		mobileScreen: state.window.width <= 650
	}
};

const mapDispatchToProps = dispatch => {
	return {
		getUserProfile: username => {
			dispatch(getUserProfile(username))
		},
		openModal: (index, options) => {
			dispatch(openModal(index, options))
		},
		setToken: token => {
			dispatch(setToken(token))
		},
    getAccountsSelectiveData: () => {
			dispatch(getAccountsSelectiveData())
		},
    claimAccountRewards: (steem_tokens, sbd_tokens, steem_power) => {
			dispatch(claimAccountRewards(steem_tokens, sbd_tokens, steem_power))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
