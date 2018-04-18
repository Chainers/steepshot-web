const initialState = {
	profile: null,
	loading: false
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

		default:
			return state;
	}
}
