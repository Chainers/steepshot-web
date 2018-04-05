const initialState = {};
const defaultOption = {
	body: null,
	willClose: false,
	bodyHeight: 0,
	containerHeight: 0
};

export default function modals(state = initialState, action) {
	switch (action.type) {
		case 'OPEN_MODAL':
			return {
				...state,
				[action.index]: {
					...defaultOption, ...action.options
				}
			};
		case '@@router/LOCATION_CHANGE':
		case 'CLOSE_ALL_MODALS':
			return initialState;

		case 'SET_MODAL_OPTIONS':
			return {
				...state,
				[action.index]: {
					...state[action.index],
					...action.options
				}
			};

		case 'CLOSE_MODAL':
			let newState = {...state};
			delete newState[action.index];
			return newState;

		case 'WILL_CLOSE_MODAL':
			return {
				...state,
				[action.index]: {
					...state[action.index],
					willClose: true
				}
			};

		default:
			return state;
	}
}
