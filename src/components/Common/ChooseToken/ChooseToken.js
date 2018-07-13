import React, {Fragment} from 'react';
import './chooseToken.css';
import BalanceInfo from "../BalanceInfo/BalanceInfo";

const ChooseToken = ({selectedToken, amount, onChange, balanceOnClick, disabled = false, tokensNames}) => (
	<Fragment>
		<p className="label_choose-token">Token</p>
		<div className="container_choose-token">
			<div className="select_choose-token">
				<select className={disabled ? ' disabled' : ''}
				        onChange={onChange}
				        value={selectedToken}
				        disabled={disabled ? 'disabled' : ''}>
					<option value={0}>{tokensNames[0]}</option>
					<option value={1}>{tokensNames[1]}</option>
				</select>
			</div>
			<BalanceInfo token={tokensNames[selectedToken]}
			             amount={amount} onClick={balanceOnClick}/>
		</div>
	</Fragment>
);

export default ChooseToken;