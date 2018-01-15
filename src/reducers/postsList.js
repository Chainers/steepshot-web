const initialState = {

};

export default function postsList(state = initialState, action) {
  switch (action.type) {
    case 'INIT_POSTS_LIST':
      return Object.assign({}, state, {
          [action.option.point]: {
            ...action.option
          }
        });
      case 'GET_POSTS_LIST_REQUEST':
      return Object.assign({}, state, {
          [action.option.point]: {
            loading: true
          }
        });
    case 'GET_POSTS_LIST_SUCCESS':
      return Object.assign({}, state, {
        [action.option.point]: Object.assign({}, state[action.option.point], {
          posts: [...state[action.option.point].posts, ...action.options.posts],
          offset: action.options.offset,
          hasMore: action.options.hasMore,
          loading: false
        })
      });
    default:
      return state;
  }
}
