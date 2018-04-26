export function setGalleryImgIndex(postIndex, imgIndex) {
  return {
    type: 'SET_GALLERY_IMG_INDEX',
    postIndex,
    imgIndex
  }
}

export function setResizeCoverBlock(isResizeCover, rcTimeout) {
  return {
    type: 'SET_RESIZE_COVER_BLOCK',
    isResizeCover,
    rcTimeout
  }
}