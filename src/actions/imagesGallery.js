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

export function setActiveImage(index) {
	return {
		type: 'GALLERY_SET_ACTIVE_IMAGE',
		index
	}
}

export function clearGalleryState() {
	return {
		type: 'GALLERY_CLEAR_STATE',
	}
}