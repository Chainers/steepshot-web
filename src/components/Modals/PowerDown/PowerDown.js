import React from 'react';
import {connect} from "react-redux";
import './powerDown.css';
import WalletPopupTemplate from "../WalletPopupTemplate/WalletPopupTemplate";
import {closeModal} from "../../../actions/modal";
import {changeAmount, powerDown} from "../../../actions/power";
import PowerForm from "../../Common/PowerForm/PowerForm";

class PowerDown extends React.Component {

	render() {
		const {username, balance, amount} = this.props;
		return (
			<WalletPopupTemplate title="POWER DOWN"
			                     username={username}
			                     textButton="POWER DOWN"
			                     cancel={this.props.closePowerUpModal}
			                     ok={this.props.powerDown}>
				<PowerForm amount={amount}
				           amountOnChange={this.props.changeAmount}
				           className="form_power-down"
				           countToken={balance}
				           token="STEEM"
				/>
				<div className="description_power-down">
					You are already powering down 69.692 STEEM (16.083 STEEM paid out so far). Note that if you change the power
					down amount the payout schedule will reset.
				</div>
				<div className="description_power-down">
					Leaving less than 5 STEEM POWER in your account is not recommended and can leave your account in a unusable
					state.
				</div>
			</WalletPopupTemplate>
		);
	}
}

const mapStateToProps = state => {
	const {total_steem_power_steem} = state.userProfile.profile;
	const {amount} = state.power;
	return {
		balance: total_steem_power_steem,
		username: state.auth.user,
		amount
	}
};

const mapDispatchToProps = dispatch => {
	return {
		closePowerUpModal: () => {
			dispatch(closeModal("powerDown"))
		},
		powerDown: () => {
			dispatch(powerDown())
		},
		changeAmount: value => {
			dispatch(changeAmount(value))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(PowerDown);
