import React from 'react';
import './transaction.css';

const Transaction = ({operation, data}) => (
	<div className="container_trx">
		<div className="type_trx">
			{operation}
		</div>
		<div className="info_trx">
			{data.amount}
		</div>
		<div className="memo_trx">
			{data.memo}
		</div>
	</div>
);

export default Transaction;