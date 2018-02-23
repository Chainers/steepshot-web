const initialState = {
  style: {},
  needsCommentFormLoader: false,
  fullScreenMode: false,
  fullScreenNavigation: true,
  timeoutID: null
};

export default function postModal(state = initialState, action) {
  switch (action.type) {
    case 'INIT_POST_MODAL':
      return {...initialState, ...action.options};

    case 'SET_POST_MODAL_OPTIONS':
      return {...state, ...action.options};

    case 'SWAP_POST_MODAL':
      return {
        ...initialState,
        point: state.point,
        currentIndex: action.index,
        fullScreenMode: state.fullScreenMode,
        fullScreenNavigation: state.fullScreenNavigation,
        timeoutID: state.timeoutID
      };

    case 'SET_FULL_SCREEN':
      return {...state, fullScreenMode: action.isOpen, timeoutID: action.timeoutID};

    case 'SET_FULL_SCREEN_NAVIGATION':
      return {...state, fullScreenNavigation: action.isVisible};

    default:
      return state;
  }
}
