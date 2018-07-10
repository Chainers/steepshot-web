import React from 'react';
import './chooseToken.css';

const ChooseToken = ({selectedToken, amount, onChange, disabled = false}) => (
	<div className="container_choose-token">
		<div className="select_choose-token">
			<select className={disabled ? ' disabled' : ''}
			        onChange={onChange}
			        value={selectedToken}
			        disabled={disabled ? 'disabled' : ''}>
				<option value="STEEM">STEEM</option>
				<option value="SBD">SBD</option>
			</select>
		</div>
		<div className="balance_choose-token">
			<span>Balance</span>
			<span className="balance-value_choose-token">{amount} {selectedToken}</span>
		</div>
	</div>
);

export default ChooseToken;