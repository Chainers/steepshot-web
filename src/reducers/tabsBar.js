const initialState = {
  activeIndex: 0,
};

export default function tabsBar(state = initialState, action) {
  switch (action.type) {
    case 'SET_ACTIVE_INDEX':
      return {...state, activeIndex: action.index};
    default:
      return state;
  }
}
