const initialState = {
  text: {},
};

export default function clipboard(state = initialState, action) {
  switch (action.type) {
    case 'COPY_TO_CLIPBOARD':
      return Object.assign({}, state, {
        text: action.text
      });
    default:
      return state;
  }
}
