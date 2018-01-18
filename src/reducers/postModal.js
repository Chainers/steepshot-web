const initialState = {
  close: true,
  index: null
};

export default function postModal(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_POST_MODAL':
      return Object.assign({}, state, {
        close: false,
        index: action.index
      });
    default:
      return state;
  }
}
