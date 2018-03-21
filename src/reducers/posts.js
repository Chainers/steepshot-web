export default function posts(state = {}, action) {
  switch (action.type) {

    case 'GET_POSTS_LIST_SUCCESS':
    case 'ADD_POSTS':
      return {
        ...state,
        ...action.posts
      };

    case 'UPDATE_POST':
      return {
        ...state,
        [action.post.url]: action.post,
      };

    case 'TOGGLE_FLAG_REQUEST':
      return {
        ...state,
        [action.index]: {
          ...state[action.index],
          flag: !state[action.index].flag,
          flagLoading: true,
        }
      };

    case 'TOGGLE_FLAG_FAILURE':
      return {
        ...state,
        [action.index]: {
          ...state[action.index],
          flag: !state[action.index].flag,
          flagLoading: false,
        }
      };

    case 'TOGGLE_FLAG_SUCCESS':
      return {
        ...state,
        [action.index]: {
          ...state[action.index],
          flagLoading: false,
        },
      };

    case 'TOGGLE_VOTE_REQUEST':
      return {
        ...state,
        [action.index]: {
          ...state[action.index],
          vote: !state[action.index].vote,
          voteLoading: true,
        },
      };

    case 'TOGGLE_VOTE_FAILURE':
      return {
        ...state,
        [action.index]: {
          ...state[action.index],
          vote: !state[action.index].vote,
          voteLoading: false,
        },
      };

    case 'TOGGLE_VOTE_SUCCESS':
      return {
        ...state,
        [action.index]: {
          ...state[action.index],
          voteLoading: false,
        },
      };

    case 'SEND_DELETE_POST':
      return {
        ...state,
        [action.index]: {
          ...state[action.index],
          postDeleting: true
        }
      };

    case 'SUCCESS_DELETE_POST':
      let copyState = {...state};
      delete copyState[action.index];
      return copyState;

    case 'FAILURE_DELETE_POST':
      return {
        ...state,
        [action.index]: {
          ...state[action.index],
          postDeleting: false
        }
      };
    case 'POWER_OF_LIKE_IND':
      return {
        ...state,
        [action.index]: {
          ...state[action.index],
          isPLOpen: action.isPLOpen
        }
      };
    case 'POWER_OF_LIKE_TIMEOUT':
      return {
        ...state,
        [action.index]: {
          ...state[action.index],
          plTimeout: action.plTimeout
        }
      };


    default:
      return state;
  }
}
