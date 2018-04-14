const initialState = {
  isResizeCover: false,
  rcTimeout: null
};

export default function imagesGallery(state = initialState, action) {
  switch (action.type) {
    case 'SET_RESIZE_COVER_BLOCK':
      return {
        ...state,
        isResizeCover: action.isResizeCover,
        rcTimeout: action.rcTimeout
      };
    default:
      return state;
  }
}
