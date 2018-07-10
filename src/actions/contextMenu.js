export function openContextMenu(point) {
	return {
		type: 'OPEN_CONTEXT_MENU',
		point
	}
}

export function closeContextMenu(point) {
	return {
		type: 'CLOSE_CONTEXT_MENU',
		point
	}
}