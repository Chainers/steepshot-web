const initialState = {};

export default function imagesLoad(state = initialState, action) {
	switch (action.type) {
		case 'IMAGE_LOAD_ERROR':
			return {
				...state,
				[action.imageUrl]: {
					loaded: true,
					hasError: true
				}
			};
		case 'IMAGE_LOAD_SUCCESS':
			return {
				...state,
				[action.imageUrl]: {
					loaded: true,
					hasError: false
				}
			};
		default:
			return state;
	}
}
