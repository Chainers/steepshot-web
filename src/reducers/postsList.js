import Constants from '../common/constants';

const initialState = {
  [Constants.POSTS_FILTERS.POSTS_HOT.point]: {
  
  }
};

export default function postsList(state = initialState, action) {
  switch (action.type) {
    case 'INIT_POSTS_LIST':
      return Object.assign({}, state, {
          [action.options.point]: action.options
        });
      case 'GET_POSTS_LIST_REQUEST':
      return Object.assign({}, state, {
          [action.point]: Object.assign({}, state[action.point], {
            loading: true
          })
        });
    case 'GET_POSTS_LIST_SUCCESS':
      return Object.assign({}, state, {
        [action.options.point]: Object.assign({}, state[action.options.point], {
          posts: Object.assign({} ,
            state[action.options.point].posts,
            action.options.posts),
          offset: action.options.offset,
          hasMore: action.options.hasMore,
          loading: false,
          length: state[action.options.point].length +
            action.options.length
        })
      });
    default:
      return state;
  }
}
