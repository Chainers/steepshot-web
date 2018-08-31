export default function images(state = {}, action) {
	switch (action.type) {

		case 'ADD_IMAGE_LINK':
			return {
				...state,
				...action.imageLink
			};

		default:
			return state;
	}
}