import React from 'react';
import './transaction.css';

const Transaction = ({trx, index}) => (
	<div className="container_trx" key={index}>
		<div className="type_trx">
		</div>
		<div className="info_trx">
		</div>
		<div className="memo_trx">
		</div>
	</div>
);

export default Transaction;