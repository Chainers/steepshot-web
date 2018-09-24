import React from 'react';
import {connect} from 'react-redux';
import './powerDown.css';
import WalletPopupTemplate from '../WalletPopupTemplate/WalletPopupTemplate';
import {closeModal} from '../../../actions/modal';
import PowerForm from '../../Common/PowerForm/PowerForm';
import {changeAmount, powerDown, isValidAmountTokens} from '../../../actions/wallet';
import InOutSteem from '../WalletPopupTemplate/InOutSteem/InOutSteem';
import Constants from '../../../common/constants';

class PowerDown extends React.Component {

	constructor() {
		super();
		this.startPowerDown = this.startPowerDown.bind(this);
	}

	startPowerDown() {
    this.props.isValidAmountTokens(this.props.amount, this.props.balance, this.props.powerDown);
	}

	render() {
		const {username, balance, amount, amountError, delegated, received} = this.props;
		return (
			<WalletPopupTemplate title="CONVERT TO STEEM"
			                     username={username}
			                     textButton="POWER DOWN"
			                     cancel={this.props.closePowerUpModal}
			                     ok={this.props.powerDown}>
				<InOutSteem point="power-down"/>
				<PowerForm amount={amount}
				           amountError={amountError}
				           amountOnChange={this.props.changeAmount}
				           className="form_power-down"
									 tokensAmount={balance}
				           token="STEEM"
									 delegated={delegated}
									 received={received}
				/>
				<div className="description_power-down">
					Note that if you change the power down amount the payout schedule will reset.
				</div>
				<div className="description_power-down margin-bottom-25">
					Leaving less than {Constants.TRANSFER.MIN_LEAVE_STEEM_POWER} STEEM POWER in your account is not recommended and can leave your account in a unusable
					state.
				</div>
			</WalletPopupTemplate>
		);
	}
}

const mapStateToProps = state => {
	const {total_steem_power_steem} = state.userProfile.profile;
	const {amount, amountError, sp_received_by_delegation, sp_delegated_to_someone} = state.wallet;
	return {
		balance: total_steem_power_steem,
		username: state.auth.user,
		delegated: sp_delegated_to_someone,
		received: sp_received_by_delegation,
		amount,
		amountError
	}
};

const mapDispatchToProps = dispatch => {
	return {
		closePowerUpModal: () => {
			dispatch(closeModal("PowerDown"))
		},
		powerDown: () => {
			dispatch(powerDown())
		},
		changeAmount: value => {
			dispatch(changeAmount(value))
		},
    isValidAmountTokens: (tokensAmount, balance, transactionAction) => {
			dispatch(isValidAmountTokens(tokensAmount, balance, transactionAction))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(PowerDown);
