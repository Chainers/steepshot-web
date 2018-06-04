const initialState = {
	initData: {},
	imageError: '',
	src: '',
	rotate: 0,
	tags: '',
	loading: false,
	waitingTime: 0,
	canCreate: true,
	isGif: false,
	dragHover: false
};

export default function editPost(state = initialState, action) {
	switch (action.type) {

		case 'EDIT_POST_CHANGE_TAGS':
			return {
				...state,
				tags: action.value
			};

		case 'EDIT_POST_CHANGE_IMAGE':
			return {
				...state,
				src: action.image,
				rotate: 0,
				imageError: '',
				isGif: !!action.image.includes("image/gif")
			};

		case 'EDIT_POST_ROTATE_IMAGE':
			return {
				...state,
				rotate: action.rotate,
				imageError: ''
			};

		case 'EDIT_POST_CHANGE_IMAGE_SIZE':
			return {
				...state,
				height: action.height,
				width: action.width
			};

		case 'SET_DRAG_AND_DROP_HOVER':
			return {
				...state,
				dragHover: action.dragHover
			};

		case 'EDIT_POST_IMAGE_NOT_FOUND':
			return {
				...state,
				imageNotFound: true
			};

		case 'EDIT_POST_SET_WAITING_TIME_SUCCESS':
			const waitingTime = action.waitingTime;
			return {
				...state,
				canCreate: waitingTime === 0,
				waitingTime,
			};

		case 'EDIT_POST_CLOSE_TIMER':
		case 'EDIT_POST_SET_WAITING_TIME_ERROR':
			return {
				...state,
				canCreate: true,
				waitingTime: 0
			};

		case 'EDIT_POST_CREATE_NEW':
		case 'EDIT_POST_CLEAR_ALL':
			return {
				...initialState,
				waitingTime: state.waitingTime,
				canCreate: waitingTime === 0
			};
		case 'EDIT_POST_CLEAR_FIELDS':
			return {
				...state,
				tags: ''
			};

		case 'EDIT_POST_INIT_DATA_REQUEST':
			return {
				...state,
				loading: true
			};

		case 'EDIT_POST_INIT_DATA_SUCCESS':
			return {
				...initialState,
				initData: {
					...action.initData
				},
				src: action.initData.src,
				tags: action.initData.tags,
				loading: false
			};

		case 'EDIT_POST_CLEAR':
			return {
				...initialState,
				initData: {
					...state.initData
				},
				src: state.initData.src,
				tags: state.initData.tags
			};

		case 'EDIT_POST_REQUEST':
			return {
				...state,
				loading: true
			};

		case 'EDIT_POST_REJECT':
		case 'EDIT_POST_SUCCESS':
			return {
				...state,
				loading: false
			};

		case 'EDIT_POST_SET_IMAGE_ERROR':
			return {
				...state,
				imageError: action.message
			};
		default:
			return state;
	}
}
