import React from 'react';
import './transactionHistory.css';
import {connect} from "react-redux";
import LoadingSpinner from "../../../LoadingSpinner";
import {getTransactionHistory} from "../../../../actions/transactionHistory";
import InfinityScroll from "../../../InfinityScroll/InfinityScroll";
import ShowIf from "../../ShowIf";
import Transaction from "./Transaction/Transaction";

class TransactionHistory extends React.Component {

	constructor(props) {
		super();
		props.getTransactionHistory();
	}

	render() {
		const {getTransactionHistory, hasMore, transactions, loading} = this.props;
		return (
			<InfinityScroll
				point='body'
				fetch={getTransactionHistory}
				hasMore={hasMore && transactions.length > 0}>
				<div className="container_trx-history">
					{transactions.map((trx, index) =>
						<Transaction operation={trx[1].op[0]}
												 data={trx[1].op[1]}
												 key={index}
												 index={index}
												 date={trx[1].timestamp}
						/>
					).reverse()}
					<ShowIf show={loading}>
						<LoadingSpinner/>
					</ShowIf>
				</div>
			</InfinityScroll>
		);
	}
}

const mapStateToProps = state => {
	const {loading, transactions, hasMore} = state.transactionHistory;
	return {
		loading,
		transactions,
		hasMore
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
