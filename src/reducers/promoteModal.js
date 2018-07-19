import storage from "../utils/Storage";

const initialState = {
	inputError: '',
	activeKey: storage.activeKey || '',
	infoLoading: false,
	showActiveKey: false,
	searchingBot: false,
	redTimer: false,
	suitableBot: null,
	blockedTimer: false,
	postIndex: ''
};

export default function promoteModal(state = initialState, action) {
	switch (action.type) {
		case 'ADD_POST_INDEX' :
			return {
				...state,
				postIndex: action.postIndex
			};

		case 'SET_AUTH_USER_INFO_LOADING':
			return {
				...state,
				infoLoading: action.loading
			};

		case 'SET_PROMOTE_INPUT_ERROR':
			return {
				...state,
				inputError: action.error
			};

		case 'SET_ACTIVE_KEY_ERROR':
			return {
				...state,
				activeKeyError: action.activeKeyError
			};

		case 'SET_BOT_REQUEST':
			return {
				...state,
				searchingBot: action.state
			};

		case 'ADD_BOT':
			return {
				...state,
				suitableBot: action.bot
			};

		case 'SET_ACTIVE_KEY':
			return {
				...state,
				activeKey: action.key
			};

		case 'SET_ACTIVE_KEY_INPUT_SECURITY':
			return {
				...state,
				showActiveKey: action.state
			};

		case 'GET_AUTH_USER_INFO_ERROR':
			return {
				...state,
				userInfoErrorStatus: action.error
			};

		case 'SET_RED_TIMER':
			return {
				...state,
				redTimer: action.param
			};

		case 'SET_BLOCKED_TIMER':
			return {
				...state,
				blockedTimer: action.param
			};

		case 'LOGOUT_SUCCESS':
			return initialState;

		default:
			return state;
	}
}
