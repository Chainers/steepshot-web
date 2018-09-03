export default function users(state = {}, action) {
	switch (action.type) {
		case 'GET_USERS_LIST_SUCCESS':
			return {
				...state,
				...action.users
			};
		case 'CHANGE_FOLLOW_REQUEST_USER_CARD':
			return {
				...state, [action.author]: {
					...state[action.author],
					changingFollowUserCard: true
				}
			};
		case 'CHANGE_FOLLOW_ERROR':
			return {
				...state, [action.author]: {
					...state[action.author],
					changingFollowUserCard: false
				}
			};
		case 'CHANGE_FOLLOW_SUCCESS_USER_CARD':
			return {
				...state, [action.author]: {
					...state[action.author],
					changingFollowUserCard: false,
					has_followed: !state[action.author]['has_followed']
				}
			};
		case 'UPDATE_USER_SUCCESS':
			const updatedUsers = {};
			for (const user in action.updatedUser) {
				updatedUsers[user] = {...state[user], ...action.updatedUser[user]}
			}

			return {
				...state, ...updatedUsers
			};
		default:
			return state;
	}
}
