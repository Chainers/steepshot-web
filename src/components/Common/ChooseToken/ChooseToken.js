import React from 'react';
import './chooseToken.css';

const ChooseToken = ({selectedToken, amount, onChange, balanceOnClick, disabled = false, isGolosService = false}) => (
	<div className="container_choose-token">
		<div className="select_choose-token">
			<select className={disabled ? ' disabled' : ''}
			        onChange={onChange}
			        value={selectedToken}
			        disabled={disabled ? 'disabled' : ''}>
				<option value="STEEM">{isGolosService ? 'GOLOS' : 'STEEM'}</option>
				<option value="SBD">{isGolosService ? 'GBG' : 'SBD'}</option>
			</select>
		</div>
		<div className="balance_choose-token">
			<span>Balance</span>
			<span className={'balance-value_choose-token ' +(!!balanceOnClick ? 'pointer_choose-token' : '')}
			      onClick={balanceOnClick}>
				{amount} {isGolosService ? (selectedToken === 'STEEM' ? 'GOLOS' : 'GBG') : selectedToken}
				</span>
		</div>
	</div>
);

export default ChooseToken;