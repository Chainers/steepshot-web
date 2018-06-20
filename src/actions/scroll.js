export function scrollInit(point) {
	return {
		type: 'SCROLL_INIT',
		point
	}
}

export function setScrollData(point, position, scrollHeight) {
	return {
		type: 'SET_SCROLL_DATA',
		position,
		scrollHeight,
		point
	}
}

export function scrollShouldUpdate(point) {
	return {
		type: 'SCROLL_SHOULD_UPDATE',
		point
	}
}

export function scrollDataUpdated(point, height) {
	return {
		type: 'SCROLL_DATA_UPDATED',
		point,
		height
	}
}