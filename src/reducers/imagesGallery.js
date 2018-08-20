const initialState = {
	imageLoading: true,
	activeIndex: 0
};

export default function imagesGallery(state = initialState, action) {
	switch (action.type) {
		case 'GALLERY_IMAGE_LOADED':
			return {
				...state,
				imageLoading: false
			};
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
