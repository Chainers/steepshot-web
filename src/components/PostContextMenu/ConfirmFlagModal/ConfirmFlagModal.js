import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import './ConfirmFlagModal.css';
import {closeModal} from "../../../actions/modal";
import {toggleFlag} from "../../../actions/flag";

class ConfirmFlagModal extends React.Component {

	confirm() {
			this.props.closeModal("ConfirmFlagModal");
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
					<button className="btn btn-index" onClick={() => this.props.closeModal("ConfirmFlagModal")}>CANCEL</button>
					<button className="btn btn-default" onClick={this.confirm.bind(this)}>FLAG</button>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		closeModal: (index) => {
			dispatch(closeModal(index));
		},
		toggleFlag: (postIndex) => {
			dispatch(toggleFlag(postIndex));
		}
	}
};

export default connect(state => {}, mapDispatchToProps)(ConfirmFlagModal);
