import React from 'react';
import './transactionHistory.css';
import {connect} from "react-redux";
import LoadingSpinner from "../../../LoadingSpinner";
import {getTransactionHistory} from "../../../../actions/transactionHistory";
import InfinityScroll from "../../../InfinityScroll/InfinityScroll";
import ShowIf from "../../ShowIf";

class TransactionHistory extends React.Component {

	constructor(props) {
		super();
		props.getTransactionHistory();
	}

	render() {
		return (
			<InfinityScroll
				point='body'
				fetch={this.props.getTransactionHistory}
				hasMore={this.props.hasMore && this.props.transactions.length > 0}>
				<div className="container_trx-history">
					<ShowIf show={this.props.loading}>
						<LoadingSpinner/>
					</ShowIf>
				</div>
			</InfinityScroll>
		);
	}
}

const mapStateToProps = state => {
	const {loading, transactions} = state.transactionHistory;
	return {
		loading,
		transactions,
		hasMore: true
	}
};

const mapDispatchToProps = dispatch => {
	return {
		getTransactionHistory: () => {
			dispatch(getTransactionHistory())
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistory);
