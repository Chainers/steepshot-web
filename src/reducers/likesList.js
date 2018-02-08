const initialState = {
  preferredBodyHeight: 100,
  fullBodyHeight: 100
};

export default function likesList(state = initialState, action) {
  switch (action.type) {
    case 'SET_LIKES_LIST_BODY_HEIGHT':
      return {
        ...state,
        preferredBodyHeight: action.preferredBodyHeight,
        fullBodyHeight: action.fullBodyHeight
      };

    case 'CLEAR_BODY_HEIGHT':
      return initialState;

    default:
      return state;
  }
}
