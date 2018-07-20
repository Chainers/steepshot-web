import React from 'react';
import {connect} from 'react-redux';
import './promote.css';
import {closeModal} from '../../../actions/modal';
import {
  addPostIndex, clearPromoteModalInfo, getAuthUserInfo, searchingBotRequest, setPromoteInputError
} from '../../../actions/promoteModal';
import Constants from '../../../common/constants';
import {loadingEllipsis} from '../../../utils/loadingEllipsis';
import {pushMessage} from '../../../actions/pushMessage';
import ChooseToken from "../../Common/ChooseToken/ChooseToken";
import ShowIf from "../../Common/ShowIf";
import GrayInput from "../../Common/GrayInput/GrayInput";
import WalletPopupTemplate from "../WalletPopupTemplate/WalletPopupTemplate";
import {changeAmount, setToken} from "../../../actions/wallet";

class Promote extends React.Component {

	constructor(props) {
		super(props);
		this.promoteByEnter = this.promoteByEnter.bind(this);
		this.promotePost = this.promotePost.bind(this);
		this.changeAmount = this.changeAmount.bind(this);
		this.changeToken = this.changeToken.bind(this);
	}

	componentDidMount() {
		this.props.getAuthUserInfo();
		this.props.addPostIndex(this.props.index);
		this.container.addEventListener('keypress', this.promoteByEnter);
	}

	componentWillUnmount() {
		this.props.clearPromoteModalInfo();
		this.container.removeEventListener('keypress', this.promoteByEnter);
	}

	changeAmount(e) {
		this.props.changeAmount(e.target.value);
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

	changeToken(e) {
		this.props.setToken(e.target.value);
	}

	validPromoteInfo() {
		if (this.props.balance < this.props.amount) {
			this.props.setPromoteInputError(Constants.ERROR_MESSAGES.NOT_ENOUGH_TOKENS);
			return false;
		}
		if (this.props.amount < Constants.SERVICES.BOTS.MIN_BID_VALUE) {
			this.props.setPromoteInputError(Constants.PROMOTE.MIN_AMOUNT_ERROR);
			return false;
		}
		if (this.props.amount > Constants.SERVICES.BOTS.MAX_BID_VALUE) {
			this.props.setPromoteInputError(Constants.PROMOTE.MAX_AMOUNT_ERROR);
			return false;
		}
		let amount = this.props.amount.toString();
		amount = amount.trim();
		amount = amount.match(/\d+(\.\d+)?/);
		if (amount[0] === amount.input) return true;
		this.props.setPromoteInputError(Constants.PROMOTE.INPUT_ERROR);
		return false;
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
					             amount={this.props.balance}
					             onChange={this.changeToken}
					             disabled={this.props.infoLoading}
					             tokensNames={this.props.tokensNames}
					/>
					<div className="loading_promote">
						<ShowIf show={this.props.infoLoading}>
							{loadingEllipsis('Loading data')}
						</ShowIf>
					</div>
					<GrayInput placeholder="e.g. 100"
					           className="amount-input_promote"
					           value={this.props.amount}
					           onChange={this.changeAmount}
					           error={this.props.inputError}
					           label={`Promotion amount (minimum ${Constants.SERVICES.BOTS.MIN_BID_VALUE})`}
					/>
				</div>
			</WalletPopupTemplate>
		);
	}
}

const mapStateToProps = (state) => {
	const {tokensNames} = state.services;
	const {amount, selectedToken, tokenValue} = state.wallet;
	const {inputError, infoLoading, searchingBot} = state.promoteModal;
	return {
		inputError,
		infoLoading,
		noTokensForPromote: !infoLoading && (tokenValue[0] <= 0.5 && tokenValue[1] <= 0.5),
		searchingBot,
		amount,
		tokensNames,
		selectedToken,
		balance: tokenValue[selectedToken],
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		closeModal: () => {
			dispatch(closeModal("PromoteModal"));
		},
		setToken: token => {
			dispatch(setToken(token))
		},
		changeAmount: value => {
			dispatch(changeAmount(value))
		},
		getAuthUserInfo: () => {
			dispatch(getAuthUserInfo());
		},
		setPromoteInputError: (error) => {
			dispatch(setPromoteInputError(error));
		},
		pushMessage: (message) => {
			dispatch(pushMessage(message));
		},
		searchingBotRequest: () => {
			dispatch(searchingBotRequest());
		},
		addPostIndex: (postIndex) => {
			dispatch(addPostIndex(postIndex));
		},
		clearPromoteModalInfo: () => {
			dispatch(clearPromoteModalInfo());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Promote);
