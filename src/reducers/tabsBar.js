const initialState = {
  search: {
    activeIndex: 0,
    pageLoaded: false
  }
};

export default function tabsBar(state = initialState, action) {
  switch (action.type) {
    case 'SET_ACTIVE_TAB_INDEX':
      return {...state, [action.point]: {
        ...state[action.point], activeIndex: action.index
      }};
    case 'TAB_PAGE_LOADED':
      return {...state, [action.point]: {
          ...state[action.point], pageLoaded: true
        }};
    default:
      return state;
  }
}
