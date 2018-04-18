import {getProfile} from "../services/userProfile";

export function getUserProfile(userName) {
	return dispatch => {
		dispatch({
			type: "GET_USER_PROFILE_REQUEST"
		});
			getProfile(userName).then((result) => {
				if (result.length === 0) {
					this.props.historyPush('*');
					return;
				}
				dispatch({
					type: 'GET_USER_PROFILE_SUCCESS',
					profile: result
				});
			});
	}
}