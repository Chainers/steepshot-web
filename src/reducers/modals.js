const initialState = {};
const defaultOption = {
  alignItems: 'center',
  body: null,
  willClose: false
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
    case 'WILL_CLOSE_MODAL':
      return Object.assign({}, state, {
        [action.index]: Object.assign({},
          state[action.index], {
            willClose: true
          }),
      });
    default:
      return state;
  }
}
