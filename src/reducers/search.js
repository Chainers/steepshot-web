const initialState = {
  activeIndex: 0,
  hotSectionOptions: {
    limit: 4,
  }
};

export default function search(state = initialState, action) {
  switch (action.type) {
    case 'SET_ACTIVE_INDEX':
      return {...state, activeIndex: action.index};
    default:
      return state;
  }
}
