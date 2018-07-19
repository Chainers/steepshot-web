import React from 'react';
import './balanceInfo.css';

const BalanceInfo = ({token, amount, onClick}) => (
		<div className="container_balance-info">
			<span>Balance</span>
			<span className={'value_balance-info ' +(!!onClick ? 'pointer_balance-info' : '')}
			      onClick={onClick}>
				{amount} {token}
				</span>
		</div>
);

export default BalanceInfo;