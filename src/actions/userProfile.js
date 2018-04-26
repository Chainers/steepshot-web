import {getProfile} from "../services/userProfile";
import {push} from "react-router-redux";

export function getUserProfile(userName) {
	return dispatch => {
		dispatch({
			type: "GET_USER_PROFILE_REQUEST"
		});
			getProfile(userName).then((result) => {
				if (result.length === 0) {
					dispatch(push('/search/' + userName));
					return;
				}
				dispatch({
					type: 'GET_USER_PROFILE_SUCCESS',
					profile: result
				});
			});
	}
}