import React from 'react';
import {connect} from 'react-redux';
import ConfirmFlagModal from '../../../PostContextMenu/ConfirmFlagModal/ConfirmFlagModal';
import Constants from '../../../../common/constants';
import {closeModal, openModal} from '../../../../actions/modal';
import {pushMessage} from '../../../../actions/pushMessage';
import './flag.css';
import {toggleFlag} from '../../../../actions/flag';
import {loadingEllipsis} from '../../../../utils/loadingEllipsis';
import AuthService from '../../../../services/authService';

class Flag extends React.Component {

	toggleFlag() {
		if (!this.props.isUserAuth) {
			this.props.pushMessage(Constants.VOTE_ACTION_WHEN_NOT_AUTH);
			return;
		}
		if (!this.props.flag) {
			let modalOption = {
				body: (<ConfirmFlagModal postIndex={this.props.postIndex}/>),
			};
			this.props.openModal("ConfirmFlagModal", modalOption);
		} else {
			this.props.toggleFlag(this.props.postIndex);
		}
	}


	render() {
		let buttonClasses = 'btn-flag_flag';
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
				flagComment = loadingEllipsis('Pending');
			}
			return (
				<span className={this.props.flagLoading ? 'not-hover_comment' : 'flag_comment'}
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
		isUserAuth: AuthService.isAuth()
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
		pushMessage: (message) => {
			dispatch(pushMessage(message))
		},
		toggleFlag: (postIndex) => {
			dispatch(toggleFlag(postIndex));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Flag);
