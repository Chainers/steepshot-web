const initialState = {
	activeIndex: 0
};

export default function imagesGallery(state = initialState, action) {
	switch (action.type) {
		case 'GALLERY_SET_ACTIVE_IMAGE':
			return {
				...state,
				activeIndex: action.index
			};
		case 'GALLERY_CLEAR_STATE':
			return initialState;

		default:
			return state;
	}
}
