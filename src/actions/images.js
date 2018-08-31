export function imageLoadError(imageUrl) {
  return {
    type: "IMAGE_LOAD_ERROR",
    imageUrl
  };
}

export function imageLoadSuccess(imageUrl) {
  return {
    type: "IMAGE_LOAD_SUCCESS",
    imageUrl
  };
}
