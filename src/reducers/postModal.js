export default function postModal(state = {}, action) {
  switch (action.type) {
    case 'INIT_POST_MODAL':
      return action.options;
    default:
      return state;
  }
}
