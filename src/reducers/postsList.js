const initialState = {
  posts: {},
};

export default function postsList(state = initialState, action) {
  switch (action.type) {
    case 'INIT_POSTS_LIST':
      return Object.assign({}, state, {
        [action.options.point]: action.options,
      });
    case 'GET_POSTS_LIST_REQUEST':
      return Object.assign({}, state, {
        [action.point]: Object.assign({}, state[action.point], {
          loading: true,
        }),
      });
    case 'GET_POSTS_LIST_SUCCESS':
      return Object.assign({}, state, {
        
        posts: Object.assign({},
          state.posts,
          action.posts),
        
        [action.options.point]: Object.assign({}, state[action.options.point], {
          postsIndices: [
            ...state[action.options.point].postsIndices,
            ...action.options.postsIndices],
          offset: action.options.offset,
          hasMore: action.options.hasMore,
          loading: false,
          length: state[action.options.point].length +
          action.options.length,
        }),
      });
    case 'TOGGLE_FLAG_REQUEST':
      return Object.assign({}, state, {
        posts: Object.assign({}, state.posts, {
          [action.index]: Object.assign({}, state.posts[action.index], {
            flag: !state.posts[action.index].flag,
            flagLoading: true
          })
        }),
      });
    case 'TOGGLE_FLAG_FAILURE':
      return Object.assign({}, state, {
        posts: Object.assign({}, state.posts, {
          [action.index]: Object.assign({}, state.posts[action.index], {
            flag: !state.posts[action.index].flag,
            flagLoading: false
          })
        }),
      });
    case 'TOGGLE_FLAG_SUCCESS':
      return Object.assign({}, state, {
        posts: Object.assign({}, state.posts, {
          [action.index]: Object.assign({}, state.posts[action.index], {
            flagLoading: false
          })
        }),
      });
    case 'TOGGLE_VOTE_REQUEST':
      return Object.assign({}, state, {
        posts: Object.assign({}, state.posts, {
          [action.index]: Object.assign({}, state.posts[action.index], {
            vote: !state.posts[action.index].vote,
            voteLoading: true
          })
        }),
      });
    case 'TOGGLE_VOTE_FAILURE':
      return Object.assign({}, state, {
        posts: Object.assign({}, state.posts, {
          [action.index]: Object.assign({}, state.posts[action.index], {
            vote: !state.posts[action.index].vote,
            voteLoading: false
          })
        }),
      });
    case 'TOGGLE_VOTE_SUCCESS':
      return Object.assign({}, state, {
        posts: Object.assign({}, state.posts, {
          [action.index]: Object.assign({}, state.posts[action.index], {
            voteLoading: false
          })
        }),
      });
    default:
      return state;
  }
}
