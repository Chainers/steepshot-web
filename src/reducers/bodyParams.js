const initialState = {
  offsetTop: 0
};

export default function bodyParams(state = initialState, action) {
  switch (action.type) {
    case 'GET_BODY_OFFSET':
      return {
        ...state,
        offsetTop: action.offsetTop
      };

    default:
      return state;
  }
}
