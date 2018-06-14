import storage from "../utils/Storage";

const initialState = global.isServerSide ? {
	user: 'fake_user',
	postingKey: 'fake_posting_key',
	avatar: null,
	like_power: 100,
	voting_power: null
} : {
	user: storage.username,
	postingKey: storage.postingKey,
	avatar: storage.avatar,
	like_power: storage.like_power || 100,
	voting_power: null
};

export default function auth(state = initialState, action) {
	if (!state.hydrated) {
		state = {...initialState, state, hydrated: true};
	}
	switch (action.type) {
		case 'SET_USER_AUTH':
			return {
				...initialState,
				user: storage.username,
				postingKey: storage.postingKey,
				avatar: storage.avatar,
				isSetAuth: true
			};
		case 'LOGIN_SUCCESS':
		case 'SIGNUP_SUCCESS':
		case 'OAUTH_SUCCESS':
			return {
				...state,
				user: action.user,
				postingKey: action.postingKey,
				avatar: action.avatar,
				voting_power: action.voting_power,
				like_power: action.like_power
			};

		case 'LOGOUT_SUCCESS':
			return {
				...state,
				user: null,
				postingKey: null,
				avatar: null,
				voting_power: null,
				like_power: null
			};

		case 'UPDATE_VOTING_POWER':
			let checkedVotingPower = action.voting_power;
			if (checkedVotingPower > 100) {
        checkedVotingPower = 100
			}
			return {
				...state,
				voting_power: checkedVotingPower
			};
		case 'SET_LIKE_POWER':
			return {
				...state,
				like_power: action.like_power
			};

		default:
			return state;
	}
}
