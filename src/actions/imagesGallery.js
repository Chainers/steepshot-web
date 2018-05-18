export function setGalleryImage(postIndex, imageNumberInGallery) {
  return {
    type: 'SET_GALLERY_IMG',
    postIndex,
    imageNumberInGallery
  }
}

export function setImageCompleteStatus(postIndex, isComplete) {
  return {
    type: 'SET_IMAGE_COMPLETE_STATUS',
    postIndex,
    isComplete
  }
}