import React from 'react';
import {connect} from "react-redux";
import './transfer.css';

class Transfer extends React.Component {

	render() {
		const {username} = this.props;
		return (
			<div className="container_transfer">
				<div className="header_transfer">
					<div className="title_transfer">
						Transfer to Account
					</div>
					<div className="description_transfer">
						Move funds to another Steem account.
					</div>
				</div>
				<div className="body_transfer">

					<div className="form-line_transfer">
						<div className="label_transfer">
							From
						</div>
						<div className="field_transfer">
							<div className="at_transfer">
								@
							</div>
							<input className="input_transfer" value={username} disabled={true}/>
						</div>
					</div>

					<div className="form-line_transfer">
						<div className="label_transfer">
							To
						</div>
						<div className="field_transfer">
							<div className="at_transfer">
								@
							</div>
							<input className="input_transfer" ref={ref => this.recipient = ref}/>
						</div>
					</div>

					<div className="form-line_transfer">
						<div className="label_transfer">
							Amount
						</div>
						<div className="field_transfer">
							<input className="input_transfer" ref={ref => this.amount = ref} pattern="[0-9.]" placeholder="Amount"/>
							<select className="select-coin_transfer">
								<option>STEEM</option>
								<option>SBD</option>
							</select>
						</div>
					</div>
					<div className="account-balance_transfer">
						Balance: 2345 STEEM
					</div>

					<div className="field-description_transfer">
						This memo is public
					</div>
					<div className="form-line_transfer">
						<div className="label_transfer">
							Memo
						</div>
						<div className="field_transfer">
							<input className="input_transfer" ref={ref => this.memo = ref} placeholder="memo"/>
						</div>
					</div>

					<div className="form-line_transfer">
						<div className="label_transfer">
							Active key
						</div>
						<div className="field_transfer">
							<input className="input_transfer" ref={ref => this.activeKey = ref} placeholder="Active Key"/>
						</div>
					</div>

					<button>Ok</button>
				</div>
			</div>
		);
	}
}


const mapStateToProps = state => {
	const {balance, sbd_balance} = state.userProfile.profile;
	return {
		steem: balance,
		sbd: sbd_balance
	}
};

const mapDispatchToProps = dispatch => {
	return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);
