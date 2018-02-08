export default function users(state = {}, action) {
  switch (action.type) {
    case 'GET_USERS_LIST_SUCCESS':
      return {
        ...state, ...action.users
      };

    default:
      return state;
  }
}
