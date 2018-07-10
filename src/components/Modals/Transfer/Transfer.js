import React from 'react';
import {connect} from "react-redux";
import './transfer.css';
import ChooseToken from "../../Common/ChooseToken/ChooseToken";
import {
	changeActiveKey,
	changeAmount,
	changeMemo,
	changeSaveKey,
	changeUsername, clearTransfer,
	setToken,
	showMemo
} from "../../../actions/transfer";
import ShowIf from "../../Common/ShowIf";

class Transfer extends React.Component {

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

	changeActiveKey(e) {
		this.props.changeActiveKey(e.target.value);
	}

	changeSaveKey() {
		this.props.changeSaveKey();
	}

	render() {
		const {username, selectedToken, amountToken, memoOpened, saveKey} = this.props;
		return (
			<div className="container_transfer">
				<div className="header_transfer">
					<div className="title_transfer">
						TRANSFER TO ACCOUNT
					</div>
					<div className="username_transfer">
						@{username}
					</div>
				</div>

				<form className="body_transfer" autoComplete="off">

					<div className="form-line_transfer">
						<div className="label_transfer">
							To
						</div>
						<div className="field_transfer">
							<div className="at_transfer"/>
							<input placeholder="username" onChange={this.changeUsername.bind(this)} maxLength={16}/>
						</div>
					</div>

					<div className="form-line_transfer">
						<div className="label_transfer">
							Token
						</div>
						<ChooseToken selectedToken={selectedToken}
						             amount={amountToken}
						             onChange={this.changeToken.bind(this)}/>
					</div>

					<div className="form-line_transfer">
						<div className="label_transfer">
							Amount
						</div>
						<div className="field_transfer">
							<input type="number" onChange={this.changeAmount.bind(this)} placeholder="0.001"/>
						</div>
					</div>

					<ShowIf show={!memoOpened}>
						<div className="add-memo_transfer">
							<span onClick={this.props.showMemo}>
								+ Add memo
							</span>
						</div>
					</ShowIf>

					<ShowIf show={memoOpened}>
						<div className="label_transfer">
							Memo
						</div>
						<textarea onChange={this.changeMemo.bind(this)} placeholder="This memo is public"/>
					</ShowIf>

					<div className="form-line_transfer">
						<div className="label_transfer">
							Active key
						</div>
						<div className="field_transfer">
							<input type="password" onChange={this.changeActiveKey.bind(this)} />
						</div>
					</div>
					<div className="checkbox-field_transfer">
						<div className={'checkbox_transfer ' + (saveKey ? 'save_transfer' : '')}
					     onClick={this.changeSaveKey.bind(this)}/>
						Save your key?
					</div>
				</form>
				<div className="buttons_transfer clearfix">
					<button className="btn btn-default">OK</button>
					<button className="btn btn-cancel">CANCEL</button>
				</div>
			</div>
		);
	}
}


const mapStateToProps = state => {
	const {balance, sbd_balance,} = state.userProfile.profile || {};
	const {token, showMemo, saveKey} = state.transfer;
	return {
		steem: balance,
		sbd: sbd_balance,
		selectedToken: token,
		amountToken: '323.01',
		username: state.auth.user,
		memoOpened: showMemo,
		saveKey
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
		changeActiveKey: value => {
			dispatch(changeActiveKey(value))
		},
		changeSaveKey: () => {
			dispatch(changeSaveKey())
		},
		clear: () => {
			dispatch(clearTransfer())
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);
