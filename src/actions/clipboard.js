import {pushMessage} from './pushMessage';
import Constants from '../common/constants';

export function copyToClipboard(text) {
	return dispatch => {
		dispatch(pushMessage(Constants.COPY_TO_CLIPBOARD));
		dispatch({
      type: 'COPY_TO_CLIPBOARD',
      text: text,
    })
	}
}
