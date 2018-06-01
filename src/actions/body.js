export function scrollingBody(position, scrollTop, scrollHeight) {
	return {
		type: 'SCROLLING_BODY',
		position,
		scrollTop,
		scrollHeight
	}
}

export function bodyShouldUpdate() {
	return {
		type: 'BODY_SHOULD_UPDATE'
	}
}