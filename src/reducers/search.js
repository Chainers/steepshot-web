const initialState = {
	value: '',
	isOpened: false
};

export default function search(state = initialState, action) {
	switch (action.type) {
		case 'SET_SEARCH_VALUE':
			return {
				...state,
				value: action.value
			};

		case 'SET_SEARCH_PANEL_STATE':
			return {
				...state,
				isOpened: action.flag
			};

		default:
			return state;
	}
}
