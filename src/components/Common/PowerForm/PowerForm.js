import React from 'react';
import BalanceInfo from "../BalanceInfo/BalanceInfo";
import './powerForm.css';

const PowerForm = ({amount, amountOnChange, activeKey, activeKeyOnChange, countToken, className}) => (
	<div className={className || ''}>
		<div className="label-field_power-form">
			Amount
		</div>
		<div className="balance-group_power-form">
			<input value={amount} onChange={(e) => amountOnChange(e.target.value)}/>
			<BalanceInfo token="STEEM" amount={countToken}/>
		</div>
		<span onClick={() => amountOnChange(countToken)} className="using-max_power-form">Using maximum</span>
		<div className="key-field_power-form">
			<div className="label-field_power-form">
				Active Key
			</div>
			<input type="password" onChange={activeKeyOnChange} value={activeKey}/>
		</div>
	</div>
);

export default PowerForm;