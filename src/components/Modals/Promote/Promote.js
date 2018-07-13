import React from 'react';
import {connect} from 'react-redux';
import './promote.css';
import {closeModal} from '../../../actions/modal';
import {
	addPostIndex,
	getAuthUserInfo,
	getAuthUserInfoError,
	getAuthUserInfoSuccess,
	searchingBotRequest,
	setNoTokensForPromote,
	setPromoteInputError,
	setPromoteValue,
	setSelectedIndex,
	setSelectError
} from '../../../actions/promoteModal';
import Constants from '../../../common/constants';
import {loadingEllipsis} from '../../../utils/loadingEllipsis';
import {pushMessage} from '../../../actions/pushMessage';
import ChooseToken from "../../Common/ChooseToken/ChooseToken";
import ShowIf from "../../Common/ShowIf";
import GrayInput from "../../Common/GrayInput/GrayInput";
import WalletPopupTemplate from "../WalletPopupTemplate/WalletPopupTemplate";

class Promote extends React.Component {

	constructor(props) {
		super(props);
		this.promoteByEnter = this.promoteByEnter.bind(this);
		this.setPromoteValue = this.setPromoteValue.bind(this);
		this.promotePost = this.promotePost.bind(this);
		this.setSelectedValue = this.setSelectedValue.bind(this);
	}

	componentDidMount() {
		if (!this.props.userInfo || !Object.keys(this.props.userInfo).length) {
			this.props.getAuthUserInfo();
		}
		this.props.addPostIndex(this.props.index);
		this.container.addEventListener('keypress', this.promoteByEnter);
	}

	componentWillUnmount() {
		this.clearPromoteModalInfo();
		this.container.removeEventListener('keypress', this.promoteByEnter);
		this.props.getAuthUserInfoError('');
	}

	clearPromoteModalInfo() {
		this.props.setPromoteInputError('');
		this.props.setSelectError('');
		this.props.getAuthUserInfoSuccess({});
		this.props.setNoTokensForPromote(false);
	}

	promoteByEnter(e) {
		if (e.keyCode === 13) {
			e.stopPropagation();
			this.promotePost();
		}
	}

	promotePost() {
		if (!this.props.searchingBot && !this.props.infoLoading && this.validPromoteInfo()) {
			this.props.searchingBotRequest();
		}
	}

	validPromoteInfo() {
		if (this.props.selectedToken) {
			if (+this.props.tokenNumber < this.props.promoteAmount) {
				this.props.setPromoteInputError(Constants.PROMOTE.NOT_ENOUGH_TOKENS);
				return false;
			}
			if (this.props.promoteAmount < Constants.SERVICES.BOTS.MIN_BID_VALUE) {
				this.props.setPromoteInputError(Constants.PROMOTE.MIN_AMOUNT_ERROR);
				return false;
			}
			if (this.props.promoteAmount > Constants.SERVICES.BOTS.MAX_BID_VALUE) {
				this.props.setPromoteInputError(Constants.PROMOTE.MAX_AMOUNT_ERROR);
				return false;
			}
			let amount = this.props.promoteAmount.toString();
			amount = amount.trim();
			amount = amount.match(/\d+(\.\d+)?/);
			if (amount[0] === amount.input) return true;
			this.props.setPromoteInputError(Constants.PROMOTE.INPUT_ERROR);
		}
		if (!this.props.infoLoading) {
			this.props.setSelectError(Constants.PROMOTE.SELECT_ERROR);
		}
		return false;
	}

	setPromoteValue(e) {
		if (this.props.inputError) {
			this.props.setPromoteInputError('');
		}
		let value = e.target.value;
		let checkedValue = value.replace(/[^\d.]+/g, '');
		this.props.setPromoteValue(checkedValue);
	}

	setSelectedValue(e) {
		if (this.props.selectError) {
			this.props.setSelectError('');
		}
		if (this.props.inputError) {
			this.props.setPromoteInputError('');
		}
		this.props.setSelectedIndex(e.target.selectedIndex);
	}

	render() {

		let findText = 'FIND PROMOTER';
		if (this.props.searchingBot) {
			findText = loadingEllipsis('LOOKING');
		}

		return (
			<WalletPopupTemplate title="PROMOTE POST"
			                     textButton={this.props.noTokensForPromote ? undefined : findText}
			                     cancel={this.props.closeModal}
			                     ok={this.promotePost}>
				<div className="body_promote" ref={ref => this.container = ref}>
					<ShowIf show={this.props.noTokensForPromote}>
						<div className="no-tokens_promote centered--flex">
							There's not enough tokens for promote in your wallet.
						</div>
					</ShowIf>
					<ChooseToken selectedToken={this.props.selectedToken}
					             amount={this.props.tokenNumber}
					             onChange={this.setSelectedValue}
					             disabled={this.props.infoLoading}
					/>

					<div className="loading_promote">
						<ShowIf show={this.props.infoLoading}>
							{loadingEllipsis('Loading data')}
						</ShowIf>
					</div>

					<GrayInput placeholder="e.g. 100"
					           className="amount-input_promote"
					           value={this.props.promoteAmount}
					           onChange={this.setPromoteValue}
					           error={this.props.inputError}
					           label={`Promotion amount (minimum ${Constants.SERVICES.BOTS.MIN_BID_VALUE})`}
					/>
				</div>
			</WalletPopupTemplate>
		);
	}
}

const mapStateToProps = (state) => {
	let promoteModal = state.promoteModal;
	let tokenNumber = '';
	if (promoteModal.userInfo) {
		if (promoteModal.selectedToken === 'STEEM') {
			tokenNumber = promoteModal.userInfo.steem_balance;
		}
		if (promoteModal.selectedToken === 'SBD') {
			tokenNumber = promoteModal.userInfo.sbd_balance;
		}
	}
	return {
		...promoteModal,
		tokenNumber
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		closeModal: () => {
			dispatch(closeModal("PromoteModal"));
		},
		setPromoteValue: (value) => {
			dispatch(setPromoteValue(value));
		},
		setSelectedIndex: (index) => {
			dispatch(setSelectedIndex(index));
		},
		getAuthUserInfo: () => {
			dispatch(getAuthUserInfo());
		},
		setPromoteInputError: (error) => {
			dispatch(setPromoteInputError(error));
		},
		setSelectError: (error) => {
			dispatch(setSelectError(error));
		},
		pushMessage: (message) => {
			dispatch(pushMessage(message));
		},
		searchingBotRequest: () => {
			dispatch(searchingBotRequest());
		},
		getAuthUserInfoSuccess: (result) => {
			dispatch(getAuthUserInfoSuccess(result));
		},
		addPostIndex: (postIndex) => {
			dispatch(addPostIndex(postIndex));
		},
		getAuthUserInfoError: (error) => {
			dispatch(getAuthUserInfoError(error));
		},
		setNoTokensForPromote: (param) => {
			dispatch(setNoTokensForPromote(param));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Promote);
