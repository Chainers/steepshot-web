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
						<WidgetToken backgroundImage="/images/wallet/steem.png" icon="" token="Steem"
						             value={steem} description={DESCRIPTION.STEEM} textButton="TRANSFER" onClick={() => {
						}}/>
						<WidgetToken backgroundImage="/images/wallet/sp.png" icon="" token="Steem Power"
						             value={sp} description={DESCRIPTION.SP}/>
						<WidgetToken backgroundImage="/images/wallet/sbd.png" icon="" token="SBD"
						             value={sbd} description={DESCRIPTION.SBD} textButton="TRANSFER" onClick={() => {
						}}/>
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
