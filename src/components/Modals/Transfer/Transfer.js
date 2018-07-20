import React from 'react';
import {connect} from 'react-redux';
import './transfer.css';
import ChooseToken from '../../Common/ChooseToken/ChooseToken';
import {changeMemo, changeUsername, showMemo, transfer} from '../../../actions/transfer';
import ShowIf from "../../Common/ShowIf";
import {closeModal} from "../../../actions/modal";
import WalletPopupTemplate from "../WalletPopupTemplate/WalletPopupTemplate";
import InputActiveKey from "../../Common/InputActiveKey/InputActiveKey";
import GrayInput from "../../Common/GrayInput/GrayInput";
import {changeAmount, setToken} from "../../../actions/wallet";

class Transfer extends React.Component {

	constructor() {
		super();
		this.amountFocused = this.amountFocused.bind(this);
		this.changeUsername = this.changeUsername.bind(this);
		this.changeToken = this.changeToken.bind(this);
		this.setAllAmount = this.setAllAmount.bind(this);
		this.changeMemo = this.changeMemo.bind(this);
		this.changeAmount = this.changeAmount.bind(this);
		this.setAmountRef = this.setAmountRef.bind(this);
	}

	changeToken(e) {
		this.props.setToken(e.target.value);
	}

	changeUsername(e) {
		this.props.changeUsername(e.target.value);
	}

	changeAmount(e) {
		this.props.changeAmount(e.target.value);
	}

	changeMemo(e) {
		this.props.changeMemo(e.target.value);
	}

	setAmountRef(ref) {
		this.amount = ref;
	}

	amountFocused() {
		this.amount.select();
	}

	setAllAmount() {
		this.props.changeAmount(this.props.balance);
	}

	render() {
		const {username, selectedToken, balance, memoOpened, to, toError, amount, amountError, memo, tokensNames} = this.props;
		return (
			<WalletPopupTemplate title="TRANSFER TO ACCOUNT"
			                     username={username}
			                     textButton="SEND"
			                     cancel={this.props.closeTransferModal}
			                     ok={this.props.transfer}>
				<form className="body_transfer" autoComplete="off">
					<div className="form-line_transfer">
						<p className="label_transfer">
							To
						</p>
						<div className="field_transfer">
							<div className="at_transfer"/>
							<input type='text' placeholder="username" onChange={this.changeUsername} maxLength={16} value={to} autoComplete="off"/>
						</div>
						<label className="recipient-error_transfer">{toError}</label>
					</div>
					<div className="form-line_transfer" >
						<ChooseToken selectedToken={selectedToken}
						             amount={balance}
						             onChange={this.changeToken}
						             balanceOnClick={this.setAllAmount}
						             tokensNames={tokensNames}
						/>
					</div>
					<GrayInput label="Amount" className="gray_transfer" onChange={this.changeAmount} value={amount}
					           ref={this.setAmountRef} onFocus={this.amountFocused} error={amountError} maxLength={15}/>
					<ShowIf show={!memoOpened}>
						<div className="add-memo_transfer">
							<span onClick={this.props.showMemo}>
								+ Add memo
							</span>
						</div>
					</ShowIf>
					<ShowIf show={memoOpened}>
						<p className="inputs-label">
							Memo
						</p>
						<textarea onChange={this.changeMemo} placeholder="This memo is public" value={memo}/>
					</ShowIf>
					<InputActiveKey className="active-key_transfer"/>
				</form>
			</WalletPopupTemplate>
		);
	}
}

const mapStateToProps = state => {
	const {to, memo, showMemo, toError} = state.transfer;
	const {amount, amountError, selectedToken, tokenValue} = state.wallet;
	const {tokensNames} = state.services;
	return {
		balance: tokenValue[selectedToken],
		selectedToken,
		tokensNames,
		selectedTokenName: tokensNames[selectedToken],
		username: state.auth.user,
		memoOpened: showMemo,
		to,
		toError,
		amount,
		amountError,
		memo
	}
};

const mapDispatchToProps = dispatch => {
	return {
		setToken: token => {
			dispatch(setToken(token))
		},
		showMemo: () => {
			dispatch(showMemo())
		},
		changeUsername: value => {
			dispatch(changeUsername(value))
		},
		changeAmount: value => {
			dispatch(changeAmount(value))
		},
		changeMemo: value => {
			dispatch(changeMemo(value))
		},
		transfer: () => {
			dispatch(transfer())
		},
		closeTransferModal: () => {
			dispatch(closeModal("transfer"))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);
