export function shouldFetch(point) {
	return {
		type: 'SCROLL_SHOULD_FETCH',
		point
	}
}