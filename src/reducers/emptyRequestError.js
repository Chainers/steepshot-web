export default function emptyRequestError(state = {}, action) {
	switch (action.type) {

		case 'SET_EMPTY_REQUEST_ERROR':
			return {
				...state,
				point: action.point
			};


		default:
			return state;
	}
}
