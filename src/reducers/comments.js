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
		case 'SENDING_NEW_COMMENT':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					sendingNewComment: action.flag
				}
			};
		case 'ADDED_NEW_COMMENT':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					comments: [...state[action.point].comments, action.comment]
				}
			};
		case 'SCROLL_TO_LAST_COMMENT':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					scrollToLastComment: state[action.point].scrollToLastComment + 1
				}
			};
		default:
			return state;
	}
}
