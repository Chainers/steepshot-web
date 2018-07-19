import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {closeModal} from '../../../actions/modal';
import {toggleFlag} from '../../../actions/flag';
import './confirmFlagModal.css';

class ConfirmFlagModal extends React.Component {

	confirm() {
		this.props.closeModal("ConfirmFlagModal");
		this.props.closeModal("MenuModal");
		this.props.toggleFlag(this.props.postIndex);
	}

	render() {
		return (
			<div className="wrapper_confirm-flag-mod">
				<div className="body_confirm-flag-mod">
					<p className="title_confirm-flag-mod">Flagging a post can remove rewards and make this material less
						visible.</p>
					<p className="description_confirm-flag-mod">Some common reasons to flag:</p>
					<p className="description_confirm-flag-mod">- Disagreement on rewards, Fraud or Plagiarism,
						Hate Speech or Internet Trolling, Intentional miss-categorized content or Spam.</p>
					<p className="description-link_confirm-flag-mod">
						<Link to="/guide">Link to our guidelines</Link>
					</p>
				</div>
				<div className="buttons_holder-flag-mod">
					<button className="btn btn-cancel" onClick={() => this.props.closeModal("ConfirmFlagModal")}>CANCEL</button>
					<button className="btn btn-default" onClick={this.confirm.bind(this)}>FLAG</button>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		toggleFlag: (postIndex) => {
			dispatch(toggleFlag(postIndex));
		},
		closeModal: (postIndex) => {
			dispatch(closeModal(postIndex));
		}
	}
};

export default connect(() => {
	return {}
}, mapDispatchToProps)(ConfirmFlagModal);
