const initialState = {
  data: {},
};

export default function itemsList(state = initialState, action) {
  switch (action.type) {
    case 'TEMP':
      return Object.assign({}, state, {
        data: action.data
      });
    default:
      return state;
  }
}
