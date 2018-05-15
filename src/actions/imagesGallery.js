export function setGalleryImgIndex(postIndex, imgIndex) {
  return {
    type: 'SET_GALLERY_IMG_INDEX',
    postIndex,
    imgIndex
  }
}

export function setResizeCoverBlock(isResizeCover, resizeCoverTimeout) {
  return {
    type: 'SET_RESIZE_COVER_BLOCK',
    isResizeCover,
    resizeCoverTimeout
  }
}

export function setGalleryImage(postIndex, imageNumber) {
  return {
    type: 'SET_GALLERY_IMG',
    postIndex,
    imageNumber
  }
}