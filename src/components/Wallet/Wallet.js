import React from 'react';
import {connect} from "react-redux";
import './wallet.css';
import WidgetToken from "./WidgetToken/WidgetToken";
import TransactionHistory from "./TransactionHistory/TransactionHistory";
import LoadingSpinner from "../LoadingSpinner";
import {getUserProfile} from "../../actions/userProfile";
import Utils from "../../utils/Utils";
import {openModal} from "../../actions/modal";
import Transfer from "../Modals/Transfer/Transfer";
import {setToken} from "../../actions/transfer";
import Constants from "../../common/constants";
import ShowIf from "../Common/ShowIf";
import PowerUp from "../Modals/PowerUp/PowerUp";
import PowerDown from "../Modals/PowerDown/PowerDown";

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
	}

	transfer() {
		let modalOption = {
			body: (<Transfer/>)
		};
		this.props.openModal("transfer", modalOption);
	}

	transferSteem() {
		this.props.setToken('STEEM');
		this.transfer()
	}

	transferSbd() {
		this.props.setToken('SBD');
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

	render() {
		const {cost, steem, sp, sbd, isGolosService} = this.props;
		if (Utils.isEmpty(cost) || Utils.isEmpty(steem) || Utils.isEmpty(sp) || Utils.isEmpty(sbd)) {
			return <LoadingSpinner style={{display: '20px'}} center={true}/>
		}
		return (
			<div className="container">
				<div className="container_wallet">
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
							actions={
								[{
									label: 'Transfer',
									icon: '',
									onClick: this.transferSteem.bind(this)
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
							actions={
								[{
									label: 'Power up',
									icon: '/images/wallet/buttons/powerUp.png',
									onClick: this.powerUp.bind(this)
								}, {
									label: 'Power down',
									icon: '/images/wallet/buttons/powerDown.png',
									onClick: this.powerDown.bind(this)
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
	const golosName = Constants.SERVICES.golos.name;
	const isGolosService = state.services.name === golosName;
	return {
		cost: estimated_balance,
		steem: balance,
		sp: total_steem_power_steem,
		sbd: sbd_balance,
		isGolosService
	}
};

const mapDispatchToProps = dispatch => {
	return {
		getUserProfile: username => {
			dispatch(getUserProfile(username))
		},
		openModal: (index, options) => {
			dispatch(openModal(index, options));
		},
		setToken: token => {
			dispatch(setToken(token))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
