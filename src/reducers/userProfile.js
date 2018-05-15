const initialState = {
	profile: null,
	loading: false,
	changeFollow: false
};

export default function userProfile(state = initialState, action) {
	switch (action.type) {
		case 'GET_USER_PROFILE_REQUEST':
			return {
				...state,
				loading: true
			};
		case 'GET_USER_PROFILE_SUCCESS':
			return {
				...state,
				profile: action.profile,
				loading: false
			};
		case 'CHANGE_FOLLOW_REQUEST':
			return {
				...state,
				changeFollow: true
			};
		case 'CHANGE_FOLLOW_SUCCESS':
			return {
				...state,
				changeFollow: false,
				profile: {
					...state.profile,
					has_followed: !state.profile['has_followed']
				}
			};
		case 'CHANGE_FOLLOW_ERROR':
			return {
				...state,
				changeFollow: false
			};

		default:
			return state;
	}
}
