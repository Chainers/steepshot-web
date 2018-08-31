export function addImageLink(originalUrl, size, fullUrl) {
	let imageLink = {[originalUrl]: {
			size,
			src: fullUrl || originalUrl
		}};
	return {
		type: 'ADD_IMAGE_LINK',
		imageLink
	}
}

export function imageLoadError(imageUrl) {
	return {
		type: 'IMAGE_LOAD_ERROR',
		imageUrl
	}
}

export function imageLoadSuccess(imageUrl) {
	return {
		type: 'IMAGE_LOAD_SUCCESS',
		imageUrl
	}
}