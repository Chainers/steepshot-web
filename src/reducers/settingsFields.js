export default function settingsFields(state = {}, action) {
	switch (action.type) {
		case 'INITIALIZE_SETTINGS_FIELD':
			return {
				...state,
				[action.point]: action.default
			};
		case 'TOGGLE_SETTINGS_FIELD':
			return {
				...state,
				[action.point]: !state[action.point]
			};
		default:
			return state;
	}
}
