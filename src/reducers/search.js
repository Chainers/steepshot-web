const initialState = {
  value: ''
};

export default function search(state = initialState, action) {
  switch (action.type) {
    case 'SET_VALUE':
      return Object.assign({}, state, {
        value: action.value
      });
    default:
      return state;
  }
}
