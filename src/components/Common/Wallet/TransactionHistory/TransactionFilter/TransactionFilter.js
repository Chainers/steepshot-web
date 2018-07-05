import React from 'react';
import './transactionFilter.css';

const TransactionFilter = ({filter, current, onChange}) => {

	const onClick = (number) => {
		if (current !== number) {
			onChange(number);
		}
	};

	return (
		<div className="button_trx-filter">
			<div className="container_trx-filter">
				{filter.map((operation, index) =>
					<div className={'operation_trx-filter ' + (index === current ? 'active_trx-filter' : '')}
					     key={index}
					     onClick={() => onClick(index)}
					/>
				)}
			</div>
		</div>
	)
};

export default TransactionFilter;