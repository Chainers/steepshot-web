export default function getComments(state = {}, action) {
	switch (action.type) {
		case 'INIT_POST_COMMENTS':
			return {
				...state,
				[action.options.point]: action.options,
			};
		case 'GET_POST_COMMENT_REQUEST':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					loading: true
				}
			};
		case 'GET_POST_COMMENTS_SUCCESS':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					comments: action.commentsUrls,
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
					comments: [...state[action.point].comments, action.url]
				}
			};
		case 'SCROLL_TO_LAST_COMMENT':
			return {
				...state,
				[action.postIndex]: {
					...state[action.postIndex],
					scrollToLastComment: state[action.postIndex].scrollToLastComment + 1
				}
			};
		default:
			return state;
	}
}
