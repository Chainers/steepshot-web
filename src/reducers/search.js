const initialState = {
  activeIndex: 0,
  hotSectionOptions: {
    limit: 4,
  },
  ignored: [],
};

export default function search(state = initialState, action) {
  switch (action.type) {
    case 'GET_IGNORED_POSTS_SUCCESS':
      return {
        ...state,
        ignored: action.ignored,
      };
    case 'SET_ACTIVE_INDEX':
      return {...state, activeIndex: action.index};
    default:
      return state;
  }
}
