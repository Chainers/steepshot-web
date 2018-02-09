export default function users(state = {}, action) {
  switch (action.type) {
    case 'GET_USERS_LIST_SUCCESS':
      return {
        ...state, ...action.users
      };
    case 'TOGGLE_FOLLOW_REQUEST':
      return {
        ...state, [action.author]: {
          ...state[action.author],
          togglingFollow: true
        }
      };
    case 'TOGGLE_FOLLOW_FAILURE':
      return {
        ...state, [action.author]: {
          ...state[action.author],
          togglingFollow: false
        }
      };
    case 'UPDATE_USER_SUCCESS':
      return {
        ...state, ...action.updatedUser
      };
    default:
      return state;
  }
}
