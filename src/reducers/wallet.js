const initialState = {
	amount: 0.001,
	selectedToken: 0,
	tokenValue: [
		0,
		0
	]
};

export default function wallet(state = initialState, action) {
	switch (action.type) {
		case 'WALLET_SET_TOKEN':
			return {
				...state,
				selectedToken: action.value
			};
		case 'WALLET_CHANGE_AMOUNT':
			return {
				...state,
				amount: action.value
			};
		case 'GET_USER_PROFILE_SUCCESS':
			return {
				...state,
				tokenValue: [
					action.profile.balance,
					action.profile.sbd_balance,
				]
			};
		default:
			return state;
	}
}
