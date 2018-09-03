const initialState = {
	profile: null,
  loadingUserProfile: false,
	changingFollowProfile: false,
	changeSubscribe: false
};

export default function userProfile(state = initialState, action) {
	switch (action.type) {
		case 'GET_USER_PROFILE_REQUEST':
			return {
				...state,
				loadingUserProfile: true
			};

		case 'GET_USER_PROFILE_SUCCESS':
			return {
				...state,
				profile: action.profile,
        loadingUserProfile: false
			};

    case 'UPDATE_ACCOUNT_BALANCE':
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.newBalance
        }
      };

		case 'SET_USER_PROFILE_LOADING':
			return {
        ...state,
        loadingUserProfile: action.loadingUserProfile
			};

		case 'CHANGE_FOLLOW_REQUEST_PROFILE':
			if (!state.profile) {
				return state;
			}
			return {
				...state,
        changingFollowProfile: true
			};

		case 'CHANGE_FOLLOW_SUCCESS_PROFILE':
			if (!state.profile) {
				return state;
			}
			return {
				...state,
        changingFollowProfile: false,
				profile: {
					...state.profile,
					has_followed: !state.profile['has_followed']
				}
			};

		case 'CHANGE_FOLLOW_ERROR':
			if (!state.profile) {
				return state;
			}
			return {
				...state,
        changingFollowProfile: false
			};

		case 'CHANGE_USER_SUBSCRIBE_REQUEST':
			return {
				...state,
				changeSubscribe: true
			};

		case 'CHANGE_USER_SUBSCRIBE_SUCCESS':
			return {
				...state,
				changeSubscribe: false,
				profile: {
					...state.profile,
					is_subscribed: !state.profile['is_subscribed']
				}
			};

		case 'CHANGE_USER_SUBSCRIBE_ERROR':
			return {
				...state,
				changeSubscribe: false
			};

		default:
			return state;
	}
}
