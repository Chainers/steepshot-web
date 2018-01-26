import Constants from '../common/constants';

const initialState = {
  activeIndex: 0,
  hotSectionOptions: {
    limit: 4,
  },
  showResults: false,
  keys: [
    {label: Constants.SEARCH_FILTERS.CATEGORIES.label},
    {label: Constants.SEARCH_FILTERS.USERS.label},
  ],
  ignored: [],
  needsForceRefresh: true
};

export default function search(state = initialState, action) {
  switch (action.type) {
    case 'GET_IGNORED_POSTS_REQUEST':
      return initialState;
    case 'GET_IGNORED_POSTS_SUCCESS':
      return {...state,
        ignored: action.ignored,
        showResults: true,
        activeIndex: 0
      };
    case 'SET_ACTIVE_INDEX':
      return {...state, activeIndex: action.index};
    case 'USERS_REFRESHED':
      return {...state, needsForceRefresh: false};
    default:
      return state;
  }
}
