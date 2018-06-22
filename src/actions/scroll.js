export function scrollInit(point) {
	return {
		type: 'SCROLL_INIT',
		point
	}
}

export function shouldFetch(point) {
	return {
		type: 'SCROLL_SHOULD_FETCH',
		point
	}
}

export function scrollShouldUpdate(point) {
	return {
		type: 'SCROLL_SHOULD_UPDATE',
		point
	}
}