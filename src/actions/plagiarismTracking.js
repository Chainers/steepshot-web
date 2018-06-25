import PostService from '../services/postService';
import Constants from '../common/constants';
import AuthService from '../services/authService';
import {push} from 'react-router-redux';
import {closeModal} from './modal';
import {editPostReject, editPostRequest, editPostSuccess} from './editPost';
import {pushErrorMessage, pushMessage} from './pushMessage';

export function continuePublishing(data) {
	closeModal('PlagiarismTrackingModal');
	editPostRequest();
	PostService.afterCheckingPlagiarism(data.operations)
		.then(() => {
			pushMessage(Constants.POST_SUCCESSFULLY_CREATED);
			editPostSuccess();
			push(`/@${AuthService.getUsername()}`);
		})
		.catch(error => {
			editPostReject(error);
			pushErrorMessage(error);
		});

}