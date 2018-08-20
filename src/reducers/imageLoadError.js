const initialState = [];

export default function imageLoadError(state = initialState, action) {
  switch (action.type) {
    case "IMAGE_LOAD_ERROR":
      return [...state, action.imageUrl];
    default:
      return state;
  }
}
