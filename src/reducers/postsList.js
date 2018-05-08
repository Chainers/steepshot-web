export default function postsList(state = {}, action) {
	switch (action.type) {
		case 'INIT_POSTS_LIST':
			return {
				...state,
				[action.options.point]: action.options,
			};

		case 'GET_POSTS_LIST_REQUEST':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					loading: true,
				},
			};

		case 'GET_POSTS_LIST_SUCCESS':
			return {
				...state,
				[action.options.point]: {
					...state[action.options.point],
					posts: [
						...state[action.options.point].posts,
						...action.options.posts
					],
					offset: action.options.offset,
					hasMore: action.options.hasMore,
					loading: false,
					length: state[action.options.point].length + action.options.length
				},
			};

		case 'GET_POSTS_LIST_ERROR':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					loading: false,
					hasMore: false,
					errorMessage: action.error
				},
			};

		default:
			return state;
	}
}
