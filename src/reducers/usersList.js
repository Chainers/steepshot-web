export default function usersList(state = {}, action) {
  switch (action.type) {
    case 'INIT_USERS_LIST':
      return Object.assign({}, state, {
        [action.options.point]: action.options,
      });
    case 'GET_USERS_LIST_REQUEST':
      return Object.assign({}, state, {
        [action.point]: Object.assign({}, state[action.point], {
          loading: true,
        }),
      });
    case 'SET_USERS_SEARCH_VALUE':
      return Object.assign({}, state, {
        [action.point]: Object.assign({}, state[action.point], {
          options: {
            query: action.searchValue
          },
        }),
      });
    case 'CLEAR_USERS':
      return Object.assign({}, state, {
        [action.point]: {}
      });
    case 'GET_USERS_LIST_SUCCESS':
      return Object.assign({}, state, {
        [action.options.point]: Object.assign({}, state[action.options.point], {
          loading : false,
          hasMore : action.options.hasMore,
          users: [...state[action.options.point].users, ...action.options.users],
          offset: action.options.offset,
          loader: false
        }),
      });

    default:
      return state;
  }
}
