const initialState = {
	token: 'SBD',
	showMemo: false,
	to: '',
	memo: '',
	loader: false
};

export default function transfer(state = initialState, action) {
	switch (action.type) {
		case 'TRANSFER_SHOW_MEMO':
			return {
				...state,
				showMemo: true
			};
		case 'TRANSFER_CHANGE_USERNAME':
			return {
				...state,
				to: action.value
			};
		case 'TRANSFER_CHANGE_MEMO':
			return {
				...state,
				memo: action.value
			};
		case 'TRANSFER_SHOW_LOADER':
			return {
				...state,
				loader: true
			};
		case 'TRANSFER_HIDE_LOADER':
			return {
				...state,
				loader: false
			};
		case 'TRANSFER_CLEAR':
			return {
				token: 'SBD',
				showMemo: false,
				to: '',
				memo: '',
				loader: false
			};
		default:
			return state;
	}
}
