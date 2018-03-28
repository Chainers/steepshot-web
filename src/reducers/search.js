const initialState = ''

export default function search(state = initialState, action) {
  switch (action.type) {
    case 'SET_SEARCH_VALUE':
      return action.value;

    default:
      return state;
  }
}
