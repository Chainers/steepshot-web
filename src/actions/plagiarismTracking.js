import PostService from '../services/PostService';
import Constants from '../common/constants';
import AuthService from '../services/AuthService';
import {push} from 'react-router-redux';
import {closeModal} from './modal';
import {editPostReject, editPostRequest, editPostSuccess} from './editPost';
import {pushErrorMessage, pushMessage} from './pushMessage';

export function continuePublishing(data) {
	return dispatch => {
		dispatch(closeModal('PlagiarismTrackingModal'));
		dispatch(editPostRequest());
		PostService.afterCheckingPlagiarism(data.operations)
			.then(() => {
				dispatch(pushMessage(Constants.POST_SUCCESSFULLY_CREATED));
				dispatch(editPostSuccess());
				dispatch(push(`/@${AuthService.getUsername()}`));
				dispatch(push(`/@${AuthService.getUsername()}`));
			})
			.catch(error => {
				dispatch(editPostReject(error));
				dispatch(pushErrorMessage(error));
			});
	}
}