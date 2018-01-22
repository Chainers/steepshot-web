const initialState = {};
const defaultOption = {
  alignSelf: 'center',
  fullScreen: false,
  closeButton: true,
  body: null,
  callBeforeClosed: () => {},
  callAfterClosed: () => {},
  point: 'without',
};

export default function modals(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_MODAL':
      return Object.assign({}, state, {
        [action.index]: Object.assign({},
          defaultOption, action.options),
      });
    case 'CLOSE_ALL_MODALS':
      return initialState;
    case 'SET_MODAL_OPTIONS':
      return Object.assign({}, state, {
        [action.index]: Object.assign({},
          state[action.index], action.options),
      });
    case 'CLOSE_MODAL':
      let newState = Object.assign({}, state);
      delete newState[action.index];
      return newState;
    default:
      return state;
  }
}
