import React from 'react';
import BalanceInfo from "../BalanceInfo/BalanceInfo";
import InputActiveKey from "../InputActiveKey/InputActiveKey";
import './powerForm.css';
import GrayInput from "../GrayInput/GrayInput";

const PowerForm = ({amount, amountError, amountOnChange, countToken, token, className}) => (
	<form className={className || ''} autoComplete="off">
		<div className="balance-group_power-form">
			<GrayInput label="amount" value={amount} onChange={(e) => amountOnChange(e.target.value)} name="amount"
			           error={amountError} maxLength={15}/>
			<BalanceInfo token={token} amount={countToken}/>
		</div>
		<span onClick={() => amountOnChange(countToken)} className="using-max_power-form">Using maximum</span>
		<InputActiveKey className="input-active-key_power-form" name="activeKey"/>
	</form>
);

export default PowerForm;