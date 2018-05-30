const initialState = {
	usernameError: '',
	postingKeyError: ''
};

export default function login(state = initialState, action) {
	switch (action.type) {
		case 'SET_USERNAME_ERROR_MESSAGE':
			return {
				...state,
				usernameError: action.message
			};
		case 'SET_POSTING_KEY_ERROR_MESSAGE':
			return {
				...state,
				postingKeyError: action.message
			};
		case 'CLEAR_LOGIN_ERROR':
			return initialState;
		default:
			return state;
	}
}
