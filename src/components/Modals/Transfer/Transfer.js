import React from 'react';
import {connect} from "react-redux";
import './transfer.css';
import ChooseToken from "../../Common/ChooseToken/ChooseToken";
import {
	changeMemo,
	changeUsername,
	clearTransfer,
	showMemo,
	transfer
} from "../../../actions/transfer";
import ShowIf from "../../Common/ShowIf";
import {closeModal} from "../../../actions/modal";
import WalletPopupTemplate from "../WalletPopupTemplate/WalletPopupTemplate";
import InputActiveKey from "../../Common/InputActiveKey/InputActiveKey";
import GrayInput from "../../Common/GrayInput/GrayInput";
import {changeAmount, setToken} from "../../../actions/wallet";
import ChainService from "../../../services/ChainService";

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

	componentWillUnmount() {
		this.props.clearTransfer();
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
		const {username, selectedToken, balance, memoOpened, to, amount, memo, tokensNames} = this.props;
		return (
			<WalletPopupTemplate title="TRANSFER TO ACCOUNT"
			                     username={username}
			                     textButton="OK"
			                     cancel={this.props.closeTransferModal}
			                     ok={this.props.transfer}>
				<form className="body_transfer" autoComplete="off">
					<div className="form-line_transfer">
						<p className="label_transfer">
							To
						</p>
						<div className="field_transfer">
							<div className="at_transfer"/>
							<input placeholder="username" onChange={this.changeUsername} maxLength={16} value={to}/>
						</div>
					</div>

					<div className="form-line_transfer">
						<ChooseToken selectedToken={selectedToken}
						             amount={balance}
						             onChange={this.changeToken}
						             balanceOnClick={this.setAllAmount}
						             tokensNames={tokensNames}
						/>
					</div>

					<GrayInput label="Amount" className="form-line_transfer fixed-margin_transfer" onChange={this.changeAmount}
					           placeholder="0.001" value={amount} ref={this.setAmountRef}
					           onFocus={this.amountFocused}/>


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
	const {to, memo, showMemo} = state.transfer;
	const {amount, selectedToken, tokenValue} = state.wallet;
	const {tokensNames} = state.services;
	const isGolosService = ChainService.usingGolos();
	return {
		balance: tokenValue[selectedToken],
		selectedToken,
		tokensNames,
		selectedTokenName: tokensNames[selectedToken],
		username: state.auth.user,
		memoOpened: showMemo,
		to,
		amount,
		memo,
		isGolosService
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
		clear: () => {
			dispatch(clearTransfer())
		},
		transfer: () => {
			dispatch(transfer())
		},
		clearTransfer: () => {
			dispatch(clearTransfer())
		},
		closeTransferModal: () => {
			dispatch(closeModal("transfer"))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);
