import React from 'react';
import InputActiveKey from '../InputActiveKey/InputActiveKey';
import './powerForm.css';
import GrayInput from '../GrayInput/GrayInput';
import Constants from '../../../common/constants';

const PowerForm = ({amount, amountError, amountOnChange, tokensAmount, token, className}) => {

	function useMaxAmount() {
    if (className === 'form_power-down') {
      tokensAmount = (tokensAmount - Constants.TRANSFER.MIN_LEAVE_STEEM_POWER).toFixed(3) / 1;
    }
    amountOnChange(tokensAmount);
	}

	function onChangeAmount(e) {
    amountOnChange(e.target.value);
	}

	return (
		<form className={className || ''} autoComplete="off">
			<div className="balance-group_power-form">
				<div className="relative-wrapper_power-form">
					<GrayInput label="Amount" placeholder="e.g. 100" value={amount} onChange={onChangeAmount} name="amount"
										 error={amountError} maxLength={12}/>
					<div className="token-amount_power-form">
						<div className="balance_power-form">Balance: {tokensAmount}</div>
						<div className="token_power-form">{token}</div>
					</div>
				</div>
				<div onClick={useMaxAmount} className="btn btn-cancel btn-cancel-20_power-form">MAX</div>
			</div>
			<InputActiveKey className="input-active-key_power-form"/>
		</form>
	)
};

export default PowerForm;