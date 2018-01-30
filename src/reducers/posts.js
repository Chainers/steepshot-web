export default function posts(state = {}, action) {
  switch (action.type) {

    case 'ADD_POSTS':
      return Object.assign({},
        state,
        action.posts);

    case 'UPDATE_POST':
      return Object.assign({}, state, {
        [action.post.url]: action.post,
      });

    case 'TOGGLE_FLAG_REQUEST':
      return Object.assign({}, state, {
        [action.index]: Object.assign({}, state[action.index], {
          flag: !state[action.index].flag,
          flagLoading: true,
        }),
      });

    case 'TOGGLE_FLAG_FAILURE':
      return Object.assign({}, state, {
        [action.index]: Object.assign({}, state[action.index], {
          flag: !state[action.index].flag,
          flagLoading: false,
        }),
      });

    case 'TOGGLE_FLAG_SUCCESS':
      return Object.assign({}, state, {
        [action.index]: Object.assign({}, state[action.index], {
          flagLoading: false,
        }),
      });

    case 'TOGGLE_VOTE_REQUEST':
      return Object.assign({}, state, {
        [action.index]: Object.assign({}, state[action.index], {
          vote: !state[action.index].vote,
          voteLoading: true,
        }),
      });

    case 'TOGGLE_VOTE_FAILURE':
      return Object.assign({}, state, {
        [action.index]: Object.assign({}, state[action.index], {
          vote: !state[action.index].vote,
          voteLoading: false,
        }),
      });

    case 'TOGGLE_VOTE_SUCCESS':
      return Object.assign({}, state, {
        [action.index]: Object.assign({}, state[action.index], {
          voteLoading: false,
        }),
      });

    case 'SEND_DELETE_POST':
      return Object.assign({}, state, {
        [action.index]: Object.assign({}, state[action.index], {
          postDeleting: true
        })
      });
    case 'SUCCESS_DELETE_POST':
      let copyState = Object.assign({}, state);
      delete copyState[action.index];
      return copyState;
    case 'FAILURE_DELETE_POST':
      return Object.assign({}, state, {
        [action.index]: Object.assign({}, state[action.index], {
          postDeleting: false
        })
      });

    default:
      return state;
  }
}
