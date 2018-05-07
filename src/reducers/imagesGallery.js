const initialState = {
  isResizeCover: false,
  resizeCoverTimeout: null
};

export default function imagesGallery(state = initialState, action) {
  switch (action.type) {
    case 'SET_RESIZE_COVER_BLOCK':
      return {
        ...state,
        isResizeCover: action.isResizeCover,
        resizeCoverTimeout: action.resizeCoverTimeout
      };
    default:
      return state;
  }
}
