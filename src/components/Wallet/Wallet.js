import React from 'react';
import {connect} from "react-redux";
import './wallet.css';
import WidgetToken from "./WidgetToken/WidgetToken";
import TransactionHistory from "./TransactionHistory/TransactionHistory";
import LoadingSpinner from "../LoadingSpinner";
import {getUserProfile} from "../../actions/userProfile";
import Utils from "../../utils/Utils";

const DESCRIPTION = {
	STEEM: `Tradeable tokens that may be transferred anywhere at anytime.
Steem can be converted to STEEM POWER in a process called powering up.`,
	SP: "Influence tokens which give you more control over post payouts and allow you to earn on curation rewards.",
	SBD: "Tradeable tokens that may be transferred anywhere at anytime."
};

class Wallet extends React.Component {

	constructor(props) {
		super();
		props.getUserProfile();
	}

	render() {
		const {cost, steem, sp, sbd} = this.props;
		if (!Utils.isNotEmpty(cost) || !Utils.isNotEmpty(steem) || !Utils.isNotEmpty(sp) || !Utils.isNotEmpty(sbd)) {
			return <LoadingSpinner/>
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
							fullName="STEEM"
							coin="STEEM"
							value={steem}
							description={DESCRIPTION.STEEM}
							actions={
								[{
									label: 'Transfer',
									icon: '',
									onClick: () => {
									}
								}]
							}
						/>
						<WidgetToken
							background={{
								image: "/images/wallet/sp.png",
								color: 'rgb(103, 184, 47)'
							}}
							fullName="STEEM POWER"
							coin="STEEM"
							value={sp}
							description={DESCRIPTION.SP}
							actions={
								[{
									label: 'Power up',
									icon: '',
									onClick: () => {
									}
								}, {
									label: 'Power down',
									icon: '',
									onClick: () => {
									}
								}]
							}
						/>
						<WidgetToken
							background={{
								image: "/images/wallet/sbd.png",
								color: 'rgb(218, 146, 44)'
							}}
							fullName="STEEM DOLLARS"
							coin="SBD"
							value={sbd}
							description={DESCRIPTION.SBD}
							textButton="TRANSFER"
							actions={
								[{
									label: 'Transfer',
									icon: '',
									onClick: () => {
									}
								}]
							}
						/>
					</div>
					<TransactionHistory/>
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
	return {
		cost: estimated_balance,
		steem: balance,
		sp: total_steem_power_steem,
		sbd: sbd_balance
	}
};

const mapDispatchToProps = dispatch => {
	return {
		getUserProfile: username => {
			dispatch(getUserProfile(username))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
