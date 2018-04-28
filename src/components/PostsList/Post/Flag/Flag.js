import React from 'react';
import {connect} from 'react-redux';
import ConfirmFlagModal from '../../../PostContextMenu/ConfirmFlagModal/ConfirmFlagModal';
import Constants from '../../../../common/constants';
import {toggleFlag} from '../../../../actions/flag';
import {closeModal, openModal} from '../../../../actions/modal';
import {pushMessage} from "../../../../actions/pushMessage";

class Flag extends React.Component {

	toggleFlag() {
		if (!this.props.isUserAuth) {
			this.props.pushMessage(Constants.VOTE_ACTION_WHEN_NOT_AUTH);
			return;
		}
		if (!this.props.flag) {
			let modalOption = {
				body: (<ConfirmFlagModal closeModal={() => {
					this.props.closeModal("ConfirmFlagModal")
				}} flagCallback={this.flagCallback.bind(this)}/>),
			};
			this.props.openModal("ConfirmFlagModal", modalOption);
		} else {
 			this.props.toggleFlag(this.props.postIndex);
		}
	}

	flagCallback(param) {
		if (param) {
			this.props.closeModal("ConfirmFlagModal");
			this.props.toggleFlag(this.props.postIndex);
		} else {
			this.props.closeModal("ConfirmFlagModal");
		}
	}

	render() {
		let buttonClasses = 'btn-flag';
		if (this.props.flag) {
			buttonClasses = buttonClasses + ' marked';
		}
		if (this.props.flagLoading) {
			buttonClasses = buttonClasses + ' loading';
		}
		if (this.props.isComment) {
			let flagComment = 'Flag';
      if (this.props.flag) {
        flagComment = 'Unflag';
      }
      if (this.props.flagLoading) {
        flagComment = <span className="saving">Pending<span> .</span><span> .</span><span> .</span></span>;
      }
			return (
				<span className={this.props.flagLoading ? 'flag-not-hover_comment' : 'flag_comment'}
							style={{marginRight: 18}}
							onClick={this.toggleFlag.bind(this)}>{flagComment}</span>
			)
		}
		return (
			<div className="position--relative" onClick={this.toggleFlag.bind(this)}>
				<button type="button" className={buttonClasses}/>
				<div className="card-control-stop"/>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		...state.posts[props.postIndex],
		isUserAuth: !!state.auth.user && !!state.auth.postingKey
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		openModal: (index, options) => {
			dispatch(openModal(index, options));
		},
		closeModal: (index) => {
			dispatch(closeModal(index));
		},
		toggleFlag: (postIndex) => {
			dispatch(toggleFlag(postIndex));
		},
		pushMessage: (message) => {
			dispatch(pushMessage(message))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Flag);
