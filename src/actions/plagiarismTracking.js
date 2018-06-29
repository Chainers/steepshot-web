import PostService from '../services/postService';
import Constants from '../common/constants';
import AuthService from '../services/authService';
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
        push(`/@${AuthService.getUsername()}`);
      })
      .catch(error => {
        dispatch(editPostReject(error));
        dispatch(pushErrorMessage(error));
      });
	}
}