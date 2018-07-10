const initialState = {
	style: {},
	needsCommentFormLoader: false,
	fullScreenMode: false,
	fullScreenNavigation: true,
	timeoutID: null,
	newImageLoading: true
};

export default function postModal(state = initialState, action) {
	switch (action.type) {
		case 'INIT_POST_MODAL':
			return {...initialState, ...action.options};

		case 'SET_POST_MODAL_OPTIONS':
			return {...state, ...action.options};

		case 'SWAP_POST_MODAL':
			return {
				...initialState,
				point: state.point,
				currentIndex: action.index,
				fullScreenMode: state.fullScreenMode,
				fullScreenNavigation: state.fullScreenNavigation,
				timeoutID: state.timeoutID,
				newImageLoading: action.isLoading,
				previousStyle: action.previousStyle
			};

		case 'SET_FULL_SCREEN':
			return {
				...state,
				fullScreenMode: action.isOpen,
				timeoutID: action.timeoutID,
			};

		case 'SET_FULL_SCREEN_NAVIGATION':
			return {
				...state,
				fullScreenNavigation: action.isVisible,
				timeoutID: action.timeoutID
			};

		case 'SET_POST_OFFSET':
			return {
				...state,
				postOffset: action.postOffset
			};
		case 'SET_NEW_IMAGE_LOADING':
			return {
				...state,
				newImageLoading: action.newImageLoading
			};

		default:
			return state;
	}
}
