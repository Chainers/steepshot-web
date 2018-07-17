const initialState = {
	showMemo: false,
	to: '',
	toError: '',
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
				to: action.value,
				toError: ''
			};
		case 'TRANSFER_ERROR':
			if (action.toError) {
				return {
					...state,
					toError: action.toError
				};
			}
			return state;
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
		case 'CLOSE_MODAL':
			if (action.index === 'transfer' || action.index === 'powerUp' || action.index === 'powerDown') {
				return initialState;
			}
			return state;
		default:
			return state;
	}
}
