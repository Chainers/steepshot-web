const initialState = {
  isTip: false,
  tipTimeout: null
};

export default function avatar(state = initialState, action) {
  switch (action.type) {
    case 'SET_AVATAR_TIP':
      return {
        ...state,
        isTip: action.isTip
      };
    case 'SET_AVATAR_TIP_TIMEOUT':
      return {
        ...state,
        tipTimeout: action.tipTimeout
      };

    default:
      return state;
  }
}
