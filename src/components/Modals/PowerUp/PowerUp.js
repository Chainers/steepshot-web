import React from 'react';
import {connect} from "react-redux";
import './powerUp.css';
import WalletPopupTemplate from "../WalletPopupTemplate/WalletPopupTemplate";
import {closeModal} from "../../../actions/modal";
import PowerForm from "../../Common/PowerForm/PowerForm";
import {changeAmount, powerUp} from "../../../actions/wallet";

class PowerUp extends React.Component {

	render() {
		const {username, balance, amount, amountError} = this.props;
		return (
			<WalletPopupTemplate title="CONVERT TO STEEM POWER"
			                     username={username}
			                     textButton="POWER UP"
			                     cancel={this.props.closePowerUpModal}
			                     ok={this.props.powerUp}>
				<div className="description_power-up">
					Tokens give you the ability to influence the reward for content, as well as the ability to earn content from
					content.
				</div>
				<div className="description_power-up">
					STEEM POWER - non-liquid tokens, it takes three months (13 weekly payments) to convert them into Steem's
					liquid tokens.
				</div>
				<PowerForm amount={amount}
				           amountError={amountError}
				           amountOnChange={this.props.changeAmount}
				           className="form_power-up"
				           countToken={balance}
				           token="STEEM"
				/>
			</WalletPopupTemplate>
		);
	}
}

const mapStateToProps = state => {
	const {balance} = state.userProfile.profile;
	const {amount, amountError} = state.wallet;
	return {
		username: state.auth.user,
		balance,
		amount,
		amountError
	}
};

const mapDispatchToProps = dispatch => {
	return {
		closePowerUpModal: () => {
			dispatch(closeModal("powerUp"))
		},
		powerUp: () => {
			dispatch(powerUp())
		},
		changeAmount: value => {
			dispatch(changeAmount(value))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(PowerUp);
