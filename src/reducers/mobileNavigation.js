const initialState = {
	opened: false
};

export default function mobileNavigation(state = initialState, action) {
	switch (action.type) {
		case 'OPEN_MOBILE_NAVIGATION':
			return {
				...state,
				opened: true
			};
		case 'CLOSE_MOBILE_NAVIGATION':
			return {
				...state,
				opened: false
			};
		default:
			return state;
	}
}
