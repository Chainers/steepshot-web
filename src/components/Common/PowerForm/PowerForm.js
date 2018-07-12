import React from 'react';
import BalanceInfo from "../BalanceInfo/BalanceInfo";
import InputActiveKey from "../InputActiveKey/InputActiveKey";
import './powerForm.css';

const PowerForm = ({amount, amountOnChange, countToken, token, className}) => (
	<form className={className || ''} autoComplete="off">
		<div className="label-field_power-form">
			Amount
		</div>
		<div className="balance-group_power-form">
			<input value={amount} onChange={(e) => amountOnChange(e.target.value)} name="amount"/>
			<BalanceInfo token={token} amount={countToken}/>
		</div>
		<span onClick={() => amountOnChange(countToken)} className="using-max_power-form">Using maximum</span>
		<InputActiveKey className="input-active-key_power-form" name="activeKey"/>
	</form>
);

export default PowerForm;