const initialState = {
  text: {},
  count: 0
};

export default function clipboard(state = initialState, action) {
  switch (action.type) {
    case 'COPY_TO_CLIPBOARD':
      return Object.assign({}, state, {
        text: action.text,
        count: ++state.count
      });
    default:
      return state;
  }
}
