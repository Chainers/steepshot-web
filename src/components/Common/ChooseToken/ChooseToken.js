import React, {Fragment} from 'react';
import './chooseToken.css';
import BalanceInfo from "../BalanceInfo/BalanceInfo";

const ChooseToken = ({selectedToken, amount, onChange, balanceOnClick, disabled = false, isGolosService = false}) => (
	<Fragment>
		<p className="label_choose-token">Token</p>
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
			<BalanceInfo token={isGolosService ? (selectedToken === 'STEEM' ? 'GOLOS' : 'GBG') : selectedToken}
			             amount={amount} onClick={balanceOnClick}/>
		</div>
	</Fragment>
);

export default ChooseToken;