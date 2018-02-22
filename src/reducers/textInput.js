const initialState = {

};

export default function textInput(state = initialState, action) {
  switch (action.type) {
    case 'INIT_TEXT_INPUT':
      return {
        ...state,
        [action.point]: {...action.state}
      };
    case 'TEXT_INPUT_SET_STATE':
      return {
        ...state,
        [action.point]: {
          ...state[action.point],
          ...action.state
        }
      };
    case 'TEXT_INPUT_SET_ERROR':
      return {
        ...state,
        [action.point]: {
          ...state[action.point],
          error: action.message
        }
      };

    default:
      return state;
  }
}
