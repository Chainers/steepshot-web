const initialState = {
  style: {},
  needsCommentFormLoader: false
};

export default function postModal(state = initialState, action) {
  switch (action.type) {
    case 'INIT_POST_MODAL':
      return Object.assign({}, initialState, action.options);
      
    case 'SET_POST_MODAL_OPTIONS':
      return Object.assign({}, state, action.options);
      
    default:
      return state;
  }
}
