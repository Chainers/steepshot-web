import React from 'react';
import {connect} from "react-redux";
import './wallet.css';
import {getUserProfile} from "../../../actions/userProfile";
import WidgetToken from "./WidgetToken/WidgetToken";
import LoadingSpinner from "../../LoadingSpinner";
import {utils} from '../../../utils/utils';

const DESCRIPTION = {
	COST: "",
	STEEM: "",
	SP: "",
	SBD: ""
};

class Wallet extends React.Component {

	constructor(props) {
		super();
		props.getUserProfile();
	}

	render() {
		const {cost, steem, sp, sbd} = this.props;
		console.log(this.props);
		if (!utils.isNotEmpty(cost) || !utils.isNotEmpty(steem) || !utils.isNotEmpty(sp) || !utils.isNotEmpty(sbd)) {
			return <LoadingSpinner/>
		}
		return (
			<div className="container_wallet">
				<div className="header_wallet">
				</div>
				<div className="body_wallet">
					<WidgetToken icon="" token="Account cost" value={cost} description={DESCRIPTION.COST} />
					<WidgetToken icon="" token="Steem" value={steem} description={DESCRIPTION.STEEM} textButton="Transfer" onClick={() => {}}/>
					<WidgetToken icon="" token="Steem Power" value={sp} description={DESCRIPTION.SP}/>
					<WidgetToken icon="" token="SBD" value={sbd} description={DESCRIPTION.SBD} textButton="Transfer" onClick={() => {}}/>
				</div>
				<div className="transaction-history_wallet">
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
