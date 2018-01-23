export default function postModal(state = {}, action) {
  switch (action.type) {
    case 'INIT_POST_MODAL':
      return action.options;
      
    case 'SET_POST_MODAL_OPTIONS':
      return Object.assign({}, state, action.options);
      
    default:
      return state;
  }
}
