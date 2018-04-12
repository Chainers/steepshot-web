export default function getComments(state = {}, action) {
	switch (action.type) {
		case 'INIT_POST_COMMENTS':
			return {
				...state,
				[action.options.point]: action.options,
			};

		case 'GET_POST_COMMENTS_SUCCESS':
			return {
				...state,
				[action.point]: {
					comments: action.comments,
					loading: false
				}
			};
		default:
			return state;
	}
}
